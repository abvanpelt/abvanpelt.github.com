const frequencies = {
    "note-c": 261.63,
    "note-c-sharp": 277.18,
    "note-d": 293.66,
    "note-d-sharp": 311.13,
    "note-e": 329.63,
    "note-f": 349.23,
    "note-f-sharp": 369.99,
    "note-g": 392.00,
    "note-g-sharp": 415.30,
    "note-a": 440.00,
    "note-a-sharp": 466.16,
    "note-b": 493.88
};

// Create an AudioContext
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// Create the GainNode
const volume = createVolume()

// Create the OscillatorNode
let oscillator = createOscillator();
let audioEnded = true;

const playAudio = function (event, id) {
    // Cancel the event, to prevent both "touch" and "mouse" events from being triggered.
    event.preventDefault();

    // Start the AudioContext after user interaction
    // This may be necessary due to browser autoplay policies
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    // Set frequency and play note
    oscillator.frequency.value = frequencies[id];
    oscillator.start();

    // Reset flag
    audioEnded = false;
};

const stopAudio = function () {
    if (!audioEnded) {
        // Stop note
        oscillator.stop();

        // Create a new OscillatorNode for this note
        // An OscillatorNode cannot be re-started after being stopped.
        oscillator = createOscillator();

        // Reset flag
        audioEnded = true;
    }
};

const keys = document.querySelectorAll(".key");
keys.forEach(key => {
    // Play audio on touchstart or mousedown
    key.addEventListener("touchstart", event => playAudio(event, key.id));
    key.addEventListener("mousedown", event => playAudio(event, key.id));

    // Stop audio on touchend, mouseout, or mouseup
    key.addEventListener("touchend", stopAudio);
    key.addEventListener("mouseout", stopAudio);
    key.addEventListener("mouseup", stopAudio);
}
);

function createVolume() {
    // Create a GainNode & initialize the volume level
    const volume = audioContext.createGain();
    volume.gain.value = 1;

    // Connect the GainNode to the audio output
    volume.connect(audioContext.destination);

    return volume;
}

function createOscillator() {
    // Create an OscillatorNode & initialize the waveform
    const oscillator = new OscillatorNode(audioContext);
    oscillator.type = 'sine';

    oscillator.addEventListener("ended", () => audioEnded = true);

    // Connect the OscillatorNode (audio source) to the GainNode (audio effect)
    oscillator.connect(volume);

    return oscillator;
}