// Browser Speech Synthesis & Recognition Helpers for InterviewMate AI

export function playQuestionSpeech(
  text: string,
  lang: 'fr' | 'en' | 'ar' = 'fr',
  onEnd?: () => void
): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return () => {};
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'fr-FR';
  utterance.rate = 0.95; // Slightly slower, clear conversational pace
  utterance.pitch = 1.0;

  // Attempt to select a natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) =>
    lang === 'ar'
      ? v.lang.startsWith('ar')
      : lang === 'en'
      ? v.lang.startsWith('en')
      : v.lang.startsWith('fr')
  );
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('SpeechSynthesis error:', e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}

export function stopQuestionSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export interface SpeechRecognitionListener {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export function createSpeechRecognizer(
  lang: 'fr' | 'en' | 'ar' = 'fr',
  listener: SpeechRecognitionListener
) {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = lang === 'ar' ? 'ar-MA' : lang === 'en' ? 'en-US' : 'fr-FR';

  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    const transcript = final || interim;
    listener.onResult(transcript, Boolean(final));
  };

  recognition.onerror = (event: any) => {
    listener.onError(event.error || 'Erreur microphone');
  };

  recognition.onend = () => {
    listener.onEnd();
  };

  return recognition;
}
