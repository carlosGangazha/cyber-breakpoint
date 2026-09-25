function Badge({ size = 34 }) {
  const edgeId = `bp-edge-${size}`
  const crackId = `bp-crack-${size}`

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
        <linearGradient id={edgeId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--crimson-bright)" />
          <stop offset="100%" stopColor="var(--violet-bright)" />
        </linearGradient>
        <linearGradient id={crackId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--crimson-core)" />
          <stop offset="100%" stopColor="var(--blue-bright)" />
        </linearGradient>
      </defs>
      <path
        d="M50,5 L89,27.5 L89,72.5 L50,95 L11,72.5 L11,27.5 Z"
        fill="var(--bg-surface)"
        stroke={`url(#${edgeId})`}
        strokeWidth="4"
      />
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
