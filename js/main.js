// Major scales by key
const majorScales = {
    C: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    D: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    E: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
    F: ['F', 'G', 'A', 'A#', 'C', 'D', 'E'],
    G: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    A: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    B: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
};

// All piano notes
const allPianoNotes = [
    'C0', 'C#0', 'D0', 'D#0', 'E0', 'F0', 'F#0', 'G0', 'G#0', 'A0', 'A#0', 'B0',
    'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',
    'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
    'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
    'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
    'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',
    'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7',
    'C8'
];

// Function to get notes by level (extended octaves)
function getNotesByLevel(level, scale) {
    const indexC4 = allPianoNotes.indexOf('C4');
    const totalNotes = level;

    let notes = [];
    const lowerOctaveLimit = Math.max(0, 4 - Math.floor(level / 10));
    const upperOctaveLimit = Math.min(8, 4 + Math.floor(level / 10));

    // Generate notes for the scale in the available octaves
    for (let i = lowerOctaveLimit; i <= upperOctaveLimit; i++) {
        scale.forEach(note => {
            const noteWithOctave = `${note}${i}`;
            if (allPianoNotes.includes(noteWithOctave)) {
                notes.push(noteWithOctave);
            }
        });
    }

    return notes;
}
let generatedSequence = []
// Generate sequence when button is clicked
document.getElementById('generateNotes').addEventListener('click', function () {
    const n = Math.min(50, Math.max(1, parseInt(numNotesInput.value))); // Asegurarse de que n esté entre 1 y 50
    const maxInterval = parseInt(maxIntervalInput.value);
    const level = parseInt(slider.value); // Obtener el nivel actual
    const sequence = generateRandomNotes(n, maxInterval, level); // Generar la secuencia de notas
    displaySequence(sequence); // Mostrar la secuencia
    generatedSequence = sequence; // Guardar la secuencia generada en la variable
    console.log(generatedSequence)
});

// Function to check if interval is valid
function isValidInterval(nextNoteIndex, previousNoteIndex, maxInterval) {
    return Math.abs(nextNoteIndex - previousNoteIndex) <= maxInterval;
}

// Function to generate random notes from the scale
function generateRandomNotes(n, maxInterval, level) {
    const key = document.getElementById('key').value;
    const scale = majorScales[key];
    const availableNotes = getNotesByLevel(level, scale); // Obtener notas disponibles según el nivel

    const sequence = [];
    let previousNoteIndex = Math.floor(Math.random() * availableNotes.length);

    for (let i = 0; i < n; i++) {
        let nextNoteIndex;
        do {
            nextNoteIndex = Math.floor(Math.random() * availableNotes.length);
        } while (!isValidInterval(nextNoteIndex, previousNoteIndex, maxInterval));

        sequence.push(availableNotes[nextNoteIndex]);
        previousNoteIndex = nextNoteIndex;
    }

    return sequence;
}

// Function to update notes display
function updateNotes(level) {
    const key = document.getElementById('key').value;
    const scale = majorScales[key];
    const availableNotes = getNotesByLevel(level, scale);
    notesDisplay.textContent = availableNotes.join(', ');
}

// Function to display sequence
function displaySequence(sequence) {
    sequenceDisplay.textContent = sequence.join(', ');
}

// Event listeners
const slider = document.getElementById('difficultyLevel');
const levelValue = document.getElementById('levelValue');
const notesDisplay = document.getElementById('notesDisplay');
const sequenceDisplay = document.getElementById('sequenceDisplay');
const numNotesInput = document.getElementById('numNotes');
const maxIntervalInput = document.getElementById('maxInterval');

// Update UI on load
window.addEventListener('load', function () {
    updateNotes(1);
});

// Update UI when slider value changes
slider.addEventListener('input', function () {
    const level = parseInt(slider.value);
    levelValue.textContent = `Level ${level}`;
    updateNotes(level);
});



const notes = ['C4', 'D4', 'E4']; // Notas con octava
const durations = ['8n', '4n', '2n', '16n']; // Notación de duración de las notas

function generateRandomRhythm() {
    const rhythm = [];
    const notesCopy = [...generatedSequence]; // Copia de las notas disponibles

    for (let i = 0; i < 16; i++) {
        const noteOrSilence = Math.random() < 0.45; // Probabilidad de silencio
        if (noteOrSilence) {
            rhythm.push(null); // Agregar silencio
        } else {
            if (notesCopy.length > 0) {
                const noteIndex = Math.floor(Math.random() * notesCopy.length);
                const note = notesCopy.splice(noteIndex, 1)[0]; // Obtener una nota aleatoria y eliminarla
                const duration =
                    durations[Math.floor(Math.random() * durations.length)];
                rhythm.push({ note, duration });
            }
        }
    }
    return rhythm;
}

function printRhythm(rhythm) {
    const rhythmContainer = document.getElementById('rhythm-container');  // Cambiar de 'rhythm' a 'rhythm-container'
    rhythmContainer.innerHTML = ''; // Limpiar el contenedor

    rhythm.forEach((item) => {
        const div = document.createElement('div');
        if (item) {
            div.textContent = `${item.note} (${item.duration})`;
            div.classList.add('note');
        } else {
            div.textContent = 'Silencio';
            div.classList.add('silence');
        }
        rhythmContainer.appendChild(div);
    });
}


document.getElementById('toggle-visibility').addEventListener('click', toggleVisibility);
document.getElementById('play-rhythm').addEventListener('click', playRhythm);

function toggleVisibility() {
    const rhythmContainer = document.getElementById('rhythm-container');
    // Cambiar la visibilidad del contenedor
    if (rhythmContainer.style.display === 'none') {
        rhythmContainer.style.display = 'block'; // Mostrar
    } else {
        rhythmContainer.style.display = 'none'; // Ocultar
    }
}
// Asumiendo que ya tienes el código para configurar el BPM del slider
bpmSlider.addEventListener('input', () => {
    const bpm = parseInt(bpmSlider.value, 10);
    bpmDisplay.textContent = bpm;
    Tone.Transport.bpm.value = bpm;
});

// Asumiendo que ya tienes el código para configurar el BPM del slider
bpmSlider.addEventListener('input', () => {
    const bpm = parseInt(bpmSlider.value, 10);
    bpmDisplay.textContent = bpm;
    Tone.Transport.bpm.value = bpm;
});
let currentLoopId = null; // Guardar el ID del loop en ejecución

function playRhythm() {
    // Detener cualquier reproducción anterior
    Tone.Transport.stop(); // Detiene el transporte (cualquier reproducción previa)
    Tone.Transport.cancel(); // Cancela los eventos programados previos (por si hay algún evento pendiente)

    // Si ya hay un loop en ejecución, lo cancelamos
    if (currentLoopId !== null) {
        currentLoopId.dispose(); // Cancela el loop anterior
    }

    const rhythm = generateRandomRhythm();
    printRhythm(rhythm);

    const rhythmContainer = document.getElementById('rhythm-container');
    rhythmContainer.innerHTML = rhythm.map(item =>
        item ? `${item.note} (${item.duration})` : 'Silencio'
    ).join('<br>');

    const synth = new Tone.Synth().toDestination();

    // Generamos la combinación de notas y duraciones para el loop
    const combinacion = rhythm.map(item => ({
        nota: item ? item.note : null,
        duracion: item ? item.duration : '4n' // Silencio si no hay nota
    }));

    // Usamos el tiempo de inicio del transporte para alinear la reproducción
    let time = Tone.Transport.now();

    // Configuramos el loop usando Tone.Loop
    currentLoopId = new Tone.Loop((time) => {
        combinacion.forEach(({ nota, duracion }, i) => {
            if (nota) {
                const durationInSeconds = Tone.Time(duracion).toSeconds();
                synth.triggerAttackRelease(nota, durationInSeconds, time + i * durationInSeconds);
            }
        });
    }, '1m'); // Longitud del loop (1 compás)

    // Iniciar la reproducción al ritmo del BPM
    Tone.Transport.start();
    currentLoopId.start(0); // Inicia el loop

    console.log('Ritmo en bucle:', combinacion);
}
