from keras.preprocessing import image
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras import backend as K
from mtcnn import MTCNN
import os
# from keras import ops

current_dir = os.path.dirname(os.path.abspath(__file__))
relative_path = "./snn_tru_v1.h5"
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

with custom_object_scope({'contrastrive_loss' : contrastive_loss}):
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
    rgb_frame = cv2.resize(rgb_frame, (128, 128))
    normalize_frame = rgb_frame.reshape(1, 128, 128, 3) / 255.0

    return normalize_frame

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
        cv2.imshow("Detected Face", detected_face)
                # Wait for a key press before continuing
        cv2.waitKey(0)
        
        # Close the window
        cv2.destroyAllWindows()
        
        return detected_face
    else:
        # No face detected
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
        
        return detected_face
    
    else:
        # No face detected
        return None

def run(img1_url, img2_url):
    img1 = cv2.imread(img1_url)
    img2 = cv2.imread(img2_url)
# Make a prediction using the trained model
    detected_face1 = face_detection2(img1)
    detected_face2 = face_detection2(img2)
    
    face1 = preprocess_frame(detected_face1)
    face2 = preprocess_frame(detected_face2)
    
    prediction = model.predict([face1, face2])
    
    return print('pred values :', prediction)
# Print the prediction
    # print("Similarity Score:", prediction[0][0])

# run("../tes_img/koko4.jpeg", '../tes_img/chaeryoeong.jpg')