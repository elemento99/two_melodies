import {sampler} from './instruments'

function reproducirCombinacion(combinacion) {
    let tiempoInicio = 0;
    combinacion.forEach(({ nota, duracion }) => {
      sampler.triggerAttackRelease(
        nota,
        duracion,
        Tone.now() + tiempoInicio
      );
      tiempoInicio += Tone.Time(duracion).toSeconds();
    });
  }