from flask import Blueprint, request, jsonify
from services.user_service import register_user, login_user, update_user, delete_user , get_user_one

user_routes = Blueprint('user_routes', __name__, url_prefix='/api/user')

@user_routes.route('/register', methods=['POST'])
def register():
    form_data = request.form
    file_data = request.files
    profile_image_file = file_data.get("profile_image")  # Single FileStorage or None
    return register_user(form_data, profile_image_file)  # pass single file


@user_routes.route('/update', methods=['PUT'])
def update():
    form_data = request.form
    file_data = request.files
    profile_image_file = file_data.get("profile_image")  # Single FileStorage or None
    return update_user(form_data, profile_image_file)  

@user_routes.route('/get' , methods = ['POST'])
def get():
    form_data = request.form
    print(form_data)
    return get_user_one(form_data)

@user_routes.route('/login', methods=['POST'])
def login():
    data = request.form
    return login_user(data)

@user_routes.route('/delete', methods=['POST'])
def delete():
    data = request.form
    return delete_user(data)
