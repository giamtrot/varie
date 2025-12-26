/**
 * Simple Speech Synthesis utility (Web Speech API)
 */
class SpeechUtils {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.isSpeakingState = false;
        this.onStateChange = null;

        // Default settings
        this.settings = {
            voiceURI: '',
            rate: 1.0,
            pitch: 1.0
        };
    }

    setSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }

    getVoices() {
        return this.synth.getVoices();
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }

    speak(text, onEnd = null) {
        this.stop();

        // Remove HTML tags if present
        const cleanText = text.replace(/<[^>]*>/g, '').trim();
        if (!cleanText) return;

        this.utterance = new SpeechSynthesisUtterance(cleanText);

        // Apply settings
        const voices = this.getVoices();
        const selectedVoice = voices.find(v => v.voiceURI === this.settings.voiceURI);
        if (selectedVoice) {
            this.utterance.voice = selectedVoice;
        } else {
            // Fallback selection if no URI matches
            const enVoice = voices.find(v => v.lang.startsWith('en-GB')) || voices.find(v => v.lang.startsWith('en'));
            if (enVoice) this.utterance.voice = enVoice;
        }

        this.utterance.rate = this.settings.rate;
        this.utterance.pitch = this.settings.pitch;

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
