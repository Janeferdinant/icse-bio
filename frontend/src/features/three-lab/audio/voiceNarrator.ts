export interface VoiceNarratorState {
  isSpeaking: boolean;
  isPaused: boolean;
  currentText: string;
  isSupported: boolean;
  currentCharIndex: number;
}

export class VoiceNarrator {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }
  private stateListeners: Set<(state: VoiceNarratorState) => void> = new Set();
  private pitch: number = 1.15; // Upbeat, friendly teacher voice
  private rate: number = 0.95;  // Clear, child-accessible pace
  private currentState: VoiceNarratorState = {
    isSpeaking: false,
    isPaused: false,
    currentText: '',
    isSupported: false,
    currentCharIndex: 0
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.currentState.isSupported = true;
    }
  }

  public isSupported(): boolean {
    return this.currentState.isSupported;
  }

  public getState(): VoiceNarratorState {
    return { ...this.currentState };
  }

  public subscribe(listener: (state: VoiceNarratorState) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.getState());
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  private updateState(partial: Partial<VoiceNarratorState>) {
    this.currentState = { ...this.currentState, ...partial };
    this.stateListeners.forEach((listener) => listener(this.getState()));
  }

  public speak(
    text: string, 
    onEnd?: () => void,
    onBoundary?: (charIndex: number) => void
  ) {
    if (!this.synth) {
      // In environments without speech synthesis, simulate visual captioning
      this.updateState({ isSpeaking: true, isPaused: false, currentText: text, currentCharIndex: 0 });
      setTimeout(() => {
        this.updateState({ isSpeaking: false, isPaused: false, currentText: '', currentCharIndex: 0 });
        onEnd?.();
      }, 4000);
      return;
    }

    // Cancel any previous speech
    this.stop();

    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = this.pitch;
    utterance.rate = this.rate;

    // Pick best English voice if available
    const voices = this.synth.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira'))
    ) || voices.find((v) => v.lang.startsWith('en'));
    
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      this.updateState({
        isSpeaking: true,
        isPaused: false,
        currentText: cleanText,
        currentCharIndex: 0
      });
    };

    utterance.onboundary = (e) => {
      this.updateState({ currentCharIndex: e.charIndex });
      onBoundary?.(e.charIndex);
    };

    utterance.onend = () => {
      this.updateState({
        isSpeaking: false,
        isPaused: false,
        currentText: '',
        currentCharIndex: 0
      });
      this.currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      // Ignore interruption cancellations
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('Speech synthesis error:', e.error);
      }
      this.updateState({
        isSpeaking: false,
        isPaused: false,
        currentText: '',
        currentCharIndex: 0
      });
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this.updateState({ isPaused: true });
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.updateState({ isPaused: false });
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
    this.updateState({
      isSpeaking: false,
      isPaused: false,
      currentText: '',
      currentCharIndex: 0
    });
  }

  public setRate(rate: number) {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
  }

  public setPitch(pitch: number) {
    this.pitch = Math.max(0.5, Math.min(2.0, pitch));
  }
}

// Global singleton instance for ThreeLab
export const globalVoiceNarrator = new VoiceNarrator();
