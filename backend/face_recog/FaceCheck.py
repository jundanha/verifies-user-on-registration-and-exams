from keras.preprocessing import image
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras import backend as K
from mtcnn import MTCNN
from PIL import Image
import os
from keras.applications.inception_resnet_v2 import preprocess_input
# from keras import ops

current_dir = os.path.dirname(os.path.abspath(__file__))
relative_path = "./snn_ResNetV2_v1.h5"
model_path = os.path.join(current_dir, relative_path)
def read_img(path):
    img = image.load_img(path, target_size=(224, 224))
    img = np.array(img).astype(np.float32)
    img = img/255.0
    return img

def euclidean_distance(vects):
    x, y = vects
    sum_square = K.sum(K.square(x - y), axis=1, keepdims=True)
    return K.sqrt(K.maximum(sum_square, K.epsilon()))


def contrastive_loss(y_true, y_pred):
    y_true = K.cast(y_true, dtype=tf.float32)
    y_pred = K.cast(y_pred, dtype=tf.float32)
    margin = 1
    square_pred = K.square(y_pred)
    margin_square = K.square(K.maximum(margin - y_pred, 0))
    loss = K.mean((1 - y_true) * square_pred + y_true * margin_square)
    return loss


from tensorflow.keras.models import load_model
from keras.utils import custom_object_scope

with custom_object_scope({'contrastive_loss' : contrastive_loss}):
    # Load your Keras model
    try:
        # Load your Keras model
        print("Loading model...")
        model = load_model(model_path)
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")

# Display the model architecture summary
model.summary()
    

facemodel = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def preprocess_frame(frame):
    # Convert BGR to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Preprocess the frame
    rgb_frame = cv2.resize(rgb_frame, (224, 224))
    re_frame = rgb_frame.reshape(1, 224, 224, 3)
    normalize_frame = preprocess_input(re_frame)

    return normalize_frame

#example Usage
#image = cv2.imread(img1_url)
def face_detection2(image):
    detector = MTCNN()
    result = detector.detect_faces(image)

    if len(result) > 0:
        # Select the first detected face
        bounding_box = result[0]['box']
        x, y, w, h = bounding_box
        
        # Draw a bounding box around the detected face
        cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)
        
        detected_face = image[y:y+h, x:x+w]
        # cv2.imshow("Detected Face", detected_face)
        #         # Wait for a key press before continuing
        # cv2.waitKey(0)
        
        # # Close the window
        # cv2.destroyAllWindows()
        return detected_face
    else:
    #     # No face detected
        return None
    
def face_detection(image):
    myfacecoord = facemodel.detectMultiScale(image)

    if len(myfacecoord) > 0:
        # Select the first detected face
        (x, y, w, h) = myfacecoord[0]
        
        # Draw a bounding box around the detected face
        cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)
        
        detected_face = image[y:y+h, x:x+w]
        
        cv2.imshow("Detected Face", detected_face)
                # Wait for a key press before continuing
        cv2.waitKey(0)
        
        # Close the window
        cv2.destroyAllWindows()
        
        return (detected_face)
    
    else:
        # No face detected
        return None

import requests

def load_image_from_url(url):
    response = requests.get(url)
    image_array = np.asarray(bytearray(response.content), dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    return image

def run_face_check(img1_url, img2_url):
    if img1_url.startswith('http'):
        img1 = load_image_from_url(img1_url)
    else:
        img1 = cv2.imread(img1_url)
        
    if img2_url.startswith('http'):
        img2 = load_image_from_url(img2_url)
    else:
        img2 = cv2.imread(img2_url)
        
    # detected_face1 = face_detection2(img1)
    # detected_face2 = face_detection2(img2)
    
    face1 = preprocess_frame(img1)
    face2 = preprocess_frame(img2)
    
    prediction = model.predict([face1, face2])
    if prediction[0] < 0.5:
        isMatch = True
    else:
        isMatch = False
        
    return (str(prediction[0][0]), isMatch)

#Usage Example
# img_url = 'https://storage.googleapis.com/c23-capstone-project-bucket/photos/4bc34f7b-5485-415d-a8c0-54332f09f3a2.jpg'
# run_face_check(img_url, '../tes_img/chaeryoeong.jpg')