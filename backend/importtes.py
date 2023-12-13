# main.py
import cv2
from tensorflow.keras import backend as K
from gesture_tracker.gesture import run_head_pose_estimation
from flask import request
# from face_recog.FaceCheck import run
import os
# Example usage
src = './gesture_tracker/jundan.mp4'
imported_func = run_head_pose_estimation(src)

current_dir = os.path.dirname(os.path.abspath(__file__))
relative_path = "./tes_img/chaeryoeong.jpg"
relative_path2 = "./tes_img/koko4.jpeg"
img1_path = os.path.join(current_dir, relative_path)
img2_path = os.path.join(current_dir, relative_path2)

img1 = cv2.imread(img1_path)
img2 = cv2.imread(img2_path)

# imported_func2 = run(img1_path, img2_path)

if img1 is None or img2 is None:
    print("Image not found or could not be loaded.")
else:
    # Process the images
    print("Image Loaded successfully")
    # imported_func2 = run(img1_path, img2_path)

# val, match = imported_func2

# print(val, match)
# You can now use result_frame or perform any other operations as needed.
import time

# ...

start_time = time.time()
counter = 0

# Now, let the frames flow.
while True:
    # ...

    # All done. The best way to show the result would be drawing the
    # pose on the frame in realtime.
    print("Estimated Pose (rotation, translation):")
    if pose[0][0] < -0.5 or pose[1][0]>70 and pose[1][1] > -70:
        # pred_str = str(pose[0][0])
        prediction = 'Facing left'
        counter += 1
        # print('facing left :', pose[0][0])
    elif pose[0][0] > 0.5:
        # pred_str = str(pose[0][0])
        prediction = 'Facing right'
        counter += 1
        # print('facing Right :', pose[0][0])
    elif pose[1][1] < -70:
        prediction = 'Heads Down'
        counter += 1
    # elif pose[1][1] > 5:
    #     prediction = 'Heads Up'
        # counter += 1
    else:
        # pred_str = str(pose[1])
        prediction = 'On Focus'
        counter = 0
        # print('Pose Orientation :', pose)

    # Do you want to see the pose annotation?
    pose_estimator.visualize(frame, pose, color=(0, 255, 0))

    if counter > 10:
        print(prediction)
    
    # ...

    # Introduce a time delay of 1 second
    elapsed_time = time.time() - start_time
    if elapsed_time >= 1:
        start_time = time.time()
        # Perform the prediction every 1 second

    # ...