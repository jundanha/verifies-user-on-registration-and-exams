<h1><a href="https://ui-lib.com/downloads/matx-react-dashboard/">Bangkit 2023 Company Capstone: How Dicoding Verifies User on Registration and Exams</a></h1>

<p>There are some individuals that exploit the Dicoding system. So far, Dicoding only does email verification and we want to ensure each and every user, including what they do is legitimate. We created a face and gesture recognition system based on webcam-captured video images that covers<br>
  &nbsp;&nbsp;&nbsp;&nbsp;1. Face verification and comparison on registration, starting exam, and project submission <br>
  &nbsp;&nbsp;&nbsp;&nbsp;2. Gesture recognition and tracking on exam.  </p>

## Team Members

| ID          | Name                    |
| ----------- | ----------------------- |
| C002BSY3390 | Jundan Haris            |
| C002BSX3335 | Faiza Kamilah Setiawan  |
| M002BSY0514 | Agung Kurniawan         |
| M002BSX1474 | Kezia Nathania Novaleni |

## Machine Learning

### Datasets:

Face Recognition : chaitanyakasaraneni/recognisingfacesinthewild: Kaggle competition by Northeastern SMILE Lab - Recognizing Faces in the Wild (github.com)
Gesture Recognition : Synthetic Gaze and Face Segmentation (kaggle.com)

### References:

https://medium.com/@rinkinag24/a-comprehensive-guide-to-siamese-neural-networks-3358658c0513

Rane, M. et al. (2023). Real-Time Automated Face Recognition System for Online Exam Examinee Verification. In: Laouar, M.R., Balas, V.E., Lejdel, B., Eom, S., Boudia, M.A. (eds) 12th International Conference on Information Systems and Advanced Technologies “ICISAT 2022”. ICISAT 2022. Lecture Notes in Networks and Systems, vol 624. Springer, Cham. https://doi.org/10.1007/978-3-031-25344-7_34

Singh, A. and Das, S. (2022) ‘A cheating detection system in online examinations based on the analysis of eye-gaze and head-pose’, Proceedings of The International Conference on Emerging Trends in Artificial Intelligence and Smart Systems, THEETAS 2022, 16-17 April 2022, Jabalpur, India [Preprint]. doi:10.4108/eai.16-4-2022.2318165.

## Tech Stack Used

### Machine Learning

for machine learning task we are using:

- <b>TensorFlow</b>
- <b>OpenCV</b>
- <b>MTCNN</b> for face detections
- <b>keras</b>

credit to : https://github.com/yinguobing/head-pose-estimation

- <b>Head_pose_estimation</b> models

### Frontend

For the frontend part, our tech stack includes:

- <b>Vite</b>
- <b>React</b>
- <b>React router</b>
- <b>Chakra UI </b>
- <b>Formik</b>
- <b>React webcam</b>
- <b>html2pdf</b>

### Backend

The backend of our system is implemented using <b>Flask</b>, <b>Firebase</b> for authentication and storage, and <b>Google Cloud Storage</b> for file uploads.

## Deployment

Both frontend and backend, we use <b>Google Cloud App Engine</b> for deployment.

## Getting Started

To set up and run the project locally, clone the repository first using command<br>
`git clone https://github.com/jundanha/verifies-user-on-registration-and-exams.git`<br>

### Run the frontend

1. Navigate to frontend directory: `cd client`
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`

### Run the backend

1. Ensure you have python installed.
2. Navigate to backend directory: `cd backend`
3. Install required packages: `pip install install -r requirements.txt`
4. Run the Flask server: `python App.py`

Remember, to run the backend, you need credentials.json

<h3>Thank You.</h3>
<p>With Love, C23-VU01 Team</p>
