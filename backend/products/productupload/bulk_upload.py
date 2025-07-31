import csv
import requests
import os

# The URL of your API endpoint
API_URL = "http://127.0.0.1:8000/prod/products/add/special/pass_zenith"

# The path to your CSV file
CSV_FILE_PATH = "C:/Users/zenit/programming/github_projects/AASF_project/backend/products/productupload/products.csv"

def upload_products():
    """
    Reads product data from a CSV and uploads it to the API.
    Can handle both local file paths and direct image URLs.
    """
    with open(CSV_FILE_PATH, mode='r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        print("🚀 Starting product upload...")

        for row in reader:
            product_data = {
                'name': row['name'],
                'description': row['description'],
                'price': row['price'],
                'stock': row['stock'],
                'category': row['category'],
                'brand': row['brand'],
                'rating': row['rating'],
            }

            files_to_upload = []
            local_files_to_close = []
            image_keys = ['image1', 'image2', 'image3', 'image4', 'image5']

            for key in image_keys:
                path_or_url = row.get(key, '').strip()
                if not path_or_url:
                    continue

                if path_or_url.startswith('http'):
                    try:
                        response = requests.get(path_or_url, timeout=10)
                        if response.status_code == 200:

                            clean_product_name = "".join(c for c in row['name'] if c.isalnum() or c in (' ', '_')).rstrip()
                            filename = f"{clean_product_name.replace(' ', '_')}_{key}.png"
                            
                            files_to_upload.append(
                                ('uploaded_images', (filename, response.content, 'image/png'))
                            )
                        else:
                            print(f"   ⚠️  Warning: Failed to download image from URL: {path_or_url}")
                    except requests.exceptions.RequestException as e:
                        print(f"   ⚠️  Warning: Could not download {path_or_url}. Error: {e}")

                elif os.path.exists(path_or_url):
                    f = open(path_or_url, 'rb')
                    local_files_to_close.append(f)
                    files_to_upload.append(
                        ('uploaded_images', (os.path.basename(path_or_url), f))
                    )
                else:
                    print(f"   ⚠️  Warning: File or URL not found for {key}: {path_or_url}")

            # Now, send the request
            try:
                response = requests.post(API_URL, data=product_data, files=files_to_upload)
                if response.status_code == 201:
                    print(f"✅ Successfully uploaded: {row['name']}")
                else:
                    print(f"❌ FAILED to upload: {row['name']}. Status: {response.status_code}, Response: {response.text}")
            
            finally:
                for f in local_files_to_close:
                    f.close()

    print("\n Bulk upload complete!")


if __name__ == "__main__":
    upload_products()