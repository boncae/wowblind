import { useCallback, useRef, useState } from 'react'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const KEEP_VISIBLE = 56
const NO_DRAG = 'button, a, input, textarea, select, iframe, [data-no-drag]'

// 마우스/터치로 끌어서 옮길 수 있는 떠다니는 위젯용 훅.
// transform 애니메이션과 부딪히지 않게 left/top 좌표로만 움직인다.
export default function useDraggable() {
  const ref = useRef(null)
  const drag = useRef(null)
  const [position, setPosition] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const onPointerDown = useCallback((event) => {
    const node = ref.current
    if (!node || event.button !== 0 || event.target.closest(NO_DRAG)) return

    const rect = node.getBoundingClientRect()
    let origin = position
    if (!origin) {
      // 아직 한 번도 안 옮긴 상태면 left/top 0 기준으로 재보고 차이만큼 보정한다.
      const inline = node.style.cssText
      node.style.left = '0px'
      node.style.top = '0px'
      node.style.right = 'auto'
      node.style.bottom = 'auto'
      const zero = node.getBoundingClientRect()
      node.style.cssText = inline
      origin = { left: rect.left - zero.left, top: rect.top - zero.top }
    }

    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin,
      shiftX: rect.left - origin.left,
      shiftY: rect.top - origin.top,
      width: rect.width,
    }
    setPosition(origin)
    setIsDragging(true)
    node.setPointerCapture?.(event.pointerId)
    event.preventDefault()
  }, [position])

  const onPointerMove = useCallback((event) => {
    const info = drag.current
    if (!info || info.pointerId !== event.pointerId) return
    const nextLeft = info.origin.left + (event.clientX - info.startX)
    const nextTop = info.origin.top + (event.clientY - info.startY)
    setPosition({
      left: clamp(nextLeft, KEEP_VISIBLE - info.width - info.shiftX, window.innerWidth - KEEP_VISIBLE - info.shiftX),
      top: clamp(nextTop, -info.shiftY, window.innerHeight - KEEP_VISIBLE - info.shiftY),
    })
  }, [])

  const endDrag = useCallback((event) => {
    const info = drag.current
    if (!info || (event && info.pointerId !== event.pointerId)) return
    drag.current = null
    setIsDragging(false)
    const node = ref.current
    if (node?.hasPointerCapture?.(info.pointerId)) node.releasePointerCapture(info.pointerId)
  }, [])

  return {
    ref,
    isDragging,
    dragProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      style: position ? { left: position.left, top: position.top, right: 'auto', bottom: 'auto' } : undefined,
    },
  }
}
