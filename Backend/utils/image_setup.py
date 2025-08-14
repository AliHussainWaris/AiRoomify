from config.dynamodb import S3Function
import mimetypes

s3 = S3Function()
BUCKET_NAME = 'airoomify-bk' 

#Single Image Upload
def upload_image(image_file, name, item_id):
       s3_key = f"{name}/{item_id}/{image_file.filename}"
       content_type, _ = mimetypes.guess_type(image_file.filename)
       if content_type is None:
           content_type = 'application/octet-stream'
       s3.upload_fileobj(image_file, BUCKET_NAME, s3_key, ExtraArgs={
           'ContentType': content_type,
            'ContentDisposition': 'inline'
       })
       return f"https://{BUCKET_NAME}.s3.eu-north-1.amazonaws.com/{s3_key}"

#Single Image Update
def update_image(old_img, name, item_id, input_file):
    if old_img:
        old_s3_key = old_img.replace(f"https://{BUCKET_NAME}.s3.eu-north-1.amazonaws.com/", "")
        try:
            s3.delete_object(Bucket=BUCKET_NAME, Key=old_s3_key)
        except Exception as e:
            print(f"Warning: Failed to delete old image from S3: {str(e)}")
    
    if input_file:
        url = upload_image(input_file, name, item_id)
        return url
    else:
        return old_img

#Single Image Delete
def delete_image(old_img):
    old_s3_key = old_img.replace(f"https://{BUCKET_NAME}.s3.eu-north-1.amazonaws.com/", "")
    s3.delete_object(Bucket=BUCKET_NAME, Key=old_s3_key)

#Multiple Images Upload
def upload_multiple_images(image_files, name, item_id):
     
    uploaded_urls = []
    for image_file in image_files:
        url = upload_image(image_file, name, item_id)
        uploaded_urls.append(url)
    return uploaded_urls

#Multiple Images Update
def update_multiple_images(old_imgs, name, item_id, input_files):
     
    for old_key in old_imgs:
        old_s3_key = old_key.replace(f"https://{BUCKET_NAME}.s3.eu-north-1.amazonaws.com/", "")
        s3.delete_object(Bucket=BUCKET_NAME, Key=old_s3_key)

    uploaded_urls = []
    for new_file in input_files:
        url = upload_image(new_file, name, item_id)
        uploaded_urls.append(url)

    return uploaded_urls

#Multiple Images Delete
def delete_old_images(old_imgs):
    for old_key in old_imgs:
        old_s3_key = old_key.replace(f"https://{BUCKET_NAME}.s3.eu-north-1.amazonaws.com/", "")
        s3.delete_object(Bucket=BUCKET_NAME, Key=old_s3_key)