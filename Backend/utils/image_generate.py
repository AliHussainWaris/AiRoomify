from diffusers import StableDiffusionImg2ImgPipeline
import torch
import os
from PIL import Image
import contextlib
import io
import base64

gpu_id = 1 if torch.cuda.device_count() > 1 else 0
device = torch.device(f'cuda:{gpu_id}' if torch.cuda.is_available() else 'cpu')

model_name = "runwayml/stable-diffusion-v1-5"
pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
    model_name,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
)
pipe.to(device)
pipe.safety_checker = lambda images, **kwargs: (images, [False] * len(images))


def generate_image_from_prompt_and_image(prompt, input_image_path):
    init_image = Image.open(input_image_path).convert("RGB").resize((512, 512))
    with torch.autocast("cuda") if device.type == "cuda" else contextlib.nullcontext():
        result = pipe(
            prompt=prompt,
            image=init_image,
            strength=0.75,
            guidance_scale=7.0,
            num_inference_steps=20 
        )

    generated_image = result.images[0]
    # output_image_path = os.path.join('static', 'output_image.jpg')
    # generated_image.save(output_image_path)

    return generated_image

def pil_image_to_base64(image):
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str