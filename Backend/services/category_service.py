from flask import jsonify
from models.category import Category
import datetime as dt
from utils.image_setup import upload_image , update_image , delete_image
import uuid

# Register the Category
def create_category(form_data, file_data):
    category_id = str(uuid.uuid4())
    name = form_data.get("name")
    description = form_data.get("description")
    image_file = file_data.get("image") 
    tag = form_data.get("tag")
    created_at = str(dt.datetime.now())
    updated_at = str(dt.datetime.now())
    image_url = upload_image(image_file, "Category", category_id)

    if not name:
        return jsonify({"error": "Category name is required"}), 400

    category = Category(
        category_id=category_id,
        name=name,
        description=description,
        image_url=image_url,
        tag=tag,
        created_at=created_at,
        updated_at=updated_at
    )

    try:
        category.create_category()
        return jsonify({
            "message": "Category created successfully",
            "category_id": category.category_id
        }), 201
    except Exception as e:
        return jsonify({
            "error": f"Failed to create category: {str(e)}"
        }), 500


# Get All Categories
def get_all_categories():
    try:
        categories = Category.get_all_categories()
        return jsonify(categories), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch categories: {str(e)}"}), 500


# Update a Category
def update_category(data, file_data):
    category_id = data.get("category_id")
    
    if not category_id:
        return jsonify({"error": "Category ID is required"}), 400

    existing_items = Category.category_exist(category_id)
    if not existing_items:
        return jsonify({"error": "Category not found"}), 404

    existing_category = existing_items[0] 
    existing_image_url = existing_category.get("image_url")

    if file_data and file_data.get("image"):
        image_file = file_data.get("image")
        image = update_image(existing_image_url, "Category", category_id, image_file)
    else:
        image = data.get("image_url", existing_image_url)

    update_data = {
        "name": data.get("name"),
        "description": data.get("description"),
        "image_url": image,
        "tag": data.get("tag"),
        "updated_at": str(dt.datetime.now())
    }

    update_data = {k: v for k, v in update_data.items() if v is not None}

    if not update_data:
        return jsonify({"error": "No fields provided to update"}), 400

    try:
        Category.update_category(category_id, update_data)
        return jsonify({"message": "Category updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to update category: {str(e)}"}), 500


# Delete a Category
def delete_category(data):
    category_id = data.get("category_id")

    if not category_id:
        return jsonify({"error": "Category ID is required"}), 400

    existing_items = Category.category_exist(category_id)
    if not existing_items:
        return jsonify({"error": "Category not found"}), 404

    existing_category = existing_items[0] 
    existing_image_url = existing_category.get("image_url")


    try:
        if existing_image_url and "s3" in existing_image_url:
            old_s3_key = existing_image_url.replace(f"https://airoomify-bk.s3.eu-north-1.amazonaws.com/", "")
        else:
            old_s3_key = None
    
        delete_image(old_s3_key)
        Category.delete_category(category_id)
        return jsonify({"message": "Category deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to delete category: {str(e)}"}), 500
