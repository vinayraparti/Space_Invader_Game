from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/save_score', methods=['POST'])
def save_score():
    score = request.json.get('score', 0)
    response = jsonify({'message': 'Score saved!'})
    response.set_cookie('score', str(score))
    return response

@app.route('/get_score', methods=['GET'])
def get_score():
    score = request.cookies.get('score', 0)
    return jsonify({'score': score})

if __name__ == "__main__":
    app.run(debug=True)
