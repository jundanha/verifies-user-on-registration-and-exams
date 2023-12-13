from flask import Flask, render_template, Response
from flask_socketio import SocketIO
import cv2
import tensorflow as tf
from flask_cors import CORS
import time
import numpy as np
from matplotlib import pyplot as plt
from google.cloud import storage

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

model = tf.keras.models.load_model('./eygaze_VGG16_v1.h5')

gcs_video_url = 'https://storage.googleapis.com/c23-capstone-project-bucket/videos/WIN_20231211_10_44_04_Pro.mp4'
# video_path = None
cap = cv2.VideoCapture(0)

def display_vec_arrow(image, vec_eye=[0, 0], vec=[0, 0]):
    if np.any(vec != [0, 0]) and np.any(vec_eye != [0, 0]):
        head_direction = np.array(vec)
        eye_gaze = np.array(vec_eye)
    else:
        # Assuming image is a dictionary with the required keys
        head_direction = np.array(image["Overall"]["ImageHeadDirection"])
        eye_gaze = np.array(image["Overall"]["ImageEyesGazeDirection"])

    left_eye = np.array([303, 215])
    right_eye = np.array([256, 218])
    nose = np.array([256, 264])
    arrow_width = 20
    offset = 100
    fig, ax = plt.subplots()
    ar = cv2.resize(image, (480, 480))
    ax.imshow(ar)
    ax.add_patch(plt.Arrow(*left_eye, *(eye_gaze * offset), width=arrow_width))
    ax.add_patch(plt.Arrow(*right_eye, *(eye_gaze * offset), width=arrow_width, color="r"))
    ax.add_patch(plt.Arrow(*nose, *(head_direction * offset), width=arrow_width, color="y"))

    plt.show()

def display_vec_arrow2(frame, vec_eye=[0, 0], vec=[0, 0], target_size=(480, 480)):
    if np.any(vec != [0, 0]) or np.any(vec_eye != [0, 0]):
        head_direction = np.array(vec)
        eye_gaze = np.array(vec_eye)
    else:
        # Default values or use your logic to get values
        head_direction = np.array([1, 0])
        eye_gaze = np.array([0, 1])

    left_eye = np.array([303, 215])
    right_eye = np.array([256, 218])
    nose = np.array([256, 264])
    arrow_width = 5
    offset = 100

    # Resize the frame if necessary
    frame_resized = cv2.resize(frame, target_size)

    # Draw arrows on the resized frame
    cv2.arrowedLine(frame_resized, tuple(left_eye), tuple((left_eye + eye_gaze * offset).astype(int)),
                    color=(255, 0, 0), thickness=arrow_width, tipLength=0.5)
    cv2.arrowedLine(frame_resized, tuple(right_eye), tuple((right_eye + eye_gaze * offset).astype(int)),
                    color=(0, 0, 255), thickness=arrow_width, tipLength=0.5)
    cv2.arrowedLine(frame_resized, tuple(nose), tuple((nose + head_direction * offset).astype(int)),
                    color=(0, 255, 255), thickness=arrow_width, tipLength=0.5)

    # Convert the resized frame to JPEG format
    arrow_frame = cv2.cvtColor(frame_resized, cv2.COLOR_RGB2BGR)
    return arrow_frame


# Modify the `generate_frame` function
def generate_frame():
    while True:
        start_time = time.time()
        status, frame = cap.read()

        # Preprocess the frame
        # Convert BGR to RGB
        # rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    #     img = image.load_img(path, target_size=(250, 250))
    #     img = np.array(img).astype(np.float64)
    # # img = preprocess_input(img)
    #     img = img/255.0
        # Preprocess the frame
        rgb_frame = cv2.resize(frame, (250, 250)).astype(np.float64)
        normalize_frame = rgb_frame.reshape(1, 250, 250, 3) / 255.0
        # frame = cv2.resize(frame, (250, 250))
        # normalize_frame = frame.reshape(1, 250, 250, 3) / 255.0

        # Make predictions using the model
        eye_gaze = model.predict(normalize_frame)
        arrow_image = display_vec_arrow2(frame, vec_eye=eye_gaze[1][0],vec=eye_gaze[0][0])
        print(eye_gaze[0])

        # Convert the predictions to a string for display
        eye_gaze_str = str(eye_gaze[0])
        # Check eye gaze conditions and print messages
        if eye_gaze[1][0][1] > -0.34:
            gaze_message = 'Person looking straight'
        else:
            gaze_message = 'Person faced at other direction'
        print(gaze_message)
        
        # Encode the frame as JPEG
        _, jpeg_frame = cv2.imencode('.jpg', arrow_image)
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