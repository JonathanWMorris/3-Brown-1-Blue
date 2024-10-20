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
                "content": "You are an assistant that answers any queries and responds like the transcript of educational videos on youtube, primarily the youtuber 3 blue 1 brown. Keep your responses very brief and to the point but illustrate the concept as a whole.",
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
                "content": "You are an assistant that converts text into a short screenplay by using the text as narration, similar to educational videos on youtube. The scenes should relate to real world concepts whenever possible. The duration of the screenplay should not be longer than 6 scenes. Only include a scene description for each scene and the dialog spoken at that scene, make the descriptions as generalizable as possible. Separate description and dialog clearly. Format the output as a Json. Like this {'scenes' : [{'description' : 'text', 'dialog' : [{'narrator': 'text'}]}]}",
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
    screenplay = json.loads(screenplay)

    print(" ")
    print(screenplay)
    print(" ")

    return screenplay, story
