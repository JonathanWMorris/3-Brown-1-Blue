from openai import OpenAI

from dotenv import load_dotenv

load_dotenv()

client = OpenAI()

response = client.chat.completions.with_raw_response.create(
    messages=[
        {
            "role": "system",
            "content": "You are an asistant that converts any queries about topics into a short (1 paragraph) story to show real life examples of concepts.",
        },
        {
            "role": "user",
            "content": "What are quadratic equations?",
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
            "content": "You are an asistant that converts a story into a short screenplay. The duration of the screenplay should not be longer than 5 scenes. Only include a scene description for each secene and the dialog spoken at that scene, make the descriptions as generalizable as possible. Don't use any markdown. Seperate description and dialog clearly.",
        },
        {
            "role": "user",
            "content": story,
        },
    ],
    model="gpt-4o-mini",
)

completion = response.parse()
screenplay = completion.choices[0].message.content
print(" ")
print(screenplay)
print(" ")