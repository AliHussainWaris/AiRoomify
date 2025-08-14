import uuid
import boto3
from boto3.dynamodb.conditions import Key
from config.dynamodb import dynamodbFunction

aws_dynamodb = dynamodbFunction()
table = aws_dynamodb.Table("DesignSession")

class DesignSession:
    def __init__(self, session_id=None, user_id=None, prompt=None, input_image=None, output_image=None, created_at=None, tags=None):
        self.session_id = session_id or str(uuid.uuid4())
        self.user_id = user_id
        self.prompt = prompt
        self.input_image = input_image
        self.output_image = output_image
        self.created_at = created_at
        self.tags = tags or []

    def create_session(self):
        item = {
            'session_id': self.session_id,
            'user_id': self.user_id,
            'prompt': self.prompt,
            'input_image': self.input_image,
            'output_image': self.output_image,
            'created_at': self.created_at,
            'tags': self.tags
        }
        table.put_item(Item=item)

    @staticmethod
    def get_session_by_id(session_id):
        response = table.get_item(Key={'session_id': session_id})
        return response.get('Item')

    @staticmethod
    def get_sessions_by_user(user_id):
        response = table.query(
            IndexName='user_id-index', 
            KeyConditionExpression=Key('user_id').eq(user_id)
        )
        return response.get('Items', [])

    @staticmethod
    def delete_session(session_id):
        table.delete_item(Key={'session_id': session_id})

    @staticmethod
    def delete_sessions_by_user(user_id):
        sessions = DesignSession.get_sessions_by_user(user_id)
        for session in sessions:
            DesignSession.delete_session(session['session_id'])
