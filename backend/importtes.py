# main.py
import cv2
from tensorflow.keras import backend as K
from gesture_tracker.gesture import run_head_pose_estimation
from face_recog.FaceCheck import run
import os
# Example usage
# imported_func = run_head_pose_estimation('./gesture_tracker/jundan.mp4')

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
# You can now use result_frame or perform any other operations as needed.
