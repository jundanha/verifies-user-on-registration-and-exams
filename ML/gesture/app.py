from flask import Flask, render_template, Response
import cv2
import tensorflow as tf
import numpy as np

app = Flask(__name__)

model = tf.keras.models.load_model('model.h5')
cap = cv2.VideoCapture(0)

def generate_frame():
    while True:
        status, frame = cap.read()

        # Preprocess the frame
        frame = cv2.resize(frame, (250, 250))
        frame = frame.reshape(1, 250, 250, 3) / 255.0

        # Make predictions using the model
        eye_gaze = model.predict(frame)

        # Yield the frame and predictions
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + cv2.imencode('.jpg', frame)[1].tobytes() + b'\r\n\r\n' +
               b'Eye Gaze Predictions: ' + str(eye_gaze) + b'\r\n\r\n')

@app.route('/')
def index():
    return render_template('index.html')  # You can create an HTML template to display the video feed and predictions

@app.route('/video_feed')
def video_feed():
    return Response(generate_frame(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)
