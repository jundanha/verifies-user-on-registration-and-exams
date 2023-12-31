"""Demo code showing how to estimate human head pose.

There are three major steps:
1. Detect and crop the human faces in the video frame.
2. Run facial landmark detection on the face image.
3. Estimate the pose by solving a PnP problem.

For more details, please refer to:
https://github.com/yinguobing/head-pose-estimation
"""
# from argparse import ArgumentParser

import cv2

from .face_detection import FaceDetector
from .mark_detection import MarkDetector
from .pose_estimation import PoseEstimator
from .utils import refine
import os
import time
import requests


# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# Specify the relative path to the ONNX model file
relative_path1 = "assets/face_detector.onnx"
relative_path2 = "assets/face_landmarks.onnx"
face_model_path = os.path.join(current_dir, relative_path1)
mark_model_path = os.path.join(current_dir, relative_path2)

def run_head_pose_estimation(src, exam_id):
    # Before estimation started, there are some startup works to do.

    # Initialize the video source from webcam or video file.
    # video_src = args.cam if args.video is None else args.video
    video_src = src
    cap = cv2.VideoCapture(video_src)
    print(f"Video source: {video_src}")

    # Get the frame size. This will be used by the following detectors.
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Setup a face detector to detect human faces.
    face_detector = FaceDetector(face_model_path)

    # Setup a mark detector to detect landmarks.
    mark_detector = MarkDetector(mark_model_path)

    # Setup a pose estimator to solve pose.
    pose_estimator = PoseEstimator(frame_width, frame_height)

    # Measure the performance with a tick meter.
    tm = cv2.TickMeter()

    start_time = time.time()
    counter = 0
    
    # Now, let the frames flow.
    while True:

        # Read a frame.
        frame_got, frame = cap.read()
        if frame_got is False:
            break
        
        #Add TimeStamp of from the Video Captured
        timestamp = cap.get(cv2.CAP_PROP_POS_MSEC)
        timestamp_sec = int(timestamp / 1000)  # Convert milliseconds to seconds
        hours = timestamp_sec // 3600
        minutes = (timestamp_sec % 3600) // 60
        seconds = (timestamp_sec % 60)
        # print(f"Timestamp: {hours:02d}:{minutes:02d}:{seconds:02d}:{timestamp:.2f}")
        # print(f"Timestamp : {timestamp} ms")
        
        # If the frame comes from webcam, flip it so it looks like a mirror.
        if video_src == 0:
            frame = cv2.flip(frame, 2)

        # Step 1: Get faces from current frame.
        faces, _ = face_detector.detect(frame, 0.7)

        # Any valid face found?
        if len(faces) > 0:
            tm.start()

            # Step 2: Detect landmarks. Crop and feed the face area into the
            # mark detector. Note only the first face will be used for
            # demonstration.
            face = refine(faces, frame_width, frame_height, 0.15)[0]
            x1, y1, x2, y2 = face[:4].astype(int)
            patch = frame[y1:y2, x1:x2]

            # Run the mark detection.
            marks = mark_detector.detect([patch])[0].reshape([68, 2])

            # Convert the locations from local face area to the global image.
            marks *= (x2 - x1)
            marks[:, 0] += x1
            marks[:, 1] += y1

            # print("Facial Landmarks (x,y) :")
            # print(marks)
            # Step 3: Try pose estimation with 68 points.
            pose = pose_estimator.solve(marks)

            tm.stop()

            # All done. The best way to show the result would be drawing the
            # pose on the frame in realtime.
            # print("Estimated Pose (rotation, translation):")
        
            # Do you want to see the pose annotation?
            pose_estimator.visualize(frame, pose, color=(0, 255, 0))

            #Check The Behavior at Some Interval
            elapsed_time = time.time() - start_time
            timestamp_str = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
            if elapsed_time >= 1:
                start_time = time.time()
                if pose[0][0] < -0.5 or pose[1][0]>70 and pose[1][1] > -70:
                # pred_str = str(pose[0][0])
                    prediction = 'Facing left'
                    counter += 1
                elif pose[0][0] > 0.5:
                # pred_str = str(pose[0][0])
                    prediction = 'Facing right'
                    counter += 1
                # print('facing Right :', pose[0][0])
                elif pose[1][1] < -70:
                    prediction = 'Heads Down'
                    counter += 1
                elif pose[1][1] > 10:
                    prediction = 'Heads Up'
                    counter += 1
                else:
                # pred_str = str(pose[1])
                    prediction = 'On Focus'
                    counter = 0
                # print('Pose Orientation :', pose)
                if counter > 5:
                    counter = 0
                    # print(prediction, timestamp_str)
                    data = {
                    'examID' : exam_id,
                    'timestamp' : timestamp_str,
                    'verdict' : prediction,
            
                    }
                    # Convert the frame to a byte array
                    _, frame_binary = cv2.imencode('.jpg', frame)

                    # Create the files dictionary with the encoded frame
                    files = {'photo': ('frame.jpg', frame_binary.tobytes(), 'image/jpeg')}
        
                    response = requests.post('http://localhost:5000/add_activity', data=data, files=files)
                    # if response.text:
                    #     print("Response is not empty")
                    # else:
                    #     print("Response is empty")
                
            # Do you want to see the axes?
            # pose_estimator.draw_axes(frame, pose)

            # Do you want to see the marks?
            # mark_detector.visualize(frame, marks, color=(0, 255, 0))

            # Do you want to see the face bounding boxes?
            # face_detector.visualize(frame, faces)

        # Draw the FPS on screen.
        # Convert the timestamp to a string format.
        # timestamp_str = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
        # cv2.putText(frame, f"Timestamp: {timestamp_str}", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        # cv2.rectangle(frame, (0, 0), (90, 30), (0, 0, 0), cv2.FILLED)
        # cv2.putText(frame, f"FPS: {tm.getFPS():.0f}", (10, 20),
        #              cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255))

        # Show preview.
        # cv2.imshow("Preview", frame)
        # if cv2.waitKey(1) == 27:
        #     break
        
    # return frame

# if __name__ == '__main__':
#     run_head_pose_estimation()
