import { AUDIO_CONFIG } from '../constants/audio'

export class LipSync {
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private dataArray: Float32Array | null = null
  private gainNode: GainNode | null = null

  public async startAnalysis(audioUrl: string): Promise<AudioBufferSourceNode | null> {
    try {
      this.audioContext = new AudioContext()
      
      const response = await fetch(audioUrl)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)

      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = AUDIO_CONFIG.LIP_SYNC.FFT_SIZE
      this.dataArray = new Float32Array(this.analyser.fftSize)

      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain()

      const source = this.audioContext.createBufferSource()
      source.buffer = audioBuffer
      
      // Connect: source -> gainNode -> destination
      // Also connect source -> analyser for volume analysis
      source.connect(this.gainNode)
      this.gainNode.connect(this.audioContext.destination)
      source.connect(this.analyser)

      return source
    } catch (error) {
      console.error('Audio analysis failed:', error)
      return null
    }
  }

  public getVolume(): number {
    if (!this.analyser || !this.dataArray) return 0

    this.analyser.getFloatTimeDomainData(this.dataArray)
    
    let volume = 0.0
    for (let i = 0; i < this.dataArray.length; i++) {
      volume = Math.max(volume, Math.abs(this.dataArray[i]))
    }

    // ChatVRM's sigmoid function
    volume = 1 / (1 + Math.exp(AUDIO_CONFIG.LIP_SYNC.SIGMOID.MULTIPLIER * volume + AUDIO_CONFIG.LIP_SYNC.SIGMOID.OFFSET))
    if (volume < AUDIO_CONFIG.LIP_SYNC.SIGMOID.THRESHOLD) volume = 0

    return volume
  }

  public setVolumeByDistance(distance: number): void {
    if (!this.gainNode || !this.audioContext) return

    // Distance-based volume calculation
    // Closer = louder, farther = quieter
    const { MAX_DISTANCE, MIN_VOLUME, MAX_VOLUME, SMOOTHING_DURATION, ATTENUATION_CURVE } = AUDIO_CONFIG.DISTANCE

    // Enhanced attenuation: steep near-field decay, gentle far-field decay
    const normalizedDistance = Math.min(distance / MAX_DISTANCE, 1)
    
    // Use exponential decay for steep near-field and gentle far-field response
    // exp(-k*x) where k controls steepness
    const decayFactor = 4 // Higher = steeper near-field decay
    const exponentialDecay = Math.exp(-decayFactor * normalizedDistance)
    const volume = Math.max(MIN_VOLUME, MIN_VOLUME + (MAX_VOLUME - MIN_VOLUME) * exponentialDecay)

    // Smooth volume transition
    const currentTime = this.audioContext.currentTime
    this.gainNode.gain.cancelScheduledValues(currentTime)
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, currentTime)
    this.gainNode.gain.linearRampToValueAtTime(volume, currentTime + SMOOTHING_DURATION)
  }
}