from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import storage
import firebase_admin
from firebase_admin import credentials, firestore
import os
import uuid

app = Flask(__name__)
CORS(app)

credential_path = os.path.abspath("credentials.json")

cred = credentials.Certificate(credential_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

storage_client = storage.Client.from_service_account_json(credential_path)

def upload_to_gcs(file, file_name, type, isPublic):
    bucket_name = "c23-capstone-project-bucket"
    bucket = storage_client.bucket(bucket_name)
    if type == "photos":
        blob = bucket.blob("photos/" + file_name)
    elif type == "videos":
        blob = bucket.blob("videos/" + file_name)
    else:
        blob = bucket.blob(file_name)
    blob.upload_from_string(file.read(), content_type=file.content_type)
    if isPublic:
        blob.make_public()
    return blob.public_url

@app.route('/create_exam', methods=['POST'])
def create_exam():
    try:
        if 'photo' not in request.files:
            return jsonify({'error': 'No photo provided'}), 400

        photo = request.files['photo']
        
        photo_filename = str(uuid.uuid4()) + os.path.splitext(photo.filename)[-1]
        photo_url = upload_to_gcs(photo, photo_filename, "photos", True)

        new_exam = {
            'token': str(uuid.uuid4()),
            'isTaken': False,
            'faceRegistered': photo_url,
            'faceAtExam': '',
            'faceResult': '',
            'isMatch': None,
            'activity': []
        }

        exam_ref = db.collection('Exams').add(new_exam)
        exam_id = exam_ref[1].id

        return jsonify({'examID': exam_id, 'token': new_exam['token']}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/start_exam', methods=['POST'])
def start_exam():
    try:
        token = request.json['token']

        exam_ref = db.collection('Exams').where('token', '==', token)
        exam_docs = exam_ref.get()

        if len(exam_docs) == 0:
            return jsonify({'error': 'Invalid Token. Exam not found'}), 404

        exam_doc = exam_docs[0]

        exam_data = exam_doc.to_dict()
        if exam_data['isTaken']:
            return jsonify({'error': 'Exam already taken'}), 400

        if exam_data['token'] != token:
            return jsonify({'error': 'Invalid token'}), 401

        exam_doc.reference.update({'isTaken': True})

        return jsonify({'message': 'Exam started', 'examID': exam_doc.id}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/submit_face', methods=['POST'])
def submit_face():
    try:
        exam_id = request.form['examID']

        exam_ref = db.collection('Exams').document(exam_id)
        exam_doc = exam_ref.get()

        if not exam_doc.exists:
            return jsonify({'error': 'Exam not found'}), 404

        exam_data = exam_doc.to_dict()
        if not exam_data['isTaken']:
            return jsonify({'error': 'Exam is not started yet'}), 400

        photo = request.files['photo']

        photo_filename = str(uuid.uuid4()) + os.path.splitext(photo.filename)[-1]
        photo_url = upload_to_gcs(photo, photo_filename, "photos", True)

        exam_ref.update({'faceAtExam': photo_url})

        # TODO: Call face recognition API

        # TODO: update exam_ref with faceResult, isMatch

        return jsonify({'message': 'Face image submitted'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/list_exams', methods=['GET'])
def list_exams():
    try:
        exams_ref = db.collection('Exams')
        exams_docs = exams_ref.get()

        exams = []
        for exam_doc in exams_docs:
            exam_data = exam_doc.to_dict()
            exam = {
                'examID': exam_doc.id,
                'isTaken': exam_data['isTaken']
            }
            exams.append(exam)

        return jsonify({'exams': exams}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_exam', methods=['GET'])
def get_exam():
    try:
        exam_id = request.args.get('examID')

        exam_ref = db.collection('Exams').document(exam_id)
        exam_doc = exam_ref.get()

        if not exam_doc.exists:
            return jsonify({'error': 'Exam not found'}), 404

        return jsonify({'exam': exam_doc.to_dict()}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# TODO: Define the API to add activity into an exam


if __name__ == '__main__':
    app.run(debug=True)
