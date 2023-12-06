from flask import Flask, render_template, Response
import cv2
import tensorflow as tf

app = Flask(__name__)

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
        yield f"data:image/jpeg;base64,{frame_bytes.decode('utf-8')}\r\n\r\nEye Gaze Predictions: {eye_gaze_str}\r\n\r\n"

@app.route('/')
def index():
    return render_template('index.html')
    
@app.route('/video_feed')
def video_feed():
    return Response(generate_frame(), mimetype= 'multipart/x-mixed-replace',content_type='text/event-stream')

if __name__ == '__main__':
    app.run(port=3000, debug=True)