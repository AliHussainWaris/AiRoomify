from flask import jsonify
from models.order import Order
import datetime as dt
import uuid

def create_order(data):
    order_id =str(uuid.uuid4())
    user_id = data.get("user_id")
    product_ids = data.get("product_ids", [])
    total_amount = data.get("total_amount")
    quantity = data.get("quantity")
    status = data.get("status")
    payment_id = data.get("payment_id")
    created_at = str(dt.datetime.now())
    updated_at = str(dt.datetime.now())

    if not all([user_id, product_ids, total_amount]):
        return jsonify({"error": "User ID, product IDs, and total amount are required"}), 400

    order = Order(
        order_id = order_id,
        user_id=user_id,
        product_ids=product_ids,
        total_amount=total_amount,
        quantity= quantity,
        status=status,
        payment_id=payment_id,
        created_at=created_at,
        updated_at=updated_at,
    )

    try:
        order.create_order()
        return jsonify({"message": "Order created successfully", "order_id": order.order_id}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to create order: {str(e)}"}), 500


def get_all_orders():
    try:
        orders = Order.get_all_orders()
        return jsonify(orders), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch orders: {str(e)}"}), 500


def get_order_by_id(order_id, user_id):
    if not order_id or not user_id:
        return jsonify({"error": "Order ID and User ID are required"}), 400

    try:
        order = Order.get_order_by_id(order_id, user_id)
        if not order:
            return jsonify({"error": "Order not found"}), 404
        return jsonify(order), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve order: {str(e)}"}), 500


def update_order(data):
    order_id = data.get("order_id")
    user_id = data.get("user_id")
    if not order_id or not user_id:
        return jsonify({"error": "Order ID and User ID are required"}), 400

    if not Order.order_exists(order_id, user_id):
        return jsonify({"error": "Order not found"}), 404

    update_data = {
        "product_ids": data.get("product_ids"),
        "total_amount": data.get("total_amount"),
        "status": data.get("status"),
        "payment_id": data.get("payment_id"),
        "tag": data.get("tag"),
        "updated_at": str(dt.datetime.now())
    }

    update_data = {k: v for k, v in update_data.items() if v is not None}

    try:
        Order.update_order(order_id, user_id, update_data)
        return jsonify({"message": "Order updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to update order: {str(e)}"}), 500


def delete_order(data):
    order_id = data.get("order_id")
    user_id = data.get("user_id")
    if not order_id or not user_id:
        return jsonify({"error": "Order ID and User ID are required"}), 400

    if not Order.order_exists(order_id, user_id):
        return jsonify({"error": "Order not found"}), 404

    try:
        Order.delete_order(order_id, user_id)
        return jsonify({"message": "Order deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to delete order: {str(e)}"}), 500
