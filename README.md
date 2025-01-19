# Focusaurus
Devpost: [https://devpost.com/software/focusaurus](https://devpost.com/software/focusaurus)\
Youtube: [https://www.youtube.com/watch?v=HmPRmUPjOsA](https://www.youtube.com/watch?v=HmPRmUPjOsA)

Meet Focusaurus! This friendly pocket-sized AI dinosaur isn’t just here to entertain—it’s here to care for your well-being and help you stay on track!
## Inspiration
Focusaurus was born from the idea of blending productivity and wellness into an interactive, lighthearted digital companion. In today’s digital world, it’s easy to lose track of time, compromise posture, or overlook mental well-being while working or browsing. We wanted to create a solution that isn’t just a reminder tool but a fun, engaging presence that supports healthier habits. Inspired by the challenges of balancing focus and self-care in a fast-paced, tech-driven environment, Focusaurus bridges the gap between digital productivity and personal wellness, all with a friendly, dino-sized twist.

## What it does
Focusaurus is a Chrome extension designed to keep you healthy, productive, and mindful as you navigate your online life.

Here’s how it works:
1. Health Monitoring
Focusaurus connects to wearable health devices like the Colmi Ring to track vital signs such as heart rate and stress levels. If your heart rate is elevated for extended periods, Focusaurus pops up with a suggestion to take a breather or engage in relaxing activities.

2. Posture and Eye Tracking
Using Mediapipe and OpenCV, the extension monitors your posture and detects whether your eyes are open or closed. If it notices you slouching or struggling to keep your eyes open, Focusaurus gently reminds you to sit up straight or take a short break to rest.

3. Browsing Habits Analysis
Focusaurus analyzes your browsing patterns and detects prolonged sessions on platforms like YouTube, social media, or other distractions. When you’ve spent hours on non-productive activities, Focusaurus encourages you to take a break or redirect your focus to something more meaningful.

4. Interactive Dino Assistant
The star of the extension, the Focusaurus dinosaur, interacts with you through speech bubbles filled with personalized messages. It uses the OpenAI API to generate these messages, tailored to your current habits, health data, and digital activities. The dino can remind you to stretch, drink water, or even share lighthearted jokes to brighten your day.

5. User Interaction and Fun
Focusaurus isn’t just a passive assistant—it’s interactive and fun! You can drag the dinosaur around your screen, but don’t be surprised when it demands to be put back down with cheeky comments. Its personality makes healthy habit-building more enjoyable and less of a chore.

6. Real-Time Feedback
Using WebSockets, Focusaurus provides real-time updates based on the data it gathers. Whether you’re working, gaming, or binge-watching, Focusaurus is always there, offering timely suggestions to keep you on track.

## How we built it
Focusaurus combines several powerful technologies to provide an interactive digital wellness experience. The extension uses OpenCV and Mediapipe for real-time posture and eye tracking, leveraging computer vision to detect body movements and eye closures. Colmi Ring API provides health data, such as heart rate, to offer personalized suggestions based on your physical state. The OpenAI API processes this data and generates thoughtful, context-aware messages. FastAPI handles the backend, enabling fast communication between the frontend and various APIs via WebSockets for real-time updates. The frontend, built with React and Chrome, offers a smooth, user-friendly experience, while dinosaur sprite sheets by @ScissorMarks add a fun, interactive element to the app. This combination of technologies ensures Focusaurus can provide continuous support for healthier digital habits.

## Challenges we ran into
- Integrating real-time data from multiple sources like Mediapipe, Colmi Ring, and OpenAI while ensuring smooth communication through WebSockets.  
- Synchronizing and rendering speech bubbles dynamically with the Focusaurus sprite while maintaining responsiveness in the extension UI.  
- Finding thresholds for real-time posture detection and eye closure tracking.
- OpenCV doesn't work in threads on mac
- Bleak doesn't work in threads on windows

## Accomplishments that we're proud of
- Successfully building a fully functional Chrome extension that combines real-time data analysis, engaging UI, and AI-powered wellness advice.  
- Creating a fun, interactive experience with the draggable Focusaurus sprite.  
- Seamlessly integrating multiple APIs and frameworks into a cohesive, user-friendly product.  

## What we learned
- The power of threading and WebSockets for managing real-time data flows in interactive applications.  
- Advanced use of Mediapipe and OpenCV for face and posture detection.  
- How small design details (like Focusaurus’s interactivity and speech bubbles) significantly impact user experience.  

## What's next for Focusaurus
- Adding more personalized feedback by integrating additional health metrics (e.g., hydration reminders or step tracking).  
- Expanding Focusaurus’s personality with more animations and conversational capabilities using fine-tuned AI models.  
- Developing a mobile version to bring Focusaurus into users’ lives beyond the desktop environment.  
