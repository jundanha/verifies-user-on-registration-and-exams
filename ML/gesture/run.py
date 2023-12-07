from flask import Flask, render_template, Response
from flask_socketio import SocketIO
import cv2
import tensorflow as tf
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

model = tf.keras.models.load_model('./model.h5')
cap = cv2.VideoCapture(0)

# Modify the `generate_frame` function
def generate_frame():
    while True:
        start_time = time.time()
        status, frame = cap.read()

        # Preprocess the frame
        # Convert BGR to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Preprocess the frame
        rgb_frame = cv2.resize(rgb_frame, (250, 250))
        normalize_frame = rgb_frame.reshape(1, 250, 250, 3) / 255.0
        # frame = cv2.resize(frame, (250, 250))
        # normalize_frame = frame.reshape(1, 250, 250, 3) / 255.0

        # Make predictions using the model
        eye_gaze = model.predict(normalize_frame)

        # Convert the predictions to a string for display
        eye_gaze_str = str(eye_gaze[0])
        # Check eye gaze conditions and print messages
        if eye_gaze[0][1] > -0.34:
            gaze_message = 'Person looking straight'
        else:
            gaze_message = 'Person faced at other direction'
        print(gaze_message)
        
        # Encode the frame as JPEG
        _, jpeg_frame = cv2.imencode('.jpg', rgb_frame)
        frame_bytes = jpeg_frame.tobytes()

        # Yield the frame and predictions
        yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        socketio.emit('predictions',gaze_message + eye_gaze_str)
        
        # Calculate the elapsed time
        # elapsed_time = time.time() - start_time

        # # Sleep for the remaining time to make it approximately 1 second
        # if elapsed_time < 1:
        #     time.sleep(1 - elapsed_time)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frame(), content_type='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    socketio.run(app, port=3000, debug=True)