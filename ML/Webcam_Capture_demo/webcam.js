// Copyright 2019 The TensorFlow Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// =============================================================================

/**
 * A class that wraps webcam video elements to capture Tensor4Ds.
 */


class Webcam {
  /**
   * @param {HTMLVideoElement} webcamElement A HTMLVideoElement representing the
   *     webcam feed.
   */
  constructor(webcamElement) {
    this.webcamElement = webcamElement;
  }

  /**
   * Captures a frame from the webcam and normalizes it between -1 and 1.
   * Returns a batched image (1-element batch) of shape [1, w, h, c].
   */

  async captureImage() {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = this.webcamElement.width;
      canvas.height = this.webcamElement.height;
  
      const context = canvas.getContext('2d');
      context.drawImage(this.webcamElement, 0, 0, canvas.width, canvas.height);
  
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    });
  }

  capture() {
    return tf.tidy(() => {
      // Reads the image as a Tensor from the webcam <video> element.
      const webcamImage = tf.browser.fromPixels(this.webcamElement);

      const reversedImage = webcamImage.reverse(1);

      // Crop the image so we're using the center square of the rectangular
      // webcam.
      const croppedImage = this.cropImage(reversedImage);

      // Expand the outer most dimension so we have a batch size of 1.
      const batchedImage = croppedImage.expandDims(0);
      const normalizeImage = batchedImage.toFloat().div(255)
      // Normalize the image between 0 and 1
      const resizedImage = tf.image.resizeNearestNeighbor(batchedImage, [128, 128]);

      return resizedImage;
    });
  }

  startCapture() {
    this.captureInterval = setInterval(() => {
      const capturedFrame = this.capture();
      // You can now use the capturedFrame for real-time predictions
      // For example, pass it to your prediction function
      // predict(capturedFrame);
    }, 100); // Adjust the interval (in milliseconds) based on your needs
  }
  
  // Add a new method to stop capturing frames
  stopCapture() {
    clearInterval(this.captureInterval);
  }

  /**
   * Crops an image tensor so we get a square image with no white space.
   * @param {Tensor4D} img An input image Tensor to crop.
   */


  cropImage(img) {
    const size = Math.min(img.shape[0], img.shape[1]);
    const centerHeight = img.shape[0] / 2;
    const beginHeight = centerHeight - (size / 2);
    const centerWidth = img.shape[1] / 2;
    const beginWidth = centerWidth - (size / 2);
    return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);
  }

  /**
   * Adjusts the video size so we can make a centered square crop without
   * including whitespace.
   * @param {number} width The real width of the video element.
   * @param {number} height The real height of the video element.
   */


  adjustVideoSize(width, height) {
    const aspectRatio = width / height;
    if (width >= height) {
      this.webcamElement.width = aspectRatio * this.webcamElement.height;
    } else if (width < height) {
      this.webcamElement.height = this.webcamElement.width / aspectRatio;
    }
  }

  // async setup2(startPredictingInterval = 100) {
  //   return new Promise((resolve, reject) => {
  //     navigator.getUserMedia = navigator.getUserMedia ||
  //         navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
  //         navigator.msGetUserMedia;
  //     if (navigator.getUserMedia) {
  //       navigator.getUserMedia(
  //           {video: {width: 224, height: 224}},
  //           stream => {
  //             this.webcamElement.srcObject = stream;
  //             this.webcamElement.addEventListener('loadeddata', async () => {
  //               this.adjustVideoSize(
  //                   this.webcamElement.videoWidth,
  //                   this.webcamElement.videoHeight);

  //               // Start predicting every 100 frames
  //               this.startPredicting(startPredictingInterval);

  //               resolve();
  //             }, false);
  //           },
  //           error => {
  //             reject(error);
  //           });
  //     } else {
  //       reject();
  //     }
  //   });
  // }

  async setup() {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia = navigator.getUserMedia ||
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
          navigator.msGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia(
            {video: {width: 224, height: 224}},
            stream => {
              this.webcamElement.srcObject = stream;
              this.webcamElement.addEventListener('loadeddata', async () => {
                this.adjustVideoSize(
                    this.webcamElement.videoWidth,
                    this.webcamElement.videoHeight);
                resolve();
              }, false);
            },
            error => {
              reject(error);
            });
      } else {
        reject();
      }
    });
  }
}
