import uuid
import datetime as dt
from flask import jsonify
from models.product import Product
from utils.image_setup import upload_multiple_images , update_multiple_images , delete_old_images

def create_product(data, images):
    product_id = str(uuid.uuid4())
    name = data.get("name")
    description = data.get("description")
    price = data.get("price")
    category_id = data.get("category_id")
    stock = data.get("stock")
    tag = data.get("tag")
    created_at = str(dt.datetime.now())
    updated_at = str(dt.datetime.now())
    image_urls = upload_multiple_images(images, "Product", category_id)

    if not all([name, price, category_id]):
        return jsonify({"error": "Name, price, and category ID are required"}), 400

    product = Product(
        name=name,
        product_id= product_id,
        description=description,
        price=price,
        image_urls=image_urls,
        category_id=category_id,
        stock=stock,
        tag=tag,
        created_at=created_at,
        updated_at=updated_at
    )

    try:
        product.create_product()
        return jsonify({"message": "Product created successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to create product: {str(e)}"}), 500


def get_all_products():
    try:
        products = Product.get_all_products()
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch products: {str(e)}"}), 500

def get_all_product_based_cat_id(data):
    category_id = data.get("category_id")
    if not category_id:
        return jsonify({"error": "Category ID is required"}), 400

    try:
        products = Product.get_all_based_on_cat(category_id)  # Use lowercase variable 'products' for the result
        return jsonify({"products": products}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_product_by_id(product_id):
    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    try:
        product = Product.get_product_by_id(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        return jsonify(product), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve product: {str(e)}"}), 500


def update_product(data, file_data):
    product_id = data.get("product_id")
    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    existing_product = Product.get_product_by_id(product_id)
    if not existing_product:
        return jsonify({"error": "Product data not found"}), 404

    existing_image_urls = existing_product.get("image_urls", [])
    print(file_data)
    updated_image_urls = update_multiple_images(existing_image_urls, "Product", product_id, file_data)

    update_data = {
        "name": data.get("name"),
        "description": data.get("description"),
        "price": data.get("price"),
        "image_urls": updated_image_urls,
        "category_id": data.get("category_id"),
        "stock": data.get("stock"),
        "tag": data.get("tag"),
        "updated_at": str(dt.datetime.now())
    }

    update_data = {k: v for k, v in update_data.items() if v is not None}

    try:
        Product.update_product(product_id, update_data)
        return jsonify({"message": "Product updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to update product: {str(e)}"}), 500


def delete_product(data):
    product_id = data.get("product_id")
    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    existing_product = Product.get_product_by_id(product_id)
    if not existing_product:
        return jsonify({"error": "Product data not found"}), 404

    try:
        existing_image_urls = existing_product.get("image_urls", [])
        delete_old_images(existing_image_urls)
        Product.delete_product(product_id)
        return jsonify({"message": "Product deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to delete product: {str(e)}"}), 500
