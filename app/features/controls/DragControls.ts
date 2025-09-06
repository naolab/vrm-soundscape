import * as THREE from 'three'

export interface CharacterPosition {
  x: number
  y: number
  z: number
}

export class DragControls {
  private renderer: THREE.WebGLRenderer
  private camera: THREE.Camera
  private character: THREE.Object3D | null = null
  private isDragging = false
  private raycaster = new THREE.Raycaster()
  private dragPlane = new THREE.Plane()
  private intersectionPoint = new THREE.Vector3()
  private offset = new THREE.Vector3()
  
  // Bound methods for proper cleanup
  private boundMouseDown!: (event: MouseEvent) => void
  private boundMouseMove!: (event: MouseEvent) => void
  private boundMouseUp!: () => void
  private boundTouchStart!: (event: TouchEvent) => void
  private boundTouchMove!: (event: TouchEvent) => void
  private boundTouchEnd!: () => void
  
  public onPositionChange?: (position: CharacterPosition) => void

  constructor(renderer: THREE.WebGLRenderer, camera: THREE.Camera) {
    this.renderer = renderer
    this.camera = camera
    this.setupEventListeners()
  }

  public setCharacter(character: THREE.Object3D): void {
    this.character = character
  }

  public getCurrentPosition(): CharacterPosition {
    if (!this.character) {
      return { x: 0, y: 0, z: 0 }
    }
    return {
      x: this.character.position.x,
      y: this.character.position.y,
      z: this.character.position.z
    }
  }

  private setupEventListeners(): void {
    const canvas = this.renderer.domElement

    // Store bound methods to enable proper cleanup
    this.boundMouseDown = this.onMouseDown.bind(this)
    this.boundMouseMove = this.onMouseMove.bind(this)
    this.boundMouseUp = this.onMouseUp.bind(this)
    this.boundTouchStart = this.onTouchStart.bind(this)
    this.boundTouchMove = this.onTouchMove.bind(this)
    this.boundTouchEnd = this.onTouchEnd.bind(this)

    canvas.addEventListener('mousedown', this.boundMouseDown)
    canvas.addEventListener('mousemove', this.boundMouseMove)
    canvas.addEventListener('mouseup', this.boundMouseUp)
    canvas.addEventListener('mouseleave', this.boundMouseUp)

    // Touch events for mobile
    canvas.addEventListener('touchstart', this.boundTouchStart)
    canvas.addEventListener('touchmove', this.boundTouchMove)
    canvas.addEventListener('touchend', this.boundTouchEnd)
  }

  private getMousePosition(event: MouseEvent | TouchEvent): THREE.Vector2 {
    const rect = this.renderer.domElement.getBoundingClientRect()
    let clientX: number, clientY: number

    if (event instanceof TouchEvent && event.touches.length > 0) {
      clientX = event.touches[0].clientX
      clientY = event.touches[0].clientY
    } else if (event instanceof MouseEvent) {
      clientX = event.clientX
      clientY = event.clientY
    } else {
      return new THREE.Vector2(0, 0)
    }

    return new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    )
  }

  private onMouseDown(event: MouseEvent): void {
    if (!this.character) return

    const mousePos = this.getMousePosition(event)
    this.raycaster.setFromCamera(mousePos, this.camera)

    const intersects = this.raycaster.intersectObject(this.character, true)
    if (intersects.length > 0) {
      this.startDrag(mousePos, intersects[0].point)
    }
  }

  private onTouchStart(event: TouchEvent): void {
    event.preventDefault()
    if (!this.character || event.touches.length !== 1) return

    const mousePos = this.getMousePosition(event)
    this.raycaster.setFromCamera(mousePos, this.camera)

    const intersects = this.raycaster.intersectObject(this.character, true)
    if (intersects.length > 0) {
      this.startDrag(mousePos, intersects[0].point)
    }
  }

  private startDrag(mousePos: THREE.Vector2, intersectionPoint: THREE.Vector3): void {
    this.isDragging = true

    // Create a drag plane perpendicular to the camera
    const cameraDirection = new THREE.Vector3()
    this.camera.getWorldDirection(cameraDirection)
    this.dragPlane.setFromNormalAndCoplanarPoint(cameraDirection, intersectionPoint)

    // Calculate offset from character position to intersection point
    this.offset.copy(intersectionPoint).sub(this.character!.position)

    // Change cursor
    this.renderer.domElement.style.cursor = 'grabbing'
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.character) return

    const mousePos = this.getMousePosition(event)
    this.updateDrag(mousePos)
  }

  private onTouchMove(event: TouchEvent): void {
    event.preventDefault()
    if (!this.isDragging || !this.character || event.touches.length !== 1) return

    const mousePos = this.getMousePosition(event)
    this.updateDrag(mousePos)
  }

  private updateDrag(mousePos: THREE.Vector2): void {
    this.raycaster.setFromCamera(mousePos, this.camera)

    if (this.raycaster.ray.intersectPlane(this.dragPlane, this.intersectionPoint)) {
      const newPosition = this.intersectionPoint.sub(this.offset)
      this.character!.position.copy(newPosition)

      // Notify position change
      if (this.onPositionChange) {
        this.onPositionChange(this.getCurrentPosition())
      }
    }
  }

  private onMouseUp(): void {
    this.endDrag()
  }

  private onTouchEnd(): void {
    this.endDrag()
  }

  private endDrag(): void {
    if (this.isDragging) {
      this.isDragging = false
      this.renderer.domElement.style.cursor = 'default'
    }
  }

  public dispose(): void {
    const canvas = this.renderer.domElement

    canvas.removeEventListener('mousedown', this.boundMouseDown)
    canvas.removeEventListener('mousemove', this.boundMouseMove)
    canvas.removeEventListener('mouseup', this.boundMouseUp)
    canvas.removeEventListener('mouseleave', this.boundMouseUp)

    canvas.removeEventListener('touchstart', this.boundTouchStart)
    canvas.removeEventListener('touchmove', this.boundTouchMove)
    canvas.removeEventListener('touchend', this.boundTouchEnd)
  }
}