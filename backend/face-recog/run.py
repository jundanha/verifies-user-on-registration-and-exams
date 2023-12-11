from flask import Flask, render_template, Response, request
from flask_socketio import SocketIO
import cv2
import tensorflow as tf
from flask_cors import CORS
import time
import numpy as np
from PIL import Image
from io import BytesIO
from tensorflow.keras import backend as K
from keras.utils import custom_object_scope
from keras.models import load_model
from keras.layers import Layer

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

#Add Custom Loss Object

def euclidean_distance(vectors):
    vector1, vector2 = vectors
    sum_square = K.sum(K.square(vector1 - vector2), axis=1, keepdims=True)
    return K.sqrt(K.maximum(sum_square, K.epsilon()))

def contrastive_loss(y_true, y_pred):
    y_true = K.cast(y_true, dtype=tf.float32)
    y_pred = K.cast(y_pred, dtype=tf.float32)
    margin = 1
    square_pred = K.square(y_pred)
    margin_square = K.square(K.maximum(margin - y_pred, 0))
    loss = K.mean((1 - y_true) * square_pred + y_true * margin_square)
    return loss

def contrastrive_loss(y_true, y_pred):
    y_true = K.cast(y_true, dtype=tf.float32)
    y_pred = K.cast(y_pred, dtype=tf.float32)
    margin = 1
    square_pred = K.square(y_pred)
    margin_square = K.square(K.maximum(margin - y_pred, 0))
    loss = K.mean((1 - y_true) * square_pred + y_true * margin_square)
    return loss

class DistanceLayer(Layer):
    def __init__(self, **kwargs):
        super(DistanceLayer, self).__init__(**kwargs)

    def call(self, inputs):
        anchor, positive = inputs
        distance = tf.reduce_sum(tf.square(anchor - positive), -1, keepdims=True)
        return distance

    def get_config(self):
        base_config = super().get_config()
        return base_config

    @classmethod
    def from_config(cls, config):
        return cls(**config)

# def Lambda(euclidian_distance, euclidian_distance_output_shape)
# Register the custom loss function
with custom_object_scope({'DistanceLayer': DistanceLayer, 'contrastive_loss' : contrastive_loss, 'contrastrive_loss' : contrastrive_loss}):
    # Load your Keras model
    try:
        # Load your Keras model
        print("Loading model...")
        model = load_model('./snn_tru_v1.h5')
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")

facemodel = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
# model = tf.keras.models.load_model('./trained_model/model_v1.h5')
cap = cv2.VideoCapture(0)
selected_image = None

# Define the function to preprocess the frame
def preprocess_frame(frame: np.ndarray) -> np.ndarray:
    """
    Preprocesses an input frame to prepare it for further processing.

    Args:
        frame: The input frame to be preprocessed.

    Returns:
        The preprocessed frame ready for further processing.
    """
    # Convert BGR to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Resize the frame to 128x128 pixels
    resized_frame = cv2.resize(rgb_frame, (128, 128))

    # Normalize the pixel values of the frame
    normalize_frame = resized_frame.astype(np.float32) / 255.0

    # Reshape the frame to match the expected input shape of the model
    normalize_frame = np.expand_dims(normalize_frame, axis=0)

    return normalize_frame

# # Function to handle selected image
# def process_selected_image(image_data, resize_size=(128, 128)):
#     """
#     Process the selected image.

#     Args:
#         image_data (bytes): The image data.
#         resize_size (tuple, optional): The size to resize the image to. Defaults to (128, 128).

#     Returns:
#         numpy.ndarray: The processed image.
#     """
#     try:
#         processed_image = Image.open(BytesIO(image_data))
#         processed_image = processed_image.resize(resize_size)
#         processed_image = np.array(processed_image)
#         processed_image = preprocess_frame(processed_image)
#         return processed_image
#     except Exception as e:
#         print(f'Error processing image: {e}')
#         return None

# Modify the `generate_frame` function
def generate_frame(image, video_frame):
    global selected_image
    while True:
        
        facecoord1 = facemodel.detectMultiScale(image)
        facecoord2 = facemodel.detectMultiScale(video_frame)

        for (x, y, w, h) in facecoord1:
            # Draw a bounding box around the detected face
            cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)
        
        for (x, y, w, h) in facecoord2:
            # Draw a bounding box around the detected face
            cv2.rectangle(video_frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
        
        detected_face1 = image[y:y+h, x:x+w]
        detected_face2 = video_frame[y:y+h, x:x+w]
        # Preprocess the frame
        preprocess_img1 = preprocess_frame(detected_face1)
        preprocess_img2 = preprocess_frame(detected_face2)

        # Make predictions using the model
        
        distance = model.predict([preprocess_img1, preprocess_img2])
        # else:
        #     distance = np.zeros((1,)) # Default match value if no selected image

        # Convert the predictions to a string for display
        pred_str = str(distance[0])

        # Check the face recognition conditions and print messages
        if distance[0] < 0.7:
            isMatch = True
        elif distance[0] == 0:
            out_message = 'Pls input Image First'
        else:
            isMatch = False

        print(isMatch)
        
        return (distance[0], isMatch)

        # Encode the frame as JPEG
        # _, jpeg_frame = cv2.imencode('.jpg', frame)
        # frame_bytes = jpeg_frame.tobytes()

        # Yield the frame and predictions
        yield (b'--frame\r\n'
               b'Content-Type: string\r\n\r\n' + pred_str + b'\r\n')

        socketio.emit('predictions', isMatch + ' || ' + 'distance_pred : ' + pred_str)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frame(), content_type='multipart/x-mixed-replace; boundary=frame')

# Endpoint to receive the selected image
# @app.route('/select_image', methods=['POST'])
# def select_image():
#     global selected_image
#     image_data = request.files['image'].read()
#     process_selected_image(image_data)
#     return "Image selected successfully!"

if __name__ == '__main__':
    socketio.run(app, port=3000, debug=True)
