import uuid
from config.dynamodb import dynamodbFunction
from boto3.dynamodb.conditions import Attr

aws_dynamodb = dynamodbFunction()
table = aws_dynamodb.Table("Order")  # Ensure this table exists in AWS

class Order:
    def __init__(
        self,
        order_id,
        user_id,
        product_ids,
        total_amount,
        status,
        quantity,
        created_at,
        updated_at=None,
        payment_id=None,
    ):
        self.order_id = order_id
        self.user_id = user_id
        self.product_ids = product_ids
        self.total_amount = total_amount
        self.status = status 
        self.quantity = quantity
        self.payment_id = payment_id
        self.created_at = created_at
        self.updated_at = updated_at

    def create_order(self):
        try:
            table.put_item(
                Item={
                    "order_id": self.order_id,
                    "user_id": self.user_id,
                    "product_ids": self.product_ids,
                    "total_amount": self.total_amount,
                    "status": self.status,
                    "quantity" : self.quantity,
                    "payment_id": self.payment_id,
                    "created_at": self.created_at,
                    "updated_at": self.updated_at,
                }
            )
            return {"message": "Order created successfully", "order_id": self.order_id}
        except Exception as e:
            return {"error": f"Failed to create order: {str(e)}"}

    @staticmethod
    def order_exists(order_id, user_id):
        try:
            response = table.get_item(Key={"order_id": order_id, "user_id": user_id})
            return "Item" in response
        except Exception as e:
            return {"error": f"Check failed: {str(e)}"}

    @staticmethod
    def get_order_by_id(order_id, user_id):
        try:
            response = table.get_item(Key={"order_id": order_id, "user_id": user_id})
            return response.get("Item")
        except Exception as e:
            return {"error": f"Failed to retrieve order: {str(e)}"}

    @staticmethod
    def get_orders_by_user(user_id):
        try:
            response = table.scan(FilterExpression=Attr("user_id").eq(user_id))
            return response.get("Items", [])
        except Exception as e:
            return {"error": f"Failed to retrieve orders: {str(e)}"}

    @staticmethod
    def get_all_orders():
        try:
            return table.scan().get("Items", [])
        except Exception as e:
            return {"error": f"Failed to retrieve orders: {str(e)}"}

    @staticmethod
    def update_order(order_id, user_id, update_data: dict):
        if not update_data:
            raise ValueError("No fields provided to update.")

        update_expr = []
        expr_attr_values = {}
        expr_attr_names = {}

        for k, v in update_data.items():
            placeholder_name = f"#{k}"
            placeholder_value = f":{k}"
            update_expr.append(f"{placeholder_name} = {placeholder_value}")
            expr_attr_names[placeholder_name] = k
            expr_attr_values[placeholder_value] = v

        update_expression = "SET " + ", ".join(update_expr)

        try:
            return table.update_item(
                Key={"order_id": order_id, "user_id": user_id},
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expr_attr_values,
                ExpressionAttributeNames=expr_attr_names,
                ReturnValues="UPDATED_NEW",
            )
        except Exception as e:
            return {"error": f"Failed to update order: {str(e)}"}

    @staticmethod
    def delete_order(order_id, user_id):
        try:
            return table.delete_item(Key={"order_id": order_id, "user_id": user_id})
        except Exception as e:
            return {"error": f"Failed to delete order: {str(e)}"}
