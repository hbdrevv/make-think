import { useRef, useCallback, useEffect } from 'react'

// Minimum movement before drag activates (prevents accidental drags on click)
const DRAG_THRESHOLD = 5

export function useDragScroll(scrollContainerRef: React.RefObject<HTMLDivElement | null>) {
  const isMouseDown = useRef(false)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const velocity = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const animationFrame = useRef<number | null>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const container = scrollContainerRef.current
    if (!container) return

    // Prevent native image dragging
    e.preventDefault()

    // Cancel any ongoing momentum
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current)
      animationFrame.current = null
    }

    isMouseDown.current = true
    isDragging.current = false // Don't start dragging until threshold met
    startX.current = e.pageX - container.offsetLeft
    scrollLeft.current = container.scrollLeft
    lastX.current = e.pageX
    lastTime.current = Date.now()
    velocity.current = 0
  }, [scrollContainerRef])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isMouseDown.current) return
    const container = scrollContainerRef.current
    if (!container) return

    const x = e.pageX - container.offsetLeft
    const walk = x - startX.current

    // Only start dragging after threshold is met
    if (!isDragging.current) {
      if (Math.abs(walk) < DRAG_THRESHOLD) return
      isDragging.current = true
      container.style.cursor = 'grabbing'
      container.style.userSelect = 'none'
    }

    e.preventDefault()

    const now = Date.now()
    const dt = now - lastTime.current

    // Track velocity for momentum
    if (dt > 0) {
      velocity.current = (e.pageX - lastX.current) / dt
    }

    lastX.current = e.pageX
    lastTime.current = now

    container.scrollLeft = scrollLeft.current - walk
  }, [scrollContainerRef])

  const applyMomentum = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const friction = 0.95
    const minVelocity = 0.1

    const animate = () => {
      if (Math.abs(velocity.current) < minVelocity) {
        velocity.current = 0
        return
      }

      container.scrollLeft -= velocity.current * 16 // ~16ms per frame
      velocity.current *= friction

      animationFrame.current = requestAnimationFrame(animate)
    }

    animate()
  }, [scrollContainerRef])

  const handleMouseUp = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container || !isMouseDown.current) return

    const wasDragging = isDragging.current
    isMouseDown.current = false
    isDragging.current = false
    container.style.cursor = 'grab'
    container.style.removeProperty('user-select')

    // Apply momentum if there's velocity and we were actually dragging
    if (wasDragging && Math.abs(velocity.current) > 0.1) {
      applyMomentum()
    }
  }, [scrollContainerRef, applyMomentum])

  const handleMouseLeave = useCallback(() => {
    if (isDragging.current) {
      handleMouseUp()
    }
  }, [handleMouseUp])

  // Set initial cursor style and cleanup
  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.style.cursor = 'grab'
    }

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [scrollContainerRef])

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  }
}
