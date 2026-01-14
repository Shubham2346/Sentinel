class TTSService {
  private synth: SpeechSynthesis;
  private queue: string[] = [];
  private isSpeaking: boolean = false;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  speak(text: string, priority: 'critical' | 'high' | 'medium' | 'low' = 'medium') {
    if (priority === 'critical') {
      this.synth.cancel();
      this.queue = [];
      this.speakNow(text);
    } else {
      this.queue.push(text);
      this.processQueue();
    }
  }

  private speakNow(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1;
    
    utterance.onend = () => {
      this.isSpeaking = false;
      this.processQueue();
    };

    this.isSpeaking = true;
    this.synth.speak(utterance);
  }

  private processQueue() {
    if (!this.isSpeaking && this.queue.length > 0) {
      const text = this.queue.shift()!;
      this.speakNow(text);
    }
  }

  stop() {
    this.synth.cancel();
    this.queue = [];
    this.isSpeaking = false;
  }
}

export const ttsService = new TTSService();