import os
import boto3
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

aws_access_key = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
aws_region = os.getenv('AWS_REGION')

if not all([aws_access_key, aws_secret_key, aws_region]):
    raise EnvironmentError("Missing AWS credentials or region in .env file")

print("AWS Access Key Loaded:", bool(aws_access_key))
print("AWS Region:", aws_region)

def dynamodbFunction():
    return boto3.resource(
        'dynamodb',
        region_name=os.getenv('AWS_REGION'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )

def S3Function():
    return boto3.client(
        's3',
        region_name=os.getenv('AWS_REGION'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )
