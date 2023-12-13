let model;
// const webcam = new Webcam(document.getElementById('wc'));
let webcam
let isPredicting = false;
let frameCount = 0;

async function loadFaceRecognitionModel() {
  // Load your custom face recognition model
  model = await tf.loadLayersModel('./model/model.json');
  if (!model) {
    console.log('Face recognition model loading failed');
    return;
  } else {
    console.log('Face recognition model loaded');
  }
}

async function loadImage(imgElement) {
  return new Promise((resolve, reject) => {
    imgElement.onload = () => {
      resolve(imgElement);
    };
    imgElement.onerror = reject;
  });
}

// async function init() {
//   // Initialize webcam
//   webcam = new Webcam(document.getElementById('wc'));
//   await webcam.setup();

//   // Load your custom face recognition model
//   await loadFaceRecognitionModel();
// }

// Your existing code for file input and prediction button
// document.getElementById('startPredicting').onclick = async function () {
//   try {
//     const fileInput = document.getElementById('fileInput');
//     const file = fileInput.files[0];

//     if (!file) {
//       throw new Error('No file selected');
//     }

//     const img = new Image();
//     img.src = URL.createObjectURL(file);

//     // Ensure the image is loaded before further processing
//     await loadImage(img);

//     // Store the uploaded image for later use
//     img1 = img;

//     // Preprocess the image and perform face recognition using your custom model
//     const tensor1 = preprocessImage(img1);
//     const img2 = await webcam.captureImage();
//     const tensor2 = preprocessImage(img2);

//     // Make predictions using both tensors
//     const activation = model.predict([tensor1, tensor2]);
//     const predictions = activation.squeeze();

//     // Display or process predictions as needed
//     // (e.g., update UI, make decisions based on predictions)
//     displayPredictions(predictions);  

//   } catch (error) {
//     console.error('Error occurred during prediction:', error);
//   }
// };

function preprocessImage(imgElement) {
  return tf.tidy(() => {
      const tensor = tf.browser.fromPixels(imgElement)
          .resizeNearestNeighbor([128, 128])
          .expandDims()
          .toFloat().div(255);
      return tensor;
  });
}

function startPredicting(){
  if (img1) {
    isPredicting = true};
	predict();
}

function stopPredicting(){
	isPredicting = false;
  if (isPredicting == false) {
    console.log('stop Predicting')}
  frameCount = 0;
	// predict();
}

function displayPredictions(predictions) {
  const output = document.getElementById('prediction');
  output.innerHTML = '';

  // Retrieve the prediction value using dataSync()
  const predictionValue = predictions.dataSync()[0];

  // Customize this part based on your requirements
  const predictionLabel = predictionValue > 0.5 ? 'Match' : 'Not Match';

  const node = document.createElement('div');
  node.innerText = `Prediction value: ${predictionValue} --> ${predictionLabel}`;
  output.appendChild(node);
}

async function predict() {
  while (isPredicting) {
    const img2 = await webcam.captureImage();
    const tensor2 = preprocessImage(img2);

    // Make predictions using both tensors
    const activation = model.predict([tensor1, tensor2]);
    const predictions = activation.squeeze();

    // Display or process predictions as needed
    // (e.g., update UI, make decisions based on predictions)
    // displayPredictions(predictions);
    frameCount++;

    // Check if 100 frames have passed
    if (frameCount >= 1) {
      // Make predictions using both tensors
      const activation = model.predict([tensor1, tensor2]);
      const predictions = activation.squeeze();

      // Display or process predictions as needed
      // (e.g., update UI, make decisions based on predictions)
      displayPredictions(predictions);

      // Reset frame count after making predictions
      frameCount = 0;
    }

    await tf.nextFrame();
  }
}

async function init() {
  // Initialize webcam
  webcam = new Webcam(document.getElementById('wc'));
  await webcam.setup();

  // Load your custom face recognition model
  await loadFaceRecognitionModel();

  // Get the file input element
  const fileInput = document.getElementById('fileInput');

  // Add an event listener for the change event
  fileInput.addEventListener('change', async () => {
    // Check if a file is selected
    if (fileInput.files.length === 0) {
      throw new Error('No file selected');
    }

    // Get the selected file
    const file = fileInput.files[0];

    const img = new Image();
    img.src = URL.createObjectURL(file);

    // Ensure the image is loaded before further processing
    await loadImage(img);

    // Store the uploaded image for later use
    img1 = img;

    // Preprocess the image and perform face recognition using your custom model
    tensor1 = preprocessImage(img1);
    img2 = await webcam.captureImage();
    // tensor2 = webcam.capture();
    tensor2 = preprocessImage(img2)

    tf.tidy(() => model.predict([tensor1, tensor2]));
  });
}

init();

// async function init() {
//   await webcam.setup();
//   await loadFaceRecognitionModel();

//   while (isPredicting) {
//     const img1 = img;
//     const tensor1 = preprocessImage(img1);

//     const img2 = webcam.capture();
//     const tensor2 = preprocessImage(img2);

//     const activation = model.predict([tensor1, tensor2]);
//     const predictions = activation.squeeze();

//     // Display or process predictions as needed
//     // (e.g., update UI, make decisions based on predictions)

//     await tf.nextFrame();
//   }
// 	// tf.tidy(() => model.predict([tensor1, tensor21]));
		
// }
