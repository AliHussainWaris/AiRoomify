from flask import Blueprint, request, jsonify
from services.product_service import (
    create_product,
    get_all_products,
    update_product,
    delete_product,
    get_product_by_id ,
    get_all_product_based_cat_id
)

product_routes = Blueprint('product_routes', __name__, url_prefix='/api/product')

@product_routes.route('/create', methods=['POST'])
def create():
    form_data = request.form
    file_data = request.files
    images = file_data.getlist('image_urls')
    return create_product(form_data , images)

@product_routes.route('/all', methods=['GET'])
def get_all():
    return get_all_products()

@product_routes.route('/get_by_cat', methods=['POST'])
def get_by_id():
    form_data = request.form
    return get_all_product_based_cat_id(form_data)

@product_routes.route('/get_one' , methods=['POST'])
def get_one():
    form_data = request.form
    product_id = form_data.get('product_id')
    return get_product_by_id(product_id)

@product_routes.route('/update', methods=['PUT'])
def update():
    form_data = request.form
    file_data = request.files
    images = file_data.getlist('images_urls')
    return update_product(form_data , images)

@product_routes.route('/delete', methods=['POST'])
def delete():
    form_data = request.form
    return delete_product(form_data)
