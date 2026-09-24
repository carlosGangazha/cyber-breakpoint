// Spawns a short-lived glowing ripple ring at the pointer position.
// Attach via onPointerDown={spawnRipple} to any element with position: relative
// and overflow handling set up to receive a `.ripple-fx` child (see App.css).
export function spawnRipple(event) {
  const target = event.currentTarget
  if (!target) return

  const rect = target.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 1.6
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  const ripple = document.createElement('span')
  ripple.className = 'ripple-fx'
  ripple.style.width = `${size}px`
  ripple.style.height = `${size}px`
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`

  target.appendChild(ripple)
  ripple.addEventListener('animationend', () => ripple.remove())
}
