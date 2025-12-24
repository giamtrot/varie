/**
 * Simple Speech Synthesis utility (Web Speech API)
 */
class SpeechUtils {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.isSpeakingState = false;
        this.onStateChange = null;
    }

    speak(text, onEnd = null) {
        this.stop();

        // Remove HTML tags if present
        const cleanText = text.replace(/<[^>]*>/g, '').trim();
        if (!cleanText) return;

        this.utterance = new SpeechSynthesisUtterance(cleanText);

        // Attempt to find a good English voice
        const voices = this.synth.getVoices();
        const enVoice = voices.find(v => v.lang.startsWith('en-GB')) || voices.find(v => v.lang.startsWith('en'));
        if (enVoice) {
            this.utterance.voice = enVoice;
        }

        this.utterance.onstart = () => {
            this.isSpeakingState = true;
            if (this.onStateChange) this.onStateChange(true);
        };

        this.utterance.onend = () => {
            this.isSpeakingState = false;
            if (this.onStateChange) this.onStateChange(false);
            if (onEnd) onEnd();
        };

        this.utterance.onerror = () => {
            this.isSpeakingState = false;
            if (this.onStateChange) this.onStateChange(false);
        };

        this.synth.speak(this.utterance);
    }

    stop() {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
        this.isSpeakingState = false;
        if (this.onStateChange) this.onStateChange(false);
    }

    isSpeaking() {
        return this.synth.speaking || this.isSpeakingState;
    }
}

const speechUtils = new SpeechUtils();
export default speechUtils;
