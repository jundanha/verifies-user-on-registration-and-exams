# -*- coding: utf-8 -*-
"""face_recognitions.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1QxCZYCbUtzoo2mDMLlAwVCRVSItAAHOY
"""

import os
from keras.preprocessing import image
import cv2
import numpy as np
import tensorflow as tf
from keras.callbacks import ModelCheckpoint, ReduceLROnPlateau, EarlyStopping
from keras.layers import Input, Dense, GlobalMaxPool2D, GlobalAvgPool2D, Concatenate, Lambda, Dropout, Subtract, Reshape, Flatten, Conv2D, MaxPooling2D
from keras.models import Model
from keras.optimizers import Adam, Adagrad, RMSprop
from keras import regularizers
import matplotlib.pyplot as plt
import matplotlib.image as mpimg

"""Get the data from Drive"""

from google.colab import drive
import shutil

# drive.mount('/content/drive', force_remount=True)

import zipfile

def unzip_file(zip_file_path, extract_folder):
    with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
        zip_ref.extractall(extract_folder)

# Example usage:
zip_file_path = '/train-faces-micro.zip'  # Specify the path to your zip file
extract_folder = '/tmp/train-faces-micro'  # Specify the path to the folder where you want to extract the contents

# Create the extract folder if it doesn't exist
if not os.path.exists(extract_folder):
    os.makedirs(extract_folder)

# Unzip the file into the folder with the same name
unzip_file(zip_file_path, extract_folder)

"""**Prepare the Data Set:**

directory structure of the dataset:
- dataset:
   - F001
     - MD1
       - img1.jpg
       - img2.jpg
       ...
     - MD2
       ...
   - F002
     ...
"""

import random

def get_family_folders(data_dir):
    # Get a list of family folders
    return [family_folder for family_folder in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, family_folder))]

def create_positive_pairs(family_folder):
    # Create positive pairs for a given family folder
    positive_pairs = []
    family_member_folders = [member_folder for member_folder in os.listdir(family_folder) if os.path.isdir(os.path.join(family_folder, member_folder))]

    for member_folder in family_member_folders:
        member_images = [os.path.join(family_folder, member_folder, img) for img in os.listdir(os.path.join(family_folder, member_folder))]

        # Create positive pairs (images from the same family member)
        for i in range(len(member_images)):
            for j in range(i + 1, len(member_images)):
                positive_pairs.append((member_images[i], member_images[j], 0))  # Label 1 for positive pair

    return positive_pairs

def create_negative_pairs(family_folders):
    # Create negative pairs by selecting images from different family members
    negative_pairs = []

    for i in range(len(family_folders)):
        for j in range(i + 1, len(family_folders)):
            member_folder_1 = random.choice(os.listdir(os.path.join(data_dir, family_folders[i])))
            member_folder_2 = random.choice(os.listdir(os.path.join(data_dir, family_folders[j])))

            member_images_1 = [os.path.join(data_dir, family_folders[i], member_folder_1, img) for img in os.listdir(os.path.join(data_dir, family_folders[i], member_folder_1))]
            member_images_2 = [os.path.join(data_dir, family_folders[j], member_folder_2, img) for img in os.listdir(os.path.join(data_dir, family_folders[j], member_folder_2))]

            # Create negative pairs (images from different family members)
            for img_1 in member_images_1:
                for img_2 in member_images_2:
                    negative_pairs.append((img_1, img_2, 1))  # Label 0 for negative pair
    # Sample an equal number of negative pairs for each positive pair
    equalized_negative_pairs = random.sample(negative_pairs, len(positive_pairs) * num_negatives_per_positive)

    return equalized_negative_pairs

# Example usage:
data_dir = "./train-faces-micro"
family_folders = get_family_folders(data_dir)

positive_pairs = []
negative_pairs = []

for family_folder in family_folders:
    positive_pairs.extend(create_positive_pairs(os.path.join(data_dir, family_folder)))

num_negatives_per_positive = 5
negative_pairs.extend(create_negative_pairs(family_folders))

# Now you have positive_pairs and negative_pairs that can be used for training

print('Positive pair datas :', len(positive_pairs))
print('Negative pair datas :', len(negative_pairs))
img1, img2, labels = positive_pairs[1]
print(labels)
print(negative_pairs[1][0])

def display_sample_pairs(positive_pairs, negative_pairs, num_samples=2):
    # Display a sample of positive pairs
    print("Sample Positive Pairs:")
    for i in range(min(num_samples, len(positive_pairs))):
        img_1, img_2, label = positive_pairs[i]
        display_pair_images(img_1, img_2)

    # Display a sample of negative pairs
    print("Sample Negative Pairs:")
    for i in range(min(num_samples, len(negative_pairs))):
        img_1, img_2, label = negative_pairs[i]
        if os.path.exists(img_1) and os.path.exists(img_2):
            display_pair_images(img_1, img_2)
        else:
            print(f"Invalid paths for negative pair {i + 1}. Skipping display.")

def display_pair_images(img_path_1, img_path_2):
    # Display two images side by side
    fig, axes = plt.subplots(1, 2, figsize=(8, 4))

    img_1 = mpimg.imread(img_path_1)
    img_2 = mpimg.imread(img_path_2)

    axes[0].imshow(img_1)
    axes[0].axis('off')
    axes[0].set_title('Image 1')

    axes[1].imshow(img_2)
    axes[1].axis('off')
    axes[1].set_title('Image 2')

    plt.show()

# Display a sample of positive and negative pairs
display_sample_pairs(positive_pairs, negative_pairs)

"""Preprocess the Images"""

from keras.applications.mobilenet_v2 import preprocess_input

def read_img(path):
    img = image.load_img(path, target_size=(224, 224))
    img = np.array(img).astype(np.float64)
    img = preprocess_input(img)
    return img

def preprocess_images_cv2(image_paths, target_size=(224, 224), normalize=True):
    images = []

    for img_path in image_paths:
        # Load image using OpenCV
        img = cv2.imread(img_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Convert to RGB format

        # Resize image
        img = cv2.resize(img, target_size)

        # Normalize pixel values if needed
        if normalize:
            img = img.astype(np.float32) / 255.0

        images.append(img)

    return np.array(images)

"""**Generate the Inputs**"""

# Combine positive and negative pairs
all_pairs = positive_pairs + negative_pairs
# Shuffle the pairs to mix positive and negative examples
random.shuffle(all_pairs)

# Separate the pairs into inputs and labels
input_data_1 = [pair[0] for pair in all_pairs]
input_data_2 = [pair[1] for pair in all_pairs]
labels = np.array([pair[2] for pair in all_pairs])

# Split the data into training and validation sets
split_ratio = 0.95  # 95% for training, 5% for validation
split_index = int(len(all_pairs) * split_ratio)

train_input_data_1 = input_data_1[:split_index]
train_input_data_2 = input_data_2[:split_index]
train_labels = labels[:split_index]

val_input_data_1 = input_data_1[split_index:]
val_input_data_2 = input_data_2[split_index:]
val_labels = labels[split_index:]

index = 3000
print(input_data_1[index])
print(input_data_2[index])
print(labels[index])
print(len(input_data_1), len(input_data_2), len(labels))
display_pair_images(input_data_1[index], input_data_2[index])

def pair_generator(input_data_1, input_data_2, labels, batch_size=32):
    num_pairs = len(input_data_1)
    indices = np.arange(num_pairs)

    while True:
        np.random.shuffle(indices)  # Shuffle the indices at the start of each epoch

        for i in range(0, num_pairs, batch_size):
            batch_indices = indices[i:i + batch_size]
            batch_input_1 = [input_data_1[idx] for idx in batch_indices]
            batch_input_2 = [input_data_2[idx] for idx in batch_indices]
            batch_labels = labels[batch_indices]

            # Preprocess images
            batch_input_1 = preprocess_images_cv2(batch_input_1)
            batch_input_2 = preprocess_images_cv2(batch_input_2)

            yield [np.array(batch_input_1), np.array(batch_input_2)], batch_labels

def pair_generator2(input_data_1, input_data_2, labels, batch_size=32):
    while True:
        indices = np.random.choice(len(input_data_1), size=batch_size, replace=False)
        batch_input_data_1 = np.array([input_data_1[i] for i in indices])
        batch_input_data_2 = np.array([input_data_2[i] for i in indices])
        batch_labels = np.array(labels[indices])

        # Assuming your input data is an image, you might need to preprocess it
        batch_input_data_1 = preprocess_images_cv2(batch_input_data_1)
        batch_input_data_2 = preprocess_images_cv2(batch_input_data_2)

        yield [batch_input_data_1, batch_input_data_2], batch_labels

"""**Creating Models**
in here i try to use VGG face as Base Model for transfer learning because our data is limited (not that much)
"""

from tensorflow.keras.applications.inception_v3 import InceptionV3
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import Model

from tensorflow.keras import backend as K

def euclidean_distance(vectors):
    vector1, vector2 = vectors
    sum_square = K.sum(K.square(vector1 - vector2), axis=1, keepdims=True)
    return K.sqrt(K.maximum(sum_square, K.epsilon()))

def euclidean_distance_output_shape(shapes):
    shape1, shape2 = shapes
    return (shape1[0], 1)

def contrastive_loss(y_true, y_pred):
    y_true = K.cast(y_true, dtype=tf.float32)
    y_pred = K.cast(y_pred, dtype=tf.float32)
    margin = 1
    square_pred = K.square(y_pred)
    margin_square = K.square(K.maximum(margin - y_pred, 0))
    loss = K.mean((1 - y_true) * square_pred + y_true * margin_square)
    return loss

from tensorflow.keras.regularizers import l2

def siamese_network(input_shape=(128,128,3)):
    input_1 = Input(shape=input_shape)
    input_2 = Input(shape=input_shape)

    # base_model = InceptionV3(weights='imagenet', input_shape=input_shape, include_top=False)
    base_model = InceptionV3(weights='imagenet', input_shape=(input_shape[0], input_shape[1], 3), include_top=False)
    # add a global spatial average pooling layer
    input = Input(input_shape)
    x = base_model(input)
    x = GlobalAveragePooling2D()(x)
    # x = Flatten()(x)
    # x = tf.keras.layers.BatchNormalization()(x)
    x = Dense(10, activation='tanh', kernel_regularizer=l2(0.001))(x)
    # x1 = Dense(1, activation='tanh')(x1)
    embedding_network = Model(input, x)

    tower_1 = embedding_network(input_1)
    tower_2 = embedding_network(input_2)
    # distance_layer = DistanceLayer()([tower_1, tower_2])
    merge_layer = Lambda(euclidean_distance, output_shape=(1,))([tower_1, tower_2])
    # normal_layer = tf.keras.layers.BatchNormalization()(merge_layer)
    out = Dense(1, activation='sigmoid')(merge_layer)

    model = Model(inputs=[input_1, input_2], outputs=out)

    for layer in base_model.layers:
      layer.trainable = False
    # for layer in base_model.layers[289:]:
    #   layer.trainable = True
    
    return model

from keras.layers import GlobalAveragePooling2D
# Base convolutional model
def create_base_model(input_shape):
    input_layer = Input(shape=input_shape)
    x = Conv2D(32, (3, 3), activation='relu')(input_layer)
    x = MaxPooling2D(2,2)(x)
    x = Conv2D(64, (3,3), activation = 'relu')(x)
    x = MaxPooling2D(2,2)(x)
    x = Flatten()(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.5)(x)

    return Model(input_layer, x)

# Siamese model
def create_siamese_model(input_shape):
    input_1 = Input(shape=input_shape)
    input_2 = Input(shape=input_shape)

    base_model = create_base_model(input_shape)
    # add a global spatial average pooling layer
    x1 = base_model(input_1)
    x1 = GlobalAveragePooling2D()(x)
    # let's add a fully-connected layer
    x1 = Dense(128, activation='relu')(x)

    x2 = base_model(input_2)
    x2 = GlobalAveragePooling2D()(x)
    # let's add a fully-connected layer
    x2 = Dense(128, activation='relu')(x)

    distance = Lambda(euclidean_distance, output_shape=euclidean_distance_output_shape)([x1, x2])

    model = Model(inputs=[input_1, input_2], outputs=distance)

    return model

def create_siamese_model2(input_shape):
    input_1 = Input(shape=input_shape)
    input_2 = Input(shape=input_shape)

    # Base model (InceptionV3)
    base_model = InceptionV3(weights='imagenet', include_top=False, input_shape=input_shape)

    # Global average pooling and dense layers
    x1 = base_model(input_1)
    # x1 = Conv2D(32, (3,3), activation='relu')(x1)
    # x1 = MaxPooling2D(2,2)(x1)
    x1 = Conv2D(64, (3,3), activation='relu')(x1)
    x1 = GlobalAveragePooling2D()(x1)
    x1 = Dense(1, activation='sigmoid')(x1)

    x2 = base_model(input_2)
    # x2 = Conv2D(32, (3,3), activation='relu')(x2)
    # x2 = MaxPooling2D(2,2)(x2)
    x2 = Conv2D(64, (3,3), activation='relu')(x2)
    x2 = GlobalAveragePooling2D()(x2)
    x2 = Dense(1, activation='sigmoid')(x2)

    # Calculate Euclidean distance using Lambda layer
    distance = Lambda(euclidean_distance, output_shape=euclidean_distance_output_shape)([x1, x2])

    # Create the Siamese model
    model = Model(inputs=[input_1, input_2], outputs=distance)

    return model

# Create Siamese model
input_shape = (224, 224, 3)
siamese_model = create_siamese_model2(input_shape)

# Compile the model with contrastive loss
siamese_model.compile(optimizer=Adam(), metrics=['acc'], loss=contrastive_loss)

# Create generators
train_generator = pair_generator2(train_input_data_1, train_input_data_2, train_labels, batch_size=batch_size)
val_generator = pair_generator2(val_input_data_1, val_input_data_2, val_labels, batch_size=batch_size)

# Generate predictions for a batch
batch_size = 32  # You can adjust this based on your needs

# Get a batch from the generator
val_data_batch = next(val_generator)

# Select a batch for validation
batch_input_data_1 = val_data_batch[0][0]
batch_input_data_2 = val_data_batch[0][1]
batch_labels = val_data_batch[1]

# Convert input data to numpy arrays
batch_input_data_1 = np.array(batch_input_data_1)
batch_input_data_2 = np.array(batch_input_data_2)

# Get predictions
batch_predictions = siamese_model.predict([batch_input_data_1, batch_input_data_2])

# Assuming you are using a contrastive loss function, the predicted labels are often the similarity scores themselves
y_pred = batch_predictions

# Assuming binary labels (0 for dissimilar, 1 for similar)
y_true = batch_labels

# Shapes
print("Shape of y_true:", y_true.shape)  # Expected: (batch_size,)
print("Shape of y_pred:", y_pred.shape)  # Expected: (batch_size, 1)

# from keras.callbacks import Callback

# class PrintShapeCallback(Callback):
#     def on_batch_end(self, batch, logs=None):
#         print("Shape of y_true:", logs.get('y_true').shape)
#         print("Shape of y_pred:", logs.get('y_pred').shape)

batch_size = 32

# Create generators
train_generator = pair_generator2(train_input_data_1, train_input_data_2, train_labels, batch_size=batch_size)
val_generator = pair_generator2(val_input_data_1, val_input_data_2, val_labels, batch_size=batch_size)

# Calculate steps per epoch and validation steps
steps_per_epoch = len(train_input_data_1) // batch_size
validation_steps = len(val_input_data_1) // batch_size

# Fit the model using fit_generator
siamese_model.fit_generator(train_generator,
                            steps_per_epoch=steps_per_epoch,
                            epochs=10,
                            validation_data=val_generator,
                            validation_steps=validation_steps)

# Save the model to the local Colab environment
siamese_model.save('/content/drive/MyDrive/Faces-training/model_tl2.h5')

# Assuming siamese_model is already trained

# Example of two image paths for testing
test_image_path_1 =  negative_pairs[100][0] #"./chaeryoeong.jpg"
test_image_path_2 = negative_pairs[100][1] #"./img_3.jpg"

# Preprocess the test images
test_image_1 = read_img(test_image_path_1)
test_image_2 = read_img(test_image_path_2)

# Reshape the images to match the model input shape
test_image_1 = test_image_1.reshape((1,) + test_image_1.shape)
test_image_2 = test_image_2.reshape((1,) + test_image_2.shape)

# Make a prediction using the trained model
prediction = siamese_model.predict([test_image_1, test_image_2])

# Print the prediction
print("Similarity Score:", prediction[0][0])