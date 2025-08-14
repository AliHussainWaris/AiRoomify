from flask import Blueprint, request
from services.chat_service import save_chat_message, delete_chat_message , get_chat_by_user, get_all_image

chat_routes = Blueprint('chat_routes', __name__, url_prefix='/api/chat')

@chat_routes.route('/create', methods=['POST'])
def create():
    form_data = request.form
    file_data = request.files
    image_file = file_data.get("image") 
    return save_chat_message(form_data, image_file)

@chat_routes.route('/get', methods=['GET'])
def get_by_id():
    form_data = request.form
    return get_chat_by_user(form_data)

@chat_routes.route('/get_all', methods=['GET'])
def get_all():
    return get_all_image()

@chat_routes.route('/delete', methods=['DELETE'])
def delete():
    form_data = request.form
    return delete_chat_message(form_data)