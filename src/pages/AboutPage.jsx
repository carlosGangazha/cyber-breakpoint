const VALUES = [
  {
    title: 'Discover openly',
    body: 'Talent in Zimbabwe is scattered across group chats and forgotten Discords. BreachPoint gives it one visible home.',
  },
  {
    title: 'Connect meaningfully',
    body: "Team matching isn't a nice-to-have here — it's the reason the platform exists. Skills should find each other.",
  },
  {
    title: 'Grow together',
    body: 'Every solve, writeup, and hosted challenge raises the floor for everyone else in the network.',
  },
]

function AboutPage() {
  return (
    <div className="page about-page">
      <div className="page-head">
        <p className="section-kicker">WHY WE EXIST</p>
        <h1>Zimbabwe already has the talent.</h1>
        <p className="hero-sub">
          Global platforms don't solve for local visibility. There's no way to find a teammate two suburbs
          away, no link back to Zimbabwean universities or employers, and no central record of who's
          actually good at what. BreachPoint gives the scene a place to connect, compete, and be seen — at
          home first, then internationally.
        </p>
      </div>

      <section className="values-grid">
        {VALUES.map((value) => (
          <article className="value-card glow-card" key={value.title}>
            <h3>{value.title}</h3>
            <p>{value.body}</p>
          </article>
        ))}
      </section>

      <section className="about-closing glow-card">
        <p className="section-kicker">THE BOTTOM LINE</p>
        <h2>A place to connect, compete, and get recognized — starting small, built to last.</h2>
      </section>
    </div>
  )
}

export default AboutPage
