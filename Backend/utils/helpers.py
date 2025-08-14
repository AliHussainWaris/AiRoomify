import decimal
from boto3.dynamodb.types import Binary
from base64 import b64encode

def convert_dynamodb_item(item):
    def convert_value(value):
        if isinstance(value, decimal.Decimal):
            # Convert decimals to int or float
            return int(value) if value % 1 == 0 else float(value)
        elif isinstance(value, Binary):
            # Convert binary to base64 string
            return b64encode(value.value).decode('utf-8')
        elif isinstance(value, dict):
            return {k: convert_value(v) for k, v in value.items()}
        elif isinstance(value, list):
            return [convert_value(v) for v in value]
        else:
            return value

    return {k: convert_value(v) for k, v in item.items()}