function Badge({ size = 34, monochrome = false }) {
  const gradId = monochrome ? 'bp-mono' : 'bp-edge'
  const crackId = monochrome ? 'bp-mono-crack' : 'bp-crack'

  return (
    <svg
      className="badge-mark"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={monochrome ? 'currentColor' : 'var(--crimson-bright)'} />
          <stop offset="100%" stopColor={monochrome ? 'currentColor' : 'var(--violet-bright)'} />
        </linearGradient>
        <linearGradient id={crackId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={monochrome ? 'currentColor' : 'var(--crimson-core)'} />
          <stop offset="100%" stopColor={monochrome ? 'currentColor' : 'var(--blue-bright)'} />
        </linearGradient>
      </defs>
      {/* the seal */}
      <path
        d="M50,5 L89,27.5 L89,72.5 L50,95 L11,72.5 L11,27.5 Z"
        fill="var(--bg-surface)"
        stroke={`url(#${gradId})`}
        strokeWidth="4"
      />
      {/* the breach — a fracture cutting through the seal */}
      <path
        d="M33,29 L59,47 L39,53 L67,73"
        fill="none"
        stroke={`url(#${crackId})`}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="badge-crack"
      />
    </svg>
  )
}

export default Badge
