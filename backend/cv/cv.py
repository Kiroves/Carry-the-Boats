import cv2
import mediapipe as mp
import numpy as np
import time

# Mediapipe setup
mp_pose = mp.solutions.pose
mp_face_mesh = mp.solutions.face_mesh
pose = mp_pose.Pose()
face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True)

# Variables to track states
previous_left_right_state = None
previous_eye_state = None
max_eye_dist = float('-inf')
min_eye_dist = float('inf')
eye_closed_start_time = None
left_right_start_time = None
eye_closed_printed = False
left_right_printed = False

# Function to detect if eyes are closed
def are_eyes_closed(landmarks, threshold=0.010):
    global max_eye_dist, min_eye_dist
    left_eye = [landmarks[159], landmarks[145]]  # Top and bottom points of left eye
    right_eye = [landmarks[386], landmarks[374]]  # Top and bottom points of right eye

    left_eye_dist = np.linalg.norm(np.array([left_eye[0].x, left_eye[0].y]) - \
                                   np.array([left_eye[1].x, left_eye[1].y]))
    right_eye_dist = np.linalg.norm(np.array([right_eye[0].x, right_eye[0].y]) - \
                                    np.array([right_eye[1].x, right_eye[1].y]))

    avg_eye_dist = (left_eye_dist + right_eye_dist) / 2
    max_eye_dist = max(max_eye_dist, avg_eye_dist)
    min_eye_dist = min(min_eye_dist, avg_eye_dist)
    return avg_eye_dist < threshold

# Function to detect left/right movement
def is_moving_left_right(landmarks, left_right_threshold=0.05):
    nose = landmarks[mp_pose.PoseLandmark.NOSE.value].x
    return abs(nose - 0.5) > left_right_threshold

# OpenCV video capture
cap = cv2.VideoCapture(0)

# Create window
cv2.namedWindow('Posture and Eye Tracking')

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Set left/right threshold value
    left_right_threshold = 0.05

    # Process frame
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    pose_results = pose.process(frame_rgb)
    face_results = face_mesh.process(frame_rgb)

    # Draw landmarks and analyze posture
    if pose_results.pose_landmarks:
        mp.solutions.drawing_utils.draw_landmarks(
            frame, pose_results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        moving_left_right = is_moving_left_right(pose_results.pose_landmarks.landmark, left_right_threshold)
        if moving_left_right != previous_left_right_state:
            if moving_left_right:
                left_right_start_time = time.time()
            else:
                left_right_start_time = None
                left_right_printed = False
            previous_left_right_state = moving_left_right

        if moving_left_right and left_right_start_time and (time.time() - left_right_start_time > 2):
            if not left_right_printed:
                print("Uncentered")
                left_right_printed = True
        elif not moving_left_right:
            left_right_start_time = time.time()
            left_right_printed = False

    # Analyze eye closure
    if face_results.multi_face_landmarks:
        for face_landmarks in face_results.multi_face_landmarks:
            eye_landmarks = [159, 145, 386, 374]  # Only draw eye landmarks
            for idx in eye_landmarks:
                landmark = face_landmarks.landmark[idx]
                x, y = int(landmark.x * frame.shape[1]), int(landmark.y * frame.shape[0])
                cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)

            eyes_closed = are_eyes_closed(face_landmarks.landmark)
            if eyes_closed != previous_eye_state:
                if eyes_closed:
                    eye_closed_start_time = time.time()
                else:
                    eye_closed_start_time = None
                    eye_closed_printed = False
                previous_eye_state = eyes_closed

            if eyes_closed and eye_closed_start_time and (time.time() - eye_closed_start_time > 2):
                if not eye_closed_printed:
                    print("Eyes Closed")
                    eye_closed_printed = True
            elif not eyes_closed:
                eye_closed_start_time = time.time()
                eye_closed_printed = False

    # Show frame
    cv2.imshow('Posture and Eye Tracking', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
