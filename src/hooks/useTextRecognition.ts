import { useRef } from "react";
import Tesseract from "tesseract.js";
import { ttsService } from "../services/ttsService";

export const useTextRecognition = (enableTTS: boolean) => {
  const lastSpokenText = useRef("");
  const isProcessing = useRef(false);

  const processFrameForText = async (video: HTMLVideoElement) => {
    if (!enableTTS || isProcessing.current) return;
    if (!video.videoWidth || !video.videoHeight) return;

    isProcessing.current = true;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const result = await Tesseract.recognize(canvas, "eng", {
        logger: () => {}
      });

      const text = result.data.text.trim();

      if (text && text !== lastSpokenText.current) {
        lastSpokenText.current = text;
        ttsService.speak(`Text detected. ${text}`);
      }
    } catch (err) {
      console.error("Text recognition error:", err);
    } finally {
      isProcessing.current = false;
    }
  };

  return { processFrameForText };
};
