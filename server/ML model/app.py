from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import joblib

app = Flask(__name__)



import numpy as np

def transform_input_data(input_data, seq_length=50, num_features=15):
    # Check if the input data length is correct
    if len(input_data) != 15:
        raise ValueError(f"Input data must be of length {num_features}")

    # Repeat the input data to match the required sequence length
    repeated_data = np.tile(input_data, (seq_length, 1))

    # Add a new axis to make the shape (1, seq_length, num_features)
    reshaped_data = np.expand_dims(repeated_data, axis=0)

    return reshaped_data



@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse the request data
        data = request.get_json(force=True)
        features = np.array(data['features'])

        # Log the shape and content of the features
        print(f"Received features shape: {features.shape}")
        print(f"Received features content: {features}")

        transformed_features = transform_input_data(features)
        features = features.reshape(1,-1)

        # Load the model (ensure the model is loaded correctly)
        model = tf.keras.models.load_model('model.h5')
        
        # Load your models
        pipe = joblib.load("pipe.pkl")

        # Make prediction
        prediction = model.predict(transformed_features)
        pipe_pred = pipe.predict(features)
        
        print(f"Prediction: {prediction}")
        print(f"Prediction: {pipe_pred}")

        # Return the prediction as JSON
        output = jsonify({'prediction': prediction.tolist(),
                          'pipe_pred' : pipe_pred.tolist(),
                          })
        return output
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
