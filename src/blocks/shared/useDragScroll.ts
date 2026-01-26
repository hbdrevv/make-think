import { useRef, useCallback, useEffect } from 'react'

export function useDragScroll(scrollContainerRef: React.RefObject<HTMLDivElement | null>) {
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

    // Cancel any ongoing momentum
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current)
      animationFrame.current = null
    }

    isDragging.current = true
    startX.current = e.pageX - container.offsetLeft
    scrollLeft.current = container.scrollLeft
    lastX.current = e.pageX
    lastTime.current = Date.now()
    velocity.current = 0

    container.style.cursor = 'grabbing'
    container.style.userSelect = 'none'
  }, [scrollContainerRef])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return
    const container = scrollContainerRef.current
    if (!container) return

    e.preventDefault()

    const now = Date.now()
    const dt = now - lastTime.current

    const x = e.pageX - container.offsetLeft
    const walk = x - startX.current

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
    if (!container || !isDragging.current) return

    isDragging.current = false
    container.style.cursor = 'grab'
    container.style.removeProperty('user-select')

    // Apply momentum if there's velocity
    if (Math.abs(velocity.current) > 0.1) {
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
