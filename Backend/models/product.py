from config.dynamodb import dynamodbFunction
from boto3.dynamodb.conditions import Attr

aws_dynamodb = dynamodbFunction()
table = aws_dynamodb.Table("Product")

class Product:
    def __init__(
        self,
        product_id,
        name,
        description=None,
        price=None,
        image_urls=None,  
        category_id=None,
        stock=None,
        tag=None,
        created_at=None,
        updated_at=None,
    ):
        self.product_id = product_id
        self.name = name
        self.description = description
        self.price = price
        self.image_urls = image_urls if image_urls else []
        self.category_id = category_id
        self.stock = stock
        self.tag = tag
        self.created_at = created_at
        self.updated_at = updated_at

    def create_product(self):
        """Create a new product."""
        return table.put_item(
            Item={
                "product_id": self.product_id,
                "name": self.name,
                "description": self.description,
                "price": self.price,
                "image_urls": self.image_urls,
                "category_id": self.category_id,
                "stock": self.stock,
                "tag": self.tag,
                "created_at": self.created_at,
                "updated_at": self.updated_at,
            }
        )

    @staticmethod
    def product_exist(product_id):
        """Check if a product exists by ID."""
        response = table.get_item(Key={"product_id": product_id})
        return "Item" in response

    @staticmethod
    def get_product_by_id(product_id):
        """Retrieve a product by its ID."""
        response = table.get_item(Key={"product_id": product_id})
        return response.get("Item")

    @staticmethod
    def get_all_products():
        """Retrieve all products."""
        return table.scan().get("Items", [])

    @staticmethod
    def get_all_based_on_cat(cat_id):
        response = table.scan(FilterExpression=Attr("category_id").eq(cat_id))
        return response.get("Items", [])

    @staticmethod
    def delete_product(product_id):
        """Delete a product by ID."""
        return table.delete_item(Key={"product_id": product_id})

    @staticmethod
    def update_product(product_id, update_data: dict):
        """Update a product by ID."""
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

        return table.update_item(
            Key={"product_id": product_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expr_attr_values,
            ExpressionAttributeNames=expr_attr_names,
            ReturnValues="UPDATED_NEW",
        )
