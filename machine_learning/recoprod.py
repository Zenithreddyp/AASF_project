from django.db.models import F
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import classification_report
import pandas as pd

def get_recommendations(user_id):
    orders_data = Orders.objects.filter(user_id=user_id)\
        .select_related('cart')\
        .prefetch_related('cart__items__product')\
        .order_by('bought_at')
    
    data = []
    for order in orders_data:
        for item in order.cart.items.all():
            data.append({
                'user_id': order.user_id,
                'product_id': item.product.id,
                'product_name': item.product.name,
                'category': item.product.category,
                'bought_at': order.bought_at
            })
    
    df = pd.DataFrame(data)
    if df.empty:
        return {'recommended_product_ids': []}
    
    df.sort_values(['user_id', 'bought_at'], inplace=True)
    df['prev_product'] = df.groupby('user_id')['product_name'].shift(1)
    df['prev_category'] = df.groupby('user_id')['category'].shift(1)
    df = df.dropna()

    all_products = Products.objects.all().values('id', 'name', 'category')
    all_products_df = pd.DataFrame(list(all_products))
    
    negative_samples = []
    for _, row in df.iterrows():
        user = row['user_id']
        bought_next = row['product_id']
        candidate_products = all_products_df[all_products_df['id'] != bought_next]
        if not candidate_products.empty:
            negative_row = candidate_products.sample(1).iloc[0]
            negative_samples.append({
                'user_id': user,
                'product_id': negative_row['id'],
                'product_name': negative_row['name'],
                'category': negative_row['category'],
                'prev_product': row['prev_product'],
                'prev_category': row['prev_category'],
                'label': 0
            })

    neg_df = pd.DataFrame(negative_samples)
    pos_df = df[['user_id', 'product_id', 'product_name', 'category', 'prev_product', 'prev_category']].copy()
    pos_df['label'] = 1

    full_data = pd.concat([pos_df, neg_df])
    
    encoder = OneHotEncoder(handle_unknown='ignore')
    X = encoder.fit_transform(full_data[['product_name', 'category', 'prev_product', 'prev_category']])
    y = full_data['label']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    clf = LogisticRegression()
    clf.fit(X_train, y_train)

    user_history = df[df['user_id'] == user_id].sort_values('bought_at')
    last_product = user_history.iloc[-1]['product_name']
    last_category = user_history.iloc[-1]['category']

    candidates = all_products_df.copy()
    candidates['prev_product'] = last_product
    candidates['prev_category'] = last_category

    X_candidates = encoder.transform(candidates[['product_name', 'category', 'prev_product', 'prev_category']])
    candidates['score'] = clf.predict_proba(X_candidates)[:, 1]

    top3 = candidates.sort_values('score', ascending=False).head(3)
    recommended_product_ids = top3['id'].tolist()
    
    return {'recommended_product_ids': recommended_product_ids}