#  Project Sentinel  
**AI-Powered Assistive Vision System (Progressive Web App)**

Project Sentinel is an **AI-driven assistive vision platform** designed to help **visually impaired users**, with additional support for **hearing-impaired users and safe mobility**.  
It runs entirely in the **web browser** using **on-device AI**, requiring **no special hardware** and prioritizing **privacy, accessibility, and real-time feedback**.

---

## Problem Statement

Visually impaired individuals face daily challenges such as:
- Detecting nearby obstacles
- Identifying dangerous objects (vehicles, stairs)
- Understanding direction (left / center / right)
- Reading signs and printed text in real time

Most existing solutions are:
- Expensive
- Hardware-dependent
- Cloud-heavy (privacy concerns)
- Difficult to scale

---

## Solution Overview

Project Sentinel provides:
- **Real-time object detection**
- **Collision risk analysis**
- **Directional danger alerts**
- **Voice and haptic feedback**
- **Text recognition (OCR)**
- **Laptop + mobile + IP camera support**
- **Privacy-first, on-device AI**

All features run **directly inside the browser** as a **Progressive Web App (PWA)**.

---

## Key Features

### Real-Time Object Detection
- Detects people, vehicles, furniture, stairs, doors, etc.
- Built with **TensorFlow.js + COCO-SSD**
- Runs completely on-device (no video sent to servers)

### Collision Detection & Directional Alerts
- Divides camera view into **Left / Center / Right**
- Distance-based danger classification:
  - **Danger** ≤ 2 meters
  - **Caution** ≤ 4 meters
- Always prioritizes the most dangerous zone

### Voice Assistance
- Text-to-Speech alerts
- Direction-aware warnings (e.g., “Obstacle on your right”)
- Hands-free interaction for accessibility

### Haptic Feedback
- Vibration patterns based on danger severity
- Useful for hearing-impaired users

### Text Recognition (OCR)
- Reads signs and printed text aloud
- Uses **Tesseract.js**
- Optimized interval-based processing to reduce load

### Multiple Camera Sources
- Laptop / mobile camera (MediaDevices API)
- Android phone as **IP Webcam**
- Canvas-based processing for IP camera streams

### Progressive Web App (PWA)
- Installable on Android devices
- Offline support for core features
- Lightweight, fast, and responsive

---

## Technologies Used

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS

### AI / ML (Google Technologies)
- TensorFlow.js
- COCO-SSD (Google Model Zoo)

### Accessibility & Interaction
- Web Speech API (Speech Recognition & TTS)
- Vibration API
- Canvas API

### OCR
- Tesseract.js

### Platform
- Progressive Web App (PWA)
- Google Chrome / Chromium browsers

---

## Installation & Setup

### Clone the Repository
```bash
git clone https://github.com/your-username/project-sentinel.git
cd project-sentinel
```
### Install Dependencies
```bash
npm install
```
### Start Development Server
```bash
npm run dev
```
App runs on:
```bash
http://localhost:5173
```

---

##  Using IP Webcam (Android)

- Install **IP Webcam** app on Android  
- Start the server in the app  
- Copy the shown URL (example):

- Select **IP Camera** inside Project Sentinel  
- Paste the URL and connect  

---

## Testing Checklist

- Camera permission granted  
- Object detection visible  
- Collision alerts trigger correctly  
- Voice feedback works  
- OCR reads visible text  
- PWA install prompt appears  
- Works on mobile browser  

---

## Privacy & Security

- All processing is on-device  
- No video or audio data is stored or transmitted  
- No third-party tracking  
- Secure browser permission handling  

---

## Social Impact

- Assistive technology for accessibility  
- Inclusive design for disabled users  
- Aligns with **UN SDG 10 – Reduced Inequalities**  

---

## Future Enhancements

- Depth estimation using stereo vision  
- Indoor navigation assistance  
- Multilingual voice support  
- Wearable device integration  
- Advanced scene understanding  

---

## License

This project is intended for **educational, research, and hackathon purposes**.
