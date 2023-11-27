let model;
let webcam;
let isPredicting = false;
let tensor1;

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
  
  async function init() {
    // Initialize webcam
    webcam = new Webcam(document.getElementById('wc'));
    await webcam.setup();
  
    // Load your custom face recognition model
    await loadFaceRecognitionModel();
  }
  async function loadImage(imgElement) {
    return new Promise((resolve, reject) => {
      imgElement.onload = () => {
        resolve(imgElement);
      };
      imgElement.onerror = reject;
    });
  }
async function predict() {
  while (isPredicting) {
    const img2 = webcam.captureImage();
    const tensor2 = preprocessImage(img2);

    // Make predictions using both tensors
    const activation = model.predict([tensor1, tensor2]);
    const predictions = activation.squeeze();

    // Display or process predictions as needed
    // (e.g., update UI, make decisions based on predictions)
    displayPredictions(predictions);

    await tf.nextFrame();
  }
}

function preprocessImage(imgElement) {
    return tf.tidy(() => {
        const tensor = tf.browser.fromPixels(imgElement)
            .resizeNearestNeighbor([128, 128])
            .expandDims()
            .toFloat().div(255);
        return tensor;
    });
  }

// Modify the startPredicting function
async function startPredicting() {
  isPredicting = true;

  // Load the initial image
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    throw new Error('No file selected');
  }

  const img = new Image();
  img.src = URL.createObjectURL(file);

  // Ensure the image is loaded before further processing
  await loadImage(img);

  // Store the initial image for later use
  img1 = img;

  // Preprocess the image and perform face recognition using your custom model
  const tensor1 = preprocessImage(img1);

  // Start real-time predictions
  predict();
}

// Modify the stopPredicting function
function stopPredicting() {
  isPredicting = false;
}

// Add an event listener for the stop button
document.getElementById('stopPredicting').onclick = stopPredicting;

// Initialize the application
init();