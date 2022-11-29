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

// Create a GainNode & initialize the volume level
const volume = audioContext.createGain();
volume.gain.value = 1;

// Connect the GainNode to the audio output
volume.connect(audioContext.destination);

let audioEnded = true;

const keys = document.querySelectorAll(".key");
keys.forEach(key => {
    let oscillator = createOscillator(key.id);

    key.addEventListener(
        "touchstart",
        function (e) {
            // Cancel the event, to prevent both "touch" and "mouse" events from being triggered.
            e.preventDefault();

            // Play note
            oscillator.start();

            audioEnded = false;
        }
    );

    key.addEventListener(
        "touchend",
        function () {
            if (!audioEnded) {
                // Stop note
                oscillator.stop();

                // Create a new OscillatorNode for this note
                // An OscillatorNode cannot be re-started after being stopped.
                oscillator = createOscillator(key.id);

                audioEnded = true;
            }
        }
    );

    key.addEventListener(
        "mousedown",
        function () {
            // Play note
            oscillator.start();

            audioEnded = false;
        }
    );

    key.addEventListener(
        "mouseout",
        function () {
            if (!audioEnded) {
                // Stop note
                oscillator.stop();

                // Create a new OscillatorNode for this note
                // An OscillatorNode cannot be re-started after being stopped.
                oscillator = createOscillator(key.id);

                audioEnded = true;
            }
        }
    );

    key.addEventListener(
        "mouseup",
        function () {
            if (!audioEnded) {
                // Stop note
                oscillator.stop();

                // Create a new OscillatorNode for this note
                // An OscillatorNode cannot be re-started after being stopped.
                oscillator = createOscillator(key.id);

                audioEnded = true;
            }
        }
    );
}
);

function createOscillator(note) {
    // Create an OscillatorNode & initialize the waveform
    const oscillator = new OscillatorNode(audioContext);
    oscillator.type = 'sine';
    oscillator.frequency.value = frequencies[note];

    oscillator.addEventListener("ended", () => audioEnded = true);

    // Connect the OscillatorNode (audio source) to the GainNode (audio effect)
    oscillator.connect(volume);

    return oscillator;
}