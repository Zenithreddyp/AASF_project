import pandas as pd
from sqlalchemy import create_engine
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

from pathlib import Path
import os #added manually
import environ #reads .env files

BASE_DIR = Path(__file__).resolve().parent.parent

#adding manually
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))




# Optional: cache this to avoid retraining every time
encoder = OneHotEncoder(handle_unknown='ignore')
clf = LogisticRegression()

def train_model():
    db_user = env('DB_USER')
    db_password = env('DB_PASSWORD')
    db_host = env('DB_HOST', default='localhost')
    db_port = env('DB_PORT', default='5432')
    db_name = env('DB_NAME')

    connection_string = f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    engine = create_engine(connection_string)

    query = "SELECT user_id, product_id, product_name, category, date_bought FROM your_table_name"
    data = pd.read_sql(query, engine)

    data.sort_values(['user_id', 'date_bought'], inplace=True)
    data['prev_product'] = data.groupby('user_id')['product_name'].shift(1)
    data['prev_category'] = data.groupby('user_id')['category'].shift(1)
    data = data.dropna()

    all_products = data['product_name'].unique()
    negative_samples = []

    for _, row in data.iterrows():
        user = row['user_id']
        bought_next = row['product_name']
        negative = [p for p in all_products if p != bought_next]
        if negative:
            negative_product = negative[0]
            negative_samples.append({
                'user_id': user,
                'product_name': negative_product,
                'prev_product': row['prev_product'],
                'prev_category': row['prev_category'],
                'category': data.loc[data['product_name'] == negative_product, 'category'].iloc[0],
                'label': 0
            })

    neg_df = pd.DataFrame(negative_samples)

    pos_df = data[['user_id', 'product_name', 'category', 'prev_product', 'prev_category']].copy()
    pos_df['label'] = 1

    full_data = pd.concat([pos_df, neg_df])

    X = encoder.fit_transform(full_data[['product_name', 'category', 'prev_product', 'prev_category']])
    y = full_data['label']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    clf.fit(X_train, y_train)

    print("Model trained.")
    print(classification_report(y_test, clf.predict(X_test)))

    return data, encoder, clf

def recommend(user_id, data, encoder, clf, top_n=3):
    all_products = data['product_name'].unique()
    user_history = data[data['user_id'] == user_id].sort_values('date_bought')

    if user_history.empty:
        return []

    last_product = user_history.iloc[-1]['product_name']
    last_category = user_history.iloc[-1]['category']

    candidates = pd.DataFrame({
        'product_name': all_products,
        'category': [data[data['product_name'] == p]['category'].iloc[0] for p in all_products],
        'prev_product': [last_product]*len(all_products),
        'prev_category': [last_category]*len(all_products),
    })

    X_candidates = encoder.transform(candidates)
    scores = clf.predict_proba(X_candidates)[:, 1]
    candidates['score'] = scores

    top = candidates.sort_values('score', ascending=False).head(top_n)
    return top[['product_name', 'score']].to_dict(orient='records')
