const RESOURCES = [
  {
    name: 'PortSwigger Web Security Academy',
    focus: 'Web exploitation',
    body: 'Free, structured labs on everything from SQLi to request smuggling. The default starting point for web track.',
    url: 'https://portswigger.net/web-security',
  },
  {
    name: 'OverTheWire',
    focus: 'Linux & binary fundamentals',
    body: 'Wargames that build the command-line and systems instincts every other track quietly depends on.',
    url: 'https://overthewire.org/wargames/',
  },
  {
    name: 'CryptoHack',
    focus: 'Applied cryptography',
    body: 'Crypto challenges that teach the math by breaking it, not by reading about it.',
    url: 'https://cryptohack.org/',
  },
  {
    name: 'pwn.college',
    focus: 'Binary exploitation',
    body: 'A full curriculum on reversing and exploitation, from stack basics to modern mitigations.',
    url: 'https://pwn.college/',
  },
]

function LearnPage() {
  return (
    <div className="page learn-page">
      <div className="page-head">
        <p className="section-kicker">SHARPEN UP</p>
        <h1>Learn, then bring it back.</h1>
        <p className="hero-sub">
          BreachPoint doesn't try to replace the platforms that already teach this well. It points you
          outward, then gives you somewhere local to prove what you picked up.
        </p>
      </div>

      <div className="resource-grid">
        {RESOURCES.map((resource) => (
          <a className="resource-card glow-card" href={resource.url} key={resource.name} rel="noreferrer" target="_blank">
            <span className="resource-focus">{resource.focus}</span>
            <h3>{resource.name}</h3>
            <p>{resource.body}</p>
            <span className="resource-link">Visit resource <span>↗</span></span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default LearnPage
