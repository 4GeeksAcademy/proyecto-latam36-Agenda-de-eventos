from flask import Flask, request, render_template, jsonify

import os
import subprocess
import cloudinary
import cloudinary.uploader
import cloudinary.api

cloudinary.config( 
  cloud_name = "dxweetk1w", 
  api_key = "932178836968972", 
  api_secret = "4tMaS9oNlEtDYSgEcQ7Z7XwFhA4",
  secure = True
)

from cloudinary import CloudinaryImage
from cloudinary import CloudinaryVideo


app = Flask(__name__)

# Configure the upload folder
UPLOAD_FOLDER = 'src/api/uploads'
relative_folder ='/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def delete_local_media_file(file_path):
    try:
        # Remove the file and stage it for deletion
        subprocess.run(["git", "rm", file_path], check=True)
        print(f"File {file_path} staged for deletion.")

        # Commit the changes
        commit_message = f"Delete file {file_path}"
        subprocess.run(["git", "commit", "-m", commit_message], check=True)
        print("Changes committed.")

        # Push the changes to the remote branch (optional)
        #subprocess.run(["git", "push"], check=True)
        #print("Changes pushed to remote branch.")

    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")

    return


@app.route('/')
def upload_form():
    return '''
    <form method="POST" action="/upload" enctype="multipart/form-data">
        <input type="file" name="file">
        <input type="submit" value="Upload">
    </form>
    '''

@app.route('/imageloader', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "No file part in the request"
    file = request.files['file']
    if file.filename == '':
        return "No selected file"
    if file:
        # Save the file to the configured upload folder
        file.save(f"{app.config['UPLOAD_FOLDER']}/{file.filename}")

    file_path = f"{app.config['UPLOAD_FOLDER']}/{file.filename}"
    response = cloudinary.uploader.upload(f"{app.config['UPLOAD_FOLDER']}/{file.filename}")
    print('this is cloudinary response:',response)
    print("this is the file directory:",os.getcwd())
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"File '{file_path}' has been deleted.")
        else:
            print(f"File '{file_path}' does not exist.")
    except Exception as e:
        print(f"An error occurred: {e}")

    #delete_local_media_file(f"{relative_folder}/{file.filename}") 
    return f"File '{file.filename}' uploaded successfully!"



if __name__ == '__main__':
    app.run(debug=True)