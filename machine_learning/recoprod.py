import pandas as pd
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import classification_report

db_user = 'your_username'
db_password = 'your_password'
db_host = 'localhost'
db_port = '5432'
db_name = 'your_database'

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

encoder = OneHotEncoder(handle_unknown='ignore')
X = encoder.fit_transform(full_data[['product_name', 'category', 'prev_product', 'prev_category']])
y = full_data['label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = LogisticRegression()
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred))

# recommend for user 1
user_history = data[data['user_id'] == 1].sort_values('date_bought')
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

top3 = candidates.sort_values('score', ascending=False).head(3)
print("Top 3 recommended products for user 1:")
print(top3[['product_name', 'score']])
