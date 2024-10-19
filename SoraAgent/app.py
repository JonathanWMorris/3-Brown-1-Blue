from flask import Flask, request
import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import storage

# Replace 'path/to/your/keyfile.json' with the actual path
cred = credentials.Certificate('path/to/your/keyfile.json')
firebase_admin.initialize_app(cred)

bucket = storage.bucket()

app = Flask(__name__)

@app.route('/get_data', methods=['GET'])
def hello_world():
    content = request.json
    prompt = content["prompt"]
    code_to_execute = f'python scripts/inference.py ../Open-Sora/configs/opensora-v1-2/inference/sample.py --num-frames 4s --resolution 240p --aspect-ratio 9:16 --llm-refine True --prompt "{prompt}"'

if __name__ == '__main__':
    app.run(host= '0.0.0.0',debug=True)    