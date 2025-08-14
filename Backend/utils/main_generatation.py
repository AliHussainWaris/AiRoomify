from prompt_generate import generate_prompt_with_llama
import uuid
import os


def main_generation(user_prompt):
        prompt = generate_prompt_with_llama(user_prompt)
        unique_filename = f"{uuid.uuid4().hex}_{uploaded_file.filename}"
        input_image_path = os.path.join('uploads', unique_filename)
        uploaded_file.save(input_image_path)
        output_image_path = generate_image_from_prompt_and_image(prompt, input_image_path)

        return output_image_path