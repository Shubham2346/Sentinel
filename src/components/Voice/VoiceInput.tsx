import React, { useState } from 'react';
import { useVoice } from '../../hooks/useVoice';
import { analyzeScene, answerQuestion } from '../../services/googleaiService';
import { ttsService } from '../../services/ttsService';

interface VoiceInputProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ videoRef }) => {
  const { isListening, transcript, startListening } = useVoice();
  const [isProcessing, setIsProcessing] = useState(false);

  const captureFrame = (): string => {
    if (!videoRef.current) return '';
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const handleVoiceCommand = async () => {
    startListening();
  };

  React.useEffect(() => {
    if (transcript && !isProcessing) {
      processCommand(transcript);
    }
  }, [transcript]);

  const processCommand = async (command: string) => {
    setIsProcessing(true);
    const imageData = captureFrame();

    let response: string;
    if (command.toLowerCase().includes('what') || command.toLowerCase().includes('describe')) {
      response = await analyzeScene(imageData);
    } else {
      response = await answerQuestion(imageData, command);
    }

    ttsService.speak(response, 'high');
    setIsProcessing(false);
  };

  return (
    <button
      onClick={handleVoiceCommand}
      disabled={isListening || isProcessing}
      className="absolute top-8 right-8 p-4 bg-purple-600 text-white rounded-full shadow-lg disabled:opacity-50"
      aria-label="Voice command"
    >
      {isListening ? '🎤 Listening...' : isProcessing ? '⏳ Processing...' : '🎤'}
    </button>
  );
};