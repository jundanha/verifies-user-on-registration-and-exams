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

## Tech Stack Used
### Frontend
For the frontend part, our tech stack includes:
- <b>Vite</b> 
- <b>React</b> 
- <b>React router</b> 
- <b>Chakra UI </b> 
- <b>Formik</b> 
- <b>React webcam</b> 

### Backend
The backend of our system is implemented using <b>Flask</b>, <b>Firebase</b> for authentication and storage, and <b>Google Cloud Storage</b> for file uploads.


## Deployment
Both frontend and backend, we use <b>Google Cloud App Engine</b> for deployment.

## Getting Started
To set up and run the project locally, clone the repository first using command<br>
```git clone https://github.com/jundanha/verifies-user-on-registration-and-exams.git```<br>

### Run the frontend
1. Navigate to frontend directory: `cd client`
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`

### Run the backend
1. Ensure you have python installed.
2. Navigate to backend directory: `cd backend`
3. Install required packages: `pip install Flask Flask-CORS google-cloud-storage firebase-admin`
4. Run the Flask server: `python App.py`

Remember, to run the backend, you need credentials.json

<h3>Thank You.</h3>
<p>With Love, C23-VU01 Team</p>