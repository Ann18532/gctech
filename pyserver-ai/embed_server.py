from sentence_transformers import SentenceTransformer
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
model = SentenceTransformer('all-MiniLM-L6-v2')

@app.route('/embed', methods=['POST'])
def embed():
    data = request.json
    texts = data.get('inputs', [])
    if not texts:
        return jsonify({"error": "Missing 'inputs'"}), 400
    embeddings = model.encode(texts).tolist()
    return jsonify({"embeddings": embeddings})

if __name__ == '__main__':
    app.run(port=5100)
