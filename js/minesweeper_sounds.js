let audioContext;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    return audioContext;
}

function playTone(
    frequency,
    duration,
    type = "sine",
    volume = 0.04
) {
    const context = getAudioContext();

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(
        volume,
        context.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();

    oscillator.stop(
        context.currentTime + duration
    );
}


/* Normal click sound */

function clickSound(number) {
    const frequencies = {
        1: 500,
        2: 600,
        3: 700,
        4: 800,
        5: 900,
        6: 1000,
        7: 1100,
        8: 1200
    };

    playTone(
        frequencies[number] || 500,
        0.06,
        "sine",
        0.025
    );
}


/* Normal flag sound */

function flagSound(flagged) {
    if (flagged) {
        playTone(
            750,
            0.08,
            "square",
            0.025
        );
    } else {
        playTone(
            450,
            0.08,
            "square",
            0.02
        );
    }
}


/* Deep bomb sound */

function mineSound() {
    const context = getAudioContext();

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sawtooth";

    oscillator.frequency.setValueAtTime(
        70,
        context.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        30,
        context.currentTime + 0.6
    );

    gain.gain.setValueAtTime(
        0.12,
        context.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + 0.6
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();

    oscillator.stop(
        context.currentTime + 0.6
    );

    /* Deep impact */

    setTimeout(() => {
        playTone(
            45,
            0.45,
            "sine",
            0.09
        );
    }, 40);
}


window.clickSound = clickSound;
window.flagSound = flagSound;
window.mineSound = mineSound;