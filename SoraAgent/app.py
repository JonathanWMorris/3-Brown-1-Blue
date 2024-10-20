from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import storage
import os

from dotenv import load_dotenv
load_dotenv()

# Replace 'path/to/your/keyfile.json' with the actual path
cred = credentials.Certificate('secret.json')
firebase_admin.initialize_app(cred, {'storageBucket': 'nolan-d2ebf.appspot.com'})

bucket = storage.bucket()

app = Flask(__name__)

@app.route('/get_sora', methods=['GET'])
def get_sora():
    content = request.json
    prompt = content["prompt"]
    
    code_to_execute = f'python scripts/inference.py configs/opensora-v1-2/inference/sample.py --num-frames 8s --resolution 144p --aspect-ratio 9:16 --llm-refine True --prompt "{prompt}"'
    
    i = os.system(f"cd ../../Open-Sora && {code_to_execute}")
    
    file_path = "../../Open-Sora/samples/samples/sample_0000.mp4"
    blob = bucket.blob(file_path)
    blob.upload_from_filename(filename = file_path)
    return jsonify(path=file_path)

if __name__ == '__main__':
    app.run(host= '0.0.0.0',debug=True)