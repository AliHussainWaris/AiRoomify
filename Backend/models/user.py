import uuid
import re
import bcrypt as bct
from config.dynamodb import dynamodbFunction
from boto3.dynamodb.conditions import Attr
from boto3.dynamodb.types import Binary

aws_dynamodb = dynamodbFunction()
table = aws_dynamodb.Table("Users")


class User:
    __hash_password = None

    def __init__(self, __user_id,name, email, password, age, gender, role,
                 profile_image, stripeId, address, userPhone,
                 created_at, updated_at):
        self.__user_id = __user_id
        self.name = name
        self.email = email
        self.password = self._validate_password(str(password))
        self.age = age
        self.gender = gender
        self.role = role
        self.profile_image = profile_image
        self.stripeId = stripeId
        self.address = address
        self.userPhone = userPhone
        self.created_at = created_at
        self.updated_at = updated_at

    def create_user(self):
        """Create a user in the DynamoDB Users table."""
        return table.put_item(
            Item={
                "user_id": self.__user_id,
                "name": self.name,
                "email": self.email,
                "password": self.password,
                "age": self.age,
                "gender": self.gender,
                "role": self.role,
                "profile_image": self.profile_image,
                "address": self.address,
                "phone_no": self.userPhone,
                "stripe_id": self.stripeId,
                "created_at": self.created_at,
                "updated_at": self.updated_at,
            }
        )
    
    @staticmethod
    def get_user(email):
        response = table.scan(
            FilterExpression=Attr("email").eq(email)
        )
        items = response.get("Items", [])
        return items[0] if items else None
    
    def get_product_by_id(product_id):
        """Retrieve a product by its ID."""
        response = table.get_item(Key={"product_id": product_id})
        return response.get("Item")

    @staticmethod
    def user_exist(email):
        response = table.scan(
            FilterExpression=Attr("email").eq(email)
        )
        items = response.get("Items", [])

        if items:
            # Convert to bytes here if needed
            pwd = items[0].get("password")
            if hasattr(pwd, 'value'):  # boto3 Binary has .value attribute which is bytes
                pwd = pwd.value
            User.__hash_password = pwd
            return items[0]
        else:
            User.__hash_password = None
            return None

    @staticmethod
    def verify_password(password, hashed_password):
        # Convert if hashed_password is a DynamoDB Binary object
        if isinstance(hashed_password, Binary):
            hashed_password = bytes(hashed_password)
        # or if it's dict with 'B' key, like {'B': b'...'}, convert accordingly:
        # hashed_password = hashed_password['B']

        return bct.checkpw(password.encode("utf-8"), hashed_password)

    @staticmethod
    def login_user(email, password):
        """Authenticate user with email and password."""
        hashed_password = User.__hash_password
        if not hashed_password:
            return None

        if User.verify_password(password, hashed_password):
            response = table.scan(
                FilterExpression=Attr("email").eq(email)
            )
            items = response.get("Items", [])
            return items[0] if items else None
        return None

    @staticmethod
    def update_user(email, update_data: dict):
        """Update user attributes by email."""
        # Get user by email to fetch their user_id
        response = table.scan(FilterExpression=Attr("email").eq(email))
        items = response.get("Items", [])

        if not items:
            return None

        user_id = items[0]["user_id"]

        if not update_data:
            raise ValueError("No fields provided to update.")

        # Build UpdateExpression safely with ExpressionAttributeNames
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
            Key={"user_id": user_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expr_attr_values,
            ExpressionAttributeNames=expr_attr_names,
            ReturnValues="UPDATED_NEW",
        )


    @staticmethod
    def delete_user(email):
        """Delete user by email."""
        response = table.scan(FilterExpression=Attr("email").eq(email))
        items = response.get("Items", [])

        if not items:
            return None

        user_id = items[0]["user_id"]
        return table.delete_item(Key={"user_id": user_id})

    @staticmethod
    def _validate_password(password):
        if len(password) < 8:
            raise ValueError(f"Password too short: {len(password)} characters")
        if not re.search(r"[A-Z]", password):
            raise ValueError("Password must contain an uppercase letter.")
        if not re.search(r"[0-9]", password):
            raise ValueError("Password must contain a number.")
        if not re.search(r"[^A-Za-z0-9]", password):
            raise ValueError("Password must contain a special character.")
        return User._encrypt_password(password)

    @staticmethod
    def _encrypt_password(password):
        salt = bct.gensalt(10)
        return bct.hashpw(password.encode("utf-8"), salt)
