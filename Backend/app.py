from flask import Flask, jsonify, request
import pickle
import numpy as np
import spacy
import warnings

warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning)



nlp = spacy.load('en_core_web_sm')

app = Flask(__name__)

# Load the machine learning model
with open('model.pkl', 'rb') as model_file:
    pipe = pickle.load(model_file)

def encode(sentence):
    doc = nlp(sentence)
    sentence_mean_embedding = doc.vector.sum()
    return sentence_mean_embedding

def remove_punct_stop(description1):
    doc = nlp(description1)
    filtered_text = ' '.join(token.text for token in doc if not (token.is_stop or token.is_punct))
    return filtered_text

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        total_budget_changes = data['total_budget_changes']
        total_schedule_changes = data['total_schedule_changes']
        description = data['description']
        # estimated_days = data['estimated_days']

        # Preprocessing
        description = encode(remove_punct_stop(description))

        # Convert the data into the format expected by the model
        query = np.array([total_budget_changes, total_schedule_changes, description])
        query = query.reshape(1, -1)

        # Perform prediction
        prediction = pipe.predict(query)[0]

        

        # Return the prediction as JSON
        return jsonify({'prediction': prediction})

    except Exception as e:
        # Handle errors gracefully
        return jsonify({'error': str(e)}), 400


@app.route('/')
def welcome():
    return 'Welcome to the backend'

if __name__ == '__main__':
    app.run(debug=True)