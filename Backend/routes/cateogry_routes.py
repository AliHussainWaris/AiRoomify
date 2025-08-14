from flask import Blueprint, request, jsonify
from services.category_service import create_category, get_all_categories, update_category, delete_category

category_routes = Blueprint('category_routes', __name__, url_prefix='/api/category')

@category_routes.route('/create', methods=['POST'])
def create():
    form_data = request.form
    file_data = request.files
    return create_category(form_data, file_data)

@category_routes.route('/get-all', methods=['GET'])
def get_all():
    return get_all_categories()

@category_routes.route('/update', methods=['PUT'])
def update():
    form_data = request.form
    file_data = request.files
    return update_category(form_data, file_data)

@category_routes.route('/delete', methods=['POST'])
def delete():
    form_data = request.form
    return delete_category(form_data)
