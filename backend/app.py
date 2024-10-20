from flask import Flask, request, send_from_directory
from openai_model import get_script
import os
from flask_cors import CORS, cross_origin
from moviepy.editor import *

generated_clip = "./samples/samples/sample_0000.mp4"
merged = "merged.mp4"

app = Flask(__name__)
cors = CORS(app, resources={r"/foo": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

def get_files_os(folder_path):
    files = []
    for f in os.listdir(folder_path):
        full_path = os.path.join(folder_path, f)
        if os.path.isfile(full_path) and f.lower().endswith('.mp4'):
            files.append(folder_path + f)
    return files

def create_text_file(files):
    with open("vid_list.txt", 'w') as file:
        for f in files:
            file.write('file'+ " " + f + '\n')


@app.route("/", methods=["GET"])
def index():
    return "Hello CalHacks!"


@app.route("/show", methods=["GET"])
def greet():
    name = request.args.get("name", "Mr.Default")
    return f"Hello, {name}!"


@app.route("/get_video", methods=["POST"])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def get_video():
    content = request.json
    input = content["input"]
    scenes = get_script(input)["scenes"]

    for i in range(len(scenes)):
        scene = scenes[i]
        description = scene["description"]

        code_to_execute = f'python ../../Open-Sora/scripts/inference.py ../../Open-Sora/configs/opensora-v1-2/inference/sample.py --sample-name "{i}" --num-frames 4s --resolution 144p --aspect-ratio 9:16 --llm-refine False --prompt "{description}"'

        i = os.system(f"{code_to_execute}")

        if i < 0:
            return 400
        
    folder_path = 'samples/'
    print(get_files_os(folder_path))
    create_text_file(get_files_os(folder_path))
    
    os.system(f"ffmpeg -f -y concat -i vid_list.txt {merged}")
    os.system(f"rm -rf samples")

    return send_from_directory("./", merged)

if __name__ == "__main__":
    app.run(debug=True)
