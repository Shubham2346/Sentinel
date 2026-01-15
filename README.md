# Sentinel

AI-powered assistive vision PWA for people with disabilities.

## Features

- 🎥 Real-time object detection using TensorFlow.js
- 🗣️ Text-to-speech feedback
- 📳 Haptic vibration alerts
- 🎤 Voice commands with OpenAI integration
- ♿ Accessibility-first design
- 📱 Progressive Web App (installable)

## Tech Stack

- React + TypeScript
- TensorFlow.js (COCO-SSD)
- OpenAI GPT-4 Vision API
- Tailwind CSS
- Vite + PWA Plugin

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/project-sentinel.git
cd project-sentinel

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## Usage

1. Grant camera permissions
2. Point camera at objects
3. Receive real-time alerts via speech and haptics
4. Press microphone button for voice commands
5. Ask questions like "What do you see?"

## License

MIT

## Contributing

Contributions welcome! Please read CONTRIBUTING.md first.
