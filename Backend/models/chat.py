import uuid
from pydantic import BaseModel, Field
from typing import Optional
from config.dynamodb import dynamodbFunction
from boto3.dynamodb.conditions import Attr

aws_dynamodb = dynamodbFunction()
table = aws_dynamodb.Table("Chat_Message") 

class ChatMessage:
    def __init__(self, message_id,user_id:str , output_image, str, message: str, created_at: str, tag: Optional[str] = None):
        self.message_id = message_id
        self.user_id = user_id
        self.message = message
        self.output_image = output_image,
        self.created_at = created_at
        self.tag = tag

    def save_message(self):
        """Save chat message to DynamoDB."""
        return table.put_item(
            Item={
                "chat_id": self.message_id,
                "user_id": self.user_id,
                "message": self.message,
                "output_image": self.output_image,
                "created_at": self.created_at,
                "tag": self.tag
            }
        )

    @staticmethod
    def get_user_messages(user_id: str):
        response = table.scan(FilterExpression=Attr("user_id").eq(user_id))
        return response.get("Items", [])

    @staticmethod
    def get_message_by_id(chat_id):
        response = table.scan(FilterExpression=Attr("chat_id").eq(chat_id))
        # items = response.get("Items", [])
        # return items[0] if items else None
        return response.get("Items", [])

    @staticmethod
    def get_all_images():
        """Retrieve all products."""
        return table.scan().get("Items", [])

    @staticmethod
    def delete_message(chat_id, user_id):
        return table.delete_item(Key={"chat_id": chat_id, "user_id":user_id})