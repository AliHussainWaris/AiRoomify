from flask import jsonify
from models.chat import ChatMessage
import datetime as dt
import uuid
from utils.image_generate import generate_image_from_prompt_and_image
from utils.prompt_generate import generate_prompt_with_llama
from utils.image_setup import upload_image , delete_image
import io

# Save a new chat message
def save_chat_message(data, image):
    message_id = str(uuid.uuid4())
    
    user_id = data.get("user_id")
    message = data.get("message")
    tag = data.get("tag", None)
    created_at = str(dt.datetime.now())
    
    if not user_id or not message:
        return jsonify({"error": "User ID and message are required"}), 400
    
    prompt = generate_prompt_with_llama(message)
    
    if image:
        try:
            output_image = generate_image_from_prompt_and_image(prompt, image)
            if output_image is None:
                return jsonify({"error": "Failed to generate image"}), 500
        except Exception as e:
            return jsonify({"error": f"Image generation failed: {str(e)}"}), 500
    else:
        output_image = None 

    if output_image:
        try:
            img_byte_arr = io.BytesIO()
            output_image.save(img_byte_arr, format='PNG')
            img_byte_arr.seek(0)
            img_byte_arr.filename = f"{message_id}.png"
            image_url = upload_image(img_byte_arr, "Chat", message_id)

        except Exception as e:
            return jsonify({"error": f"Failed to upload image: {str(e)}"}), 500
    else:
        image_url = None 
    
    try:
        chat = ChatMessage(message_id, user_id, image_url, message, created_at, tag)
        chat.save_message()
        return jsonify({"message": "Chat message saved successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to save chat message: {str(e)}"}), 500

# Get all messages by user_id
def get_chat_by_user(data):
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        messages = ChatMessage.get_user_messages(user_id)
        return jsonify({"messages": messages}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#Get all image / chat
def get_all_image():
    try:
        products = ChatMessage.get_all_images()
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch products: {str(e)}"}), 500

# Delete a chat message
def delete_chat_message(data):
    chat_id = data.get("chat_id")
    message = ChatMessage.get_message_by_id(chat_id)
    if not message:
        return jsonify({"error": "Message not found"}), 404

    first_message = message[0] if isinstance(message, list) else message
    user_id = first_message.get("user_id")
    output_image = first_message.get("output_image")

    if isinstance(output_image, list):
        for img_url in output_image:
            delete_image(img_url)
    elif isinstance(output_image, str):
        delete_image(output_image)

    try:
        ChatMessage.delete_message(chat_id, user_id)
        return jsonify({"message": "Chat message deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to delete chat message: {str(e)}"}), 500
