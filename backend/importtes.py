# main.py
import cv2
from tensorflow.keras import backend as K
# from gesture_tracker.gesture import run_head_pose_estimation
from flask import request
from face_recog.FaceCheck import run_face_check
import os
# Example usage
src = './gesture_tracker/jundan.mp4'
# imported_func = run_head_pose_estimation(src)

current_dir = os.path.dirname(os.path.abspath(__file__))
relative_path = "./tes_img/chaeryoeong.jpg"
relative_path2 = "./tes_img/face1.jpg"
img1_path = os.path.join(current_dir, relative_path)
img2_path = os.path.join(current_dir, relative_path2)

img1 = cv2.imread(img1_path)
img2 = cv2.imread(img2_path)
img_url = 'https://storage.googleapis.com/c23-capstone-project-bucket/photos/4bc34f7b-5485-415d-a8c0-54332f09f3a2.jpg'
# imported_func2 = run(img1_path, img2_path)

if img1 is None or img2 is None:
    print("Image not found or could not be loaded.")
else:
    # Process the images
    print("Image Loaded successfully")
    imported_func2 = run_face_check(img1_path, img2_path)

val, match = imported_func2

print(val, match)
# You can now use result_frame or perform any other operations as needed.