const slider = document.getElementById('nivelDificultad');
const nivelValor = document.getElementById('nivelValor');
const notasDisplay = document.getElementById('notasDisplay');
const secuenciaDisplay = document.getElementById('secuenciaDisplay');



// Actualiza las notas disponibles al cambiar el nivel
slider.addEventListener('input', function () {
  const nivel = parseInt(slider.value);
  todasLasNotas = obtenerNotasPorNivel(nivel);
  nivelValor.textContent = `Nivel ${nivel}`;
  notasDisplay.textContent = todasLasNotas.join(', ');
});

// Generar y mostrar las notas aleatorias al hacer clic en el botón
document
  .getElementById('generarNotas')
  .addEventListener('click', function () {
    const secuencia = generarNotasAleatorias(4);
    secuenciaDisplay.textContent = secuencia.join(', ');
  });

// Inicialización de las notas al cargar la página
window.addEventListener('load', function () {
  notasDisplay.textContent = todasLasNotas.join(', ');
});

const duraciones = ['8n', '4n', '16n', '2n'];
Tone.Transport.bpm.value = 120;



function generarNotasAleatorias(n) {
  const tonalidad = document.getElementById('key').value;
  const escala = escalasMayores[tonalidad];

  // Filtrar notas disponibles en la tonalidad seleccionada
  const notasDisponibles = todasLasNotas.filter((nota) => {
    const nombreNota = nota.replace(/\d/, ''); // Remover número de la nota para comparar
    return escala.includes(nombreNota); // Compara con la escala mayor de la tonalidad
  });

  // Generar una secuencia aleatoria de notas dentro de las notas disponibles
  return Array.from(
    { length: n },
    () =>
      notasDisponibles[
        Math.floor(Math.random() * notasDisponibles.length)
      ]
  );
}




// Evento del botón Generar Ritmo
document.getElementById('generateButton').onclick = async () => {
  const n = parseInt(document.getElementById('noteCount').value, 10);
  const notas = generarNotasAleatorias(n);
  const ritmo = generarRitmoAleatorio(n);
  const combinacion = generarCombinaciones(notas, ritmo);

  // Asegurarse de que Tone.js está inicializado
  await Tone.start();

  // Reproducir la combinación generada
  reproducirCombinacion(combinacion);

  console.log('Combinación generada:', combinacion);
};

document.getElementById('stopButton').onclick = () => {
  Tone.Transport.stop();
  Tone.Transport.cancel();
};

document.getElementById('playCadenceButton').onclick = async () => {
  const key = document.getElementById('key').value;
  const chords = getCadence(key);

  // Asegúrate de que Tone.js está inicializado
  await Tone.start();

  // Calcula la duración entre acordes basada en el BPM actual
  const chordDuration = Tone.Time('4n').toSeconds(); // Un cuarto de nota (4n)
  let time = 0;

  // Calcula la duración de cada acorde en función del BPM
  chords.forEach((chord, index) => {
    // La duración de un acorde ahora depende del BPM y la duración de la nota
    sampler.triggerAttackRelease(chord, '8n', `+${time}`);
    time += chordDuration; // Incrementa el tiempo de acuerdo con el BPM
  });
};


let currentLoop = null; // Variable para almacenar el bucle generado

document.getElementById('loopRhythmButton').onclick = async () => {
  const n = parseInt(document.getElementById('noteCount').value, 10);
  const notas = generarNotasAleatorias(n);
  const ritmo = generarRitmoAleatorio(n);
  const combinacion = generarCombinaciones(notas, ritmo);

  // Asegúrate de que Tone.js está inicializado
  await Tone.start();

  // Detén cualquier loop previo
  if (currentLoop) {
    currentLoop.dispose();
  }

  // Actualiza el DOM con las notas y duraciones
  const notasContainer = document.getElementById('notasContainer');
  if (notasContainer) {
    notasContainer.innerHTML = ''; // Limpia el contenido previo
    combinacion.forEach(({ nota, duracion }) => {
      const item = document.createElement('div');
      item.textContent = `Nota: ${nota}, Duración: ${duracion}`;
      notasContainer.appendChild(item);
    });
  }
  // Define el loop
  currentLoop = new Tone.Loop((time) => {
    combinacion.forEach(({ nota, duracion }, i) => {
      sampler.triggerAttackRelease(
        nota,
        duracion,
        time + i * Tone.Time(duracion).toSeconds()
      );
    });
  }, '1m'); // Longitud del loop (1 compás)

  // Inicia el transporte y el loop
  Tone.Transport.start();
  currentLoop.start(0);

  console.log('Ritmo en bucle:', combinacion);
  // Oculta el contenedor de notas
  if (notasContainer) {
    notasContainer.style.display = 'none';
  }
};
document.getElementById('toggleNotasButton').onclick = () => {
  const notasContainer = document.getElementById('notasContainer');
  if (
    notasContainer.style.display === 'none' ||
    !notasContainer.style.display
  ) {
    notasContainer.style.display = 'block'; // Muestra el contenedor
  } else {
    notasContainer.style.display = 'none'; // Oculta el contenedor
  }
};

const droneSynth = new Tone.PolySynth(Tone.Synth).toDestination();

// Configuración usando .set()
droneSynth.set({
  filter: {
    type: 'lowpass', // Filtro pasa-bajos para suavizar el sonido
    frequency: 300, // Frecuencia de corte baja
    Q: 1, // Factor de calidad del filtro
  },
  envelope: {
    attack: 2, // Tiempo de ataque largo para una transición suave
    decay: 3, // Decaimiento más lento
    sustain: 0.6, // Nivel de sustain moderado
    release: 5, // Liberación larga para un desvanecimiento suave
  },
});

// Añadir efectos
const reverb = new Tone.Reverb({
  decay: 10,
  preDelay: 0.5,
}).toDestination();

const delay = new Tone.FeedbackDelay({
  delayTime: '4n',
  feedback: 0.4,
}).toDestination();

// Conectar el sintetizador con los efectos
droneSynth.connect(reverb);
droneSynth.connect(delay);

// Ajuste de volumen
droneSynth.volume.value = -15;

const droneChordIntervals = [0, 4, 7];
let currentDroneNotes = [];

// Obtener notas para el drone


// Reproducir drone
async function playDrone() {
  const key = document.getElementById('key').value;
  currentDroneNotes = getDroneNotes(key);
  await Tone.start(); // Asegúrate de que Tone.js está inicializado
  droneSynth.triggerAttack(currentDroneNotes);
}

// Detener drone
function stopDrone() {
  // Detener cualquier nota activa
  droneSynth.releaseAll(); // Método genérico si tu synth lo soporta
  droneSynth.triggerRelease(currentDroneNotes); // Nota específica
  currentDroneNotes = [];

  // Limpiar otros posibles synths o fuentes de audio
  if (otherSynth && otherSynth.triggerRelease) {
    otherSynth.triggerRelease();
  }

  // Si estás usando un contexto de audio
  if (audioContext && audioContext.state === 'running') {
    audioContext.suspend(); // Opcional: detiene todo temporalmente
  }
}

const bpmSlider = document.getElementById('bpmSlider');
const bpmDisplay = document.getElementById('bpmDisplay');

bpmSlider.addEventListener('input', () => {
  const bpm = parseInt(bpmSlider.value, 10);
  bpmDisplay.textContent = bpm;
  Tone.Transport.bpm.value = bpm;
});

document
  .getElementById('playDroneButton')
  .addEventListener('click', playDrone);
document
  .getElementById('stopDroneButton')
  .addEventListener('click', stopDrone);
