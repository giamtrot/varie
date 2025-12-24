/**
 * Simple Speech Synthesis utility (Web Speech API)
 */
class SpeechUtils {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.isSpeakingState = false;
        this.onStateChange = null;

        // Load persisted settings
        this.settings = {
            voiceURI: localStorage.getItem('tts_voice') || '',
            rate: parseFloat(localStorage.getItem('tts_rate')) || 1.0,
            pitch: parseFloat(localStorage.getItem('tts_pitch')) || 1.0
        };
    }

    getVoices() {
        return this.synth.getVoices();
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        if (newSettings.voiceURI !== undefined) localStorage.setItem('tts_voice', this.settings.voiceURI);
        if (newSettings.rate !== undefined) localStorage.setItem('tts_rate', this.settings.rate.toString());
        if (newSettings.pitch !== undefined) localStorage.setItem('tts_pitch', this.settings.pitch.toString());
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
