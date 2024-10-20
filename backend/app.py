from flask import Flask, request
from openai_model import get_script
import os
from moviepy.editor import *

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return "Hello CalHacks!"

@app.route('/show', methods=['GET'])
def greet():
    name = request.args.get('name','Mr.Default') 
    return f"Hello, {name}!"

@app.route('/get_video', methods=['GET'])
def get_video():
    content = request.json
    input = content['input']
    scenes = get_script(input)['scenes']
    
    for scene in scenes:
        description = scene['description']
        
        code_to_execute = f'python ../../Open-Sora/scripts/inference.py ../../Open-Sora/configs/opensora-v1-2/inference/sample.py --num-frames 8s --resolution 144p --aspect-ratio 9:16 --llm-refine True --prompt "{description}"'
        
        i = os.system(f"{code_to_execute}")
        
        if i < 0:
            return 400
        
        './samples/samples/sample_0000.mp4'
        

if __name__ == '__main__':
    app.run(debug=True)
