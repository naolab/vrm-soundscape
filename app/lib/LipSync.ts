export class LipSync {
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private dataArray: Float32Array | null = null

  public async startAnalysis(audioUrl: string): Promise<AudioBufferSourceNode | null> {
    try {
      this.audioContext = new AudioContext()
      
      const response = await fetch(audioUrl)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)

      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 2048
      this.dataArray = new Float32Array(this.analyser.fftSize)

      const source = this.audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(this.audioContext.destination)
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
    
    let sum = 0
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += Math.abs(this.dataArray[i])
    }
    
    const volume = sum / this.dataArray.length
    return Math.min(volume * 5, 1) // Amplify and cap at 1
  }
}