# search_script.py
from fuzzywuzzy import fuzz
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from products.models import Products

def fetch_products():
    all_products = Products.objects.all()
    products = []
    for p in all_products:
        products.append({
            "id": p.id,
            "name": p.name,
            "description": p.description or "",
            "price": float(p.price),
            "stock": p.stock,
            "category": p.category,
            "brand": p.brand,
            "rating": float(p.rating)
        })
    return products

def fuzzy_search(query, products, threshold=70):
    results = []
    for product in products:
        combined = (product["name"] + " " + product["description"]).lower()
        score = fuzz.partial_ratio(query.lower(), combined)
        if score >= threshold:
            results.append((product, score))
    results.sort(key=lambda x: x[1], reverse=True)
    return [r[0] for r in results]

def semantic_search(query, products):
    docs = [p["name"] + " " + p["description"] for p in products]
    vectorizer = TfidfVectorizer().fit(docs + [query])
    vectors = vectorizer.transform(docs + [query])
    similarities = cosine_similarity(vectors[-1], vectors[:-1]).flatten()
    ranked = sorted(zip(products, similarities), key=lambda x: x[1], reverse=True)
    return [p for p, score in ranked if score > 0.1]

def hybrid_search(query, products):
    fuzzy_results = fuzzy_search(query, products)
    semantic_results = semantic_search(query, products)

    seen_ids = set()
    final = []

    for prod in fuzzy_results + semantic_results:
        if prod["id"] not in seen_ids:
            final.append(prod)
            seen_ids.add(prod["id"])
    
    # print([prod["id"] for prod in products])
    # print(final)
    return final