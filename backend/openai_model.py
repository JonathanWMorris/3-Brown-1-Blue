from openai import OpenAI
from flask import jsonify
import json

from dotenv import load_dotenv

load_dotenv()

client = OpenAI()


def get_script(input: str):
    response = client.chat.completions.with_raw_response.create(
        messages=[
            {
                "role": "system",
                "content": "You are an asistant that converts any queries about topics into a short (1 paragraph) story to show real life examples of concepts.",
            },
            {
                "role": "user",
                "content": input,
            },
        ],
        model="gpt-4o-mini",
    )

    completion = response.parse()
    story = completion.choices[0].message.content
    print(" ")
    print(story)
    print(" ")

    response = client.chat.completions.with_raw_response.create(
        messages=[
            {
                "role": "system",
                "content": "You are an asistant that converts a story into a short screenplay. The duration of the screenplay should not be longer than 5 scenes. Only include a scene description for each secene and the dialog spoken at that scene, make the descriptions as generalizable as possible. Seperate description and dialog clearly. Lable dialog as either male or female only. Format the output as a Json.",
            },
            {
                "role": "user",
                "content": story,
            },
        ],
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
    )

    completion = response.parse()
    screenplay = completion.choices[0].message.content
    print(" ")
    print(json.loads(screenplay)['scenes'][0]['description'])
    print(" ")
