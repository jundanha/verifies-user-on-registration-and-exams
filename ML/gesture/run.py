from flask import Flask, render_template, Response
from flask_socketio import SocketIO
import cv2
import tensorflow as tf
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

model = tf.keras.models.load_model('./model.h5')
cap = cv2.VideoCapture(0)

# Modify the `generate_frame` function
def generate_frame():
    while True:
        status, frame = cap.read()

        # Preprocess the frame
        frame = cv2.resize(frame, (250, 250))
        normalize_frame = frame.reshape(1, 250, 250, 3) / 255.0

        # Make predictions using the model
        eye_gaze = model.predict(normalize_frame)

        # Convert the predictions to a string for display
        eye_gaze_str = str(eye_gaze[0][0])

        # Encode the frame as JPEG
        _, jpeg_frame = cv2.imencode('.jpg', frame)
        frame_bytes = jpeg_frame.tobytes()

        # Yield the frame and predictions
        yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        socketio.emit('predictions', eye_gaze_str)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frame(), content_type='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    socketio.run(app, port=3000, debug=True)
from flask import Flask, render_template, Response
from flask_socketio import SocketIO
import cv2
import tensorflow as tf

app = Flask(__name__)
socketio = SocketIO(app)

model = tf.keras.models.load_model('./model.h5')
cap = cv2.VideoCapture(0)

# Modify the `generate_frame` function
def generate_frame():
    while True:
        status, frame = cap.read()

        # Preprocess the frame
        frame = cv2.resize(frame, (250, 250))
        normalize_frame = frame.reshape(1, 250, 250, 3) / 255.0

        # Make predictions using the model
        eye_gaze = model.predict(normalize_frame)

        # Convert the predictions to a string for display
        eye_gaze_str = str(eye_gaze[0][0])

        # Encode the frame as JPEG
        _, jpeg_frame = cv2.imencode('.jpg', frame)
        frame_bytes = jpeg_frame.tobytes()

        # Yield the frame and predictions
        yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        socketio.emit('predictions', eye_gaze_str)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frame(), content_type='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    socketio.run(app, port=3000, debug=True, cors_allowed_origins="*")

