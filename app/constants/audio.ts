export const AUDIO_CONFIG = {
  LIP_SYNC: {
    FFT_SIZE: 2048,
    SIGMOID: {
      MULTIPLIER: -45,
      OFFSET: 5,
      THRESHOLD: 0.1
    }
  },
  DISTANCE: {
    MAX_DISTANCE: 5,
    MIN_VOLUME: 0.05,
    MAX_VOLUME: 1.0,
    SMOOTHING_DURATION: 0.1,
    ATTENUATION_CURVE: 3  // Higher = faster decay (was 2 for square law)
  }
} as const