import pandas as pd
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import classification_report
from products.models import Products
from cart.models import Cart, Cartitem, Orders


def fetch_data():
    orders_all = Orders.objects.select_related("user", "cart").all()

    res = []
    for order in orders_all:
        cart = order.cart

        if cart:
            cart_items = Cartitem.objects.filter(cart=cart).select_related('product')
            for item in cart_items:
                res.append({
                    "user_id": order.user.id,
                    "product_id": item.product.id,
                    "product_name": item.product.name,
                    "category": item.product.category,
                    "date_bought": order.bought_at
                })
    return res

def recoprod(curr_user_id):
    # Fetch data directly from your Django models
    raw_data = fetch_data()
    data = pd.DataFrame(raw_data)

    if data.empty:
        print("No data available to train the model or make recommendations.")
        return []

    data['date_bought'] = pd.to_datetime(data['date_bought'])
    data.sort_values(['user_id', 'date_bought'], inplace=True)
    data['prev_product'] = data.groupby('user_id')['product_name'].shift(1)
    data['prev_category'] = data.groupby('user_id')['category'].shift(1)
    data = data.dropna(subset=['prev_product', 'prev_category'])

    all_products_info = data[['product_id', 'product_name', 'category']].drop_duplicates().set_index('product_name')
    all_products = data['product_name'].unique()
    
    negative_samples = []

    for user_id in data['user_id'].unique():
        user_products_bought = data[data['user_id'] == user_id]['product_name'].unique()
        
        for _, row in data[data['user_id'] == user_id].iterrows():
            bought_next = row['product_name']
            # Select negative samples that the user has NOT bought
            negative_candidates = [p for p in all_products if p not in user_products_bought and p != bought_next]
            
            if negative_candidates:
                # For simplicity, pick the first available negative product.
                # In a real scenario, you might want a more sophisticated sampling strategy.
                negative_product_name = negative_candidates[0] 
                
                negative_samples.append({
                    'user_id': user_id,
                    'product_name': negative_product_name,
                    'prev_product': row['prev_product'],
                    'prev_category': row['prev_category'],
                    'category': all_products_info.loc[negative_product_name, 'category'],
                    'label': 0
                })

    neg_df = pd.DataFrame(negative_samples)

    pos_df = data[['user_id', 'product_name', 'category', 'prev_product', 'prev_category']].copy()
    pos_df['label'] = 1

    full_data = pd.concat([pos_df, neg_df], ignore_index=True)

    # Features for encoding
    categorical_features = ['product_name', 'category', 'prev_product', 'prev_category']
    encoder = OneHotEncoder(handle_unknown='ignore')
    X = encoder.fit_transform(full_data[categorical_features])
    y = full_data['label']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y) # Added stratify

    clf = LogisticRegression(solver='liblinear', random_state=42) # Added solver and random_state
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    print(classification_report(y_test, y_pred))

    # Recommend for the current user
    user_history = data[data['user_id'] == curr_user_id].sort_values('date_bought')

    if user_history.empty:
        # As a fallback, you might recommend top-selling products or new arrivals here.
        # For now, we'll return an empty list.
        return []

    last_product_name = user_history.iloc[-1]['product_name']
    last_category = user_history.iloc[-1]['category']

    # Products the current user has already bought
    user_bought_products = user_history['product_name'].unique()

    # Candidate products for recommendation (those not yet bought by the user)
    candidate_product_names = [p for p in all_products if p not in user_bought_products]

    if not candidate_product_names:
        print(f"User {curr_user_id} has bought all available products. No new recommendations.")
        return []

    candidates_data = {
        'product_name': candidate_product_names,
        'category': [all_products_info.loc[p, 'category'] for p in candidate_product_names],
        'prev_product': [last_product_name] * len(candidate_product_names),
        'prev_category': [last_category] * len(candidate_product_names),
    }
    candidates_df = pd.DataFrame(candidates_data)

    X_candidates = encoder.transform(candidates_df[categorical_features])
    scores = clf.predict_proba(X_candidates)[:, 1]
    candidates_df['score'] = scores

    # Get the product_id for recommended products
    recommended_with_ids = candidates_df.merge(
        all_products_info.reset_index(),
        on='product_name',
        how='left'
    )

    top4 = recommended_with_ids.sort_values('score', ascending=False).head(4)

    return top4['product_id'].tolist()