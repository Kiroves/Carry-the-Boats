import cv2
import mediapipe as mp
import numpy as np
import threading
import time
from queue import Queue

class PostureEyeTracker:
    def __init__(self):
        # Mediapipe setup
        self.mp_pose = mp.solutions.pose
        self.mp_face_mesh = mp.solutions.face_mesh
        self.pose = self.mp_pose.Pose()
        self.face_mesh = self.mp_face_mesh.FaceMesh(refine_landmarks=True)

        # State tracking variables
        self.previous_left_right_state = None
        self.previous_eye_state = None
        self.eye_closed_start_time = None
        self.left_right_start_time = None
        self.eye_closed_printed = False
        self.left_right_printed = False
        self.no_landmark_start_time = None
        self.no_landmark_printed = False
        self.last_clear_time = time.time()

        # Thread control
        self.running = False
        self.status_queue = Queue()
        self.log = []

    def are_eyes_closed(self, landmarks, threshold=0.013):
        max_eye_dist = float('-inf')
        min_eye_dist = float('inf')
        left_eye = [landmarks[159], landmarks[145]]
        right_eye = [landmarks[386], landmarks[374]]

        left_eye_dist = np.linalg.norm(np.array([left_eye[0].x, left_eye[0].y]) - 
                                     np.array([left_eye[1].x, left_eye[1].y]))
        right_eye_dist = np.linalg.norm(np.array([right_eye[0].x, right_eye[0].y]) - 
                                      np.array([right_eye[1].x, right_eye[1].y]))

        avg_eye_dist = (left_eye_dist + right_eye_dist) / 2
        return avg_eye_dist < threshold

    def is_moving_left_right(self, landmarks, left_right_threshold=0.15):
        nose = landmarks[self.mp_pose.PoseLandmark.NOSE.value].x
        return abs(nose - 0.5) > left_right_threshold

    def track(self):
        cap = cv2.VideoCapture(0)
        cv2.namedWindow('Posture and Eye Tracking')

        while self.running:
            ret, frame = cap.read()
            if not ret:
                break

            left_right_threshold = 0.10
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pose_results = self.pose.process(frame_rgb)
            face_results = self.face_mesh.process(frame_rgb)

            # Check for no landmarks
            if not pose_results.pose_landmarks and not face_results.multi_face_landmarks:
                if self.no_landmark_start_time is None:
                    self.no_landmark_start_time = time.time()
                elif (time.time() - self.no_landmark_start_time > 7) and not self.no_landmark_printed:
                    self.status_queue.put("No landmark")
                    print("No landmark")
                    self.no_landmark_printed = True
            else:
                self.no_landmark_start_time = None
                self.no_landmark_printed = False

            # Process pose landmarks
            if pose_results.pose_landmarks:
                mp.solutions.drawing_utils.draw_landmarks(
                    frame, pose_results.pose_landmarks, self.mp_pose.POSE_CONNECTIONS)

                moving_left_right = self.is_moving_left_right(
                    pose_results.pose_landmarks.landmark, left_right_threshold)
                
                if moving_left_right != self.previous_left_right_state:
                    if moving_left_right:
                        self.left_right_start_time = time.time()
                    else:
                        self.left_right_start_time = None
                        self.left_right_printed = False
                    self.previous_left_right_state = moving_left_right

                if moving_left_right and self.left_right_start_time and (time.time() - self.left_right_start_time > 2):
                    if not self.left_right_printed:
                        self.status_queue.put("Uncentered")
                        print("Uncentered")
                        self.left_right_printed = True
                elif not moving_left_right:
                    self.left_right_start_time = time.time()
                    self.left_right_printed = False

            # Process face landmarks
            if face_results.multi_face_landmarks:
                for face_landmarks in face_results.multi_face_landmarks:
                    eye_landmarks = [159, 145, 386, 374]
                    for idx in eye_landmarks:
                        landmark = face_landmarks.landmark[idx]
                        x, y = int(landmark.x * frame.shape[1]), int(landmark.y * frame.shape[0])
                        cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)

                    eyes_closed = self.are_eyes_closed(face_landmarks.landmark)
                    if eyes_closed != self.previous_eye_state:
                        if eyes_closed:
                            self.eye_closed_start_time = time.time()
                        else:
                            self.eye_closed_start_time = None
                            self.eye_closed_printed = False
                        self.previous_eye_state = eyes_closed

                    if eyes_closed and self.eye_closed_start_time and (time.time() - self.eye_closed_start_time > 2):
                        if not self.eye_closed_printed:
                            self.status_queue.put("Eyes Closed")
                            print("Eyes Closed")
                            self.eye_closed_printed = True
                    elif not eyes_closed:
                        self.eye_closed_start_time = time.time()
                        self.eye_closed_printed = False

            # Clear log every 5 seconds
            if time.time() - self.last_clear_time > 5:
                self.log.clear()
                self.last_clear_time = time.time()

            cv2.imshow('Posture and Eye Tracking', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

    def start(self):
        """Start the tracking thread"""
        self.running = True
        self.thread = threading.Thread(target=self.track)
        self.thread.start()

    def stop(self):
        """Stop the tracking thread"""
        self.running = False
        if hasattr(self, 'thread'):
            self.thread.join()

    def get_status(self):
        """Get the latest status from the queue"""
        if not self.status_queue.empty():
            status = self.status_queue.get()
            self.log.append(status)
            return status
        return None

def posture_and_eye_tracking(log):
    """Wrapper function to maintain compatibility with existing code"""
    tracker = PostureEyeTracker()
    tracker.log = log  # Share the log list with the caller
    tracker.start()
    return tracker