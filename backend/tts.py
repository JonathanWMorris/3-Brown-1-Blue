from pathlib import Path
from openai import OpenAI
import moviepy.editor as mp

from dotenv import load_dotenv

load_dotenv()

client = OpenAI()


def tts(input: str):
    speech_file_path = Path(__file__).parent / "speech.mp3"

    response = client.audio.speech.create(model="tts-1", voice="alloy", input=input)

    response.stream_to_file(speech_file_path)

    return speech_file_path


def combine_audio(video_path, audio_path, output_path="./output.mp4"):
    audio = mp.AudioFileClip(audio_path)
    video1 = mp.VideoFileClip(video_path)
    final = video1.set_audio(audio)
    final.write_videofile(output_path)
    return output_path


combine_audio("./merged.mp4", "./speech.mp3")
