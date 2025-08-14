from flask import Blueprint, request, jsonify
from services.order_service import (
    create_order,
    get_all_orders,
    update_order,
    delete_order,
    get_order_by_id
)

order_routes = Blueprint('order_routes', __name__, url_prefix='/api/order')

@order_routes.route('/create', methods=['POST'])
def create():
    form_data = request.form
    return create_order(form_data)

@order_routes.route('/all', methods=['GET'])
def get_all():
    return get_all_orders()

@order_routes.route('/get_one', methods=['POST'])
def get_one():
    data = request.form
    order_id = data.get('order_id')
    user_id = data.get('user_id')
    return get_order_by_id(order_id, user_id)

@order_routes.route('/update', methods=['PUT'])
def update():
    form_data = request.form
    return update_order(form_data)

@order_routes.route('/delete', methods=['POST'])
def delete():
    form_data = request.form
    return delete_order(form_data)
