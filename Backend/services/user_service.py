from flask import jsonify
from models.user import User
import datetime as dt
import uuid
from utils.image_setup import upload_image , update_image , delete_image
from utils.helpers import convert_dynamodb_item

#Register the User
def register_user(form_data, file_data):
    __user_id = str(uuid.uuid4())
    name = form_data.get("name")
    email = form_data.get("email")
    password = form_data.get("password")
    age = form_data.get("age")
    gender = form_data.get("gender")
    role = form_data.get('role')
    stripeId = form_data.get("stripeId")
    address = form_data.get("address")
    userPhone = form_data.get("userPhone")
    created_at = str(dt.datetime.now())
    updated_at = str(dt.datetime.now())
    if file_data:
        profile_image = upload_image(file_data, "User", __user_id)
    else:
        profile_image = None

    if not all([email, password, name]):
        return jsonify({"error": "Email, password, and name are required"}), 400
    
    user = User(__user_id,name,email,password,age,gender,role,profile_image,stripeId,address,userPhone, created_at,updated_at )
    checkExistence = user.user_exist(email)
    if not checkExistence:
        user.create_user()
        return jsonify({"message": "User registered successfully"}), 201
    else:
        return jsonify({"error": "User already exists"}), 409

def login_user(data):
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    checkExistence = User.user_exist(email)
    if checkExistence:
        user_data =User.login_user(email,password)
        if user_data:
            user_data['user_id'] = str(user_data['user_id'])
            user_data.pop('password')
            return jsonify({"message":"Login Succesfully", "user_data" : user_data}) , 200
        else:
            return jsonify({"message" :"Password is wrong "})
    else:
        return jsonify({"error": "User not found"}), 404
    
def get_user_one(data):
    email = data.get('email')
    checkExistence = User.user_exist(email)
    if checkExistence:
        user_data =User.get_user(email)
        clean_data = convert_dynamodb_item(user_data)
        return jsonify(clean_data), 200
    else:
        return jsonify({"Error" : "User not Found"}) , 404

def update_user(data, file_data):
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    existing_user = User.user_exist(email)
    if not existing_user:
        return jsonify({"error": "User not found"}), 404

    existing_image_url = existing_user.get("profile_image")
    __user_id = existing_user.get("user_id")
    image = update_image(existing_image_url, "User", __user_id, file_data)

    new_password = data.get("password")
    if new_password:
        new_password = User._validate_password(new_password)

    update_data = {
        "name": data.get("name"),
        "password": new_password,
        "age": data.get("age"),
        "gender": data.get("gender"),
        "role": data.get("role"),
        "profile_image": image,
        "stripe_id": data.get("stripeId"),
        "address": data.get("address"),
        "phone_no": data.get("userPhone"),
        "updated_at": str(dt.datetime.now())
    }

    update_data = {k: v for k, v in update_data.items() if v is not None}

    try:
        User.update_user(email, update_data)
        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to update user: {str(e)}"}), 500

def delete_user(data):
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    existing_user = User.user_exist(email)
    existing_image_url = existing_user.get("profile_image")
    print(existing_image_url)
    if delete_image(existing_image_url):
        print("Image delete successfully")

    try:
        User.delete_user(email)
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to delete user: {str(e)}"}), 500
