#Description: Create a GET request
#Author: Supreeth


from flask import Flask, request

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return "Hello CalHacks!"

@app.route('/show', methods=['GET'])
def greet():
    name = request.args.get('name','Mr.Default') 
    return f"Hello, {name}!"

##GET request to another site
#@app.route('/showme')
#def get_data():
#    return requests.get('http://google.com').content

if __name__ == '__main__':
    app.run(debug=True)
