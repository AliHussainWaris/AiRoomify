from config.dynamodb import dynamodbFunction
from boto3.dynamodb.conditions import Attr

aws_dynamodb = dynamodbFunction()
table = aws_dynamodb.Table("Category")


class Category:
    def __init__(self, category_id ,name, description=None, image_url=None, tag=None, created_at=None, updated_at=None):
        self.category_id = category_id
        self.name = name
        self.description = description
        self.image_url = image_url
        self.tag = tag
        self.created_at = created_at
        self.updated_at = updated_at

    def create_category(self):
        """Create a new category."""
        return table.put_item(
            Item={
                "category_id": self.category_id,
                "name": self.name,
                "description": self.description,
                "image_url": self.image_url,
                "tag": self.tag,
                "created_at": self.created_at,
                "updated_at": self.updated_at,
            }
        )

    @staticmethod
    def category_exist(category_id):
        """Check if a category exists by ID."""
        response = table.scan(FilterExpression=Attr("category_id").eq(category_id))
        return response.get("Items", [])

    @staticmethod
    def get_all_categories():
        """Retrieve all categories."""
        return table.scan().get("Items", [])

    @staticmethod
    def delete_category(category_id):
        """Delete a category by ID."""
        return table.delete_item(Key={"category_id": category_id})

    @staticmethod
    def update_category(category_id, update_data: dict):
        """Update a category by ID."""
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
            Key={"category_id": category_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expr_attr_values,
            ExpressionAttributeNames=expr_attr_names,
            ReturnValues="UPDATED_NEW",
        )
