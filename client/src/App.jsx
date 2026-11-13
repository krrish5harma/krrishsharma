import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, Menu, Moon, Sun, X } from 'lucide-react'
import { capabilities, profile, projects } from './data/profile.js'

const socialLinks = [
  { label: 'Instagram', href: profile.socials.instagram },
  { label: 'YouTube', href: profile.socials.youtube },
]

function ThemeToggle({ theme, onToggle }) {
  return <button className="theme-toggle" type="button" onClick={onToggle} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} title="Toggle theme">
    {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}<span>{theme === 'light' ? 'Dark' : 'Light'}</span>
  </button>
}

function Header({ theme, onToggle }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  useEffect(() => setMenuOpen(false), [location.pathname])
  return <header className="site-header">
    <Link className="wordmark" to="/" aria-label="Krrish Sharma home">K<span>.</span>SHARMA</Link>
    <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
      <NavLink to="/work">Work <span>({String(projects.length).padStart(2, '0')})</span></NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/contact">Contact</NavLink>
      <ThemeToggle theme={theme} onToggle={onToggle} />
    </nav>
  </header>
}

function Footer() {
  return <footer className="site-footer"><Link className="wordmark" to="/">K<span>.</span>SHARMA</Link><span>Independent creative · Jaipur, India</span><span>© {new Date().getFullYear()} Krrish Sharma</span><a className="back-top" href="#top" aria-label="Back to top"><ArrowRight size={16} /></a></footer>
}

function WorkStage() {
  const cards = [
    { id: '01', label: 'EDIT', style: 'stage-edit' },
    { id: '02', label: 'MOTION', style: 'stage-motion' },
    { id: '03', label: 'FILM', style: 'stage-film' },
  ]
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const rotate = (delta) => setActive((current) => (current + delta + cards.length) % cards.length)
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(() => setActive((current) => (current + 1) % cards.length), 4200)
    return () => window.clearInterval(timer)
  }, [paused])
  return <div className="work-stage" aria-label="Portfolio showcase preview" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}>
    <div className="stage-topline"><span>SELECTED WORK</span><span>MEDIA PREVIEW · 2026</span></div>
    <div className="stage-scene" aria-live="polite">
      {cards.map((card, index) => {
        const offset = (index - active + cards.length) % cards.length
        const position = offset === 2 ? -1 : offset
        const positions = { '-1': { x: '-52%', rotation: '28deg', scale: '.87', opacity: '.62', z: 1 }, 0: { x: '0%', rotation: '0deg', scale: '1', opacity: '1', z: 2 }, 1: { x: '52%', rotation: '-28deg', scale: '.87', opacity: '.62', z: 1 } }
        const pose = positions[position]
        return <div key={card.id} className={`stage-card ${card.style} ${position === 0 ? 'is-active' : ''}`} style={{ '--x': pose.x, '--rotation': pose.rotation, '--scale': pose.scale, '--opacity': pose.opacity, '--z': pose.z }} aria-hidden={position !== 0}>
          <div className="card-art" aria-label={`${card.label} preview placeholder`} role="img">
            <div className="art-grid" /><span className="art-index">K / {card.id}</span><span className="art-word">{card.label}<i>.</i></span><span className="art-note">PORTFOLIO<br />PREVIEW</span><div className="art-disc" /><div className="art-band" />
          </div>
          <span className="placeholder-label">Awaiting approved project media</span>
        </div>
      })}
    </div>
    <div className="stage-controls">
      <button type="button" aria-label="Previous preview" onClick={() => rotate(-1)}><ArrowLeft size={18} /></button>
      <span className="stage-count">0{active + 1}<span> / 0{cards.length}</span></span>
      <button type="button" aria-label="Next preview" onClick={() => rotate(1)}><ArrowRight size={18} /></button>
    </div>
    <p className="stage-disclaimer">Visual placeholders · project work will appear here</p>
  </div>
}

function Socials() {
  return <div className="social-links">{socialLinks.map(({ label, href }) => <a key={label} href={href} target="_blank" rel="noreferrer">{label}<ArrowUpRight size={13} /></a>)}</div>
}

function SectionHead({ eyebrow, title, children }) {
  return <div className="section-head"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{children && <p>{children}</p>}</div>
}

function ProjectCard({ project, index }) {
  return <Link to={`/work/${project.slug}`} className="project-card">
    <div className="project-image"><img src={project.thumbnail} alt={project.title} loading="lazy" /><span className="project-index">0{index + 1}</span><span className="project-arrow"><ArrowUpRight size={21} /></span></div>
    <div className="project-meta"><div><h3>{project.title}</h3><span>{project.category}</span></div>{project.year && <span>{project.year}</span>}</div>
  </Link>
}

function WorkGrid({ items = projects }) {
  return items.length ? <div className="project-grid">{items.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div> : <div className="empty-work"><div className="empty-mark">K<span>.</span></div><div><span className="eyebrow">THE NEXT FRAME IS YOURS</span><h3>Work is being prepared.</h3><p>Selected edits, motion pieces and films will be added here as approved project media is ready.</p></div><span className="empty-count">— 00 PROJECTS —</span></div>
}

function Home() {
  return <main id="top">
    <section className="hero page-wrap">
      <div className="hero-copy">
        <span className="eyebrow"><span className="status-dot" />INDEPENDENT CREATIVE <span className="eyebrow-slash">/</span> JAIPUR, INDIA</span>
        <h1>Krrish<br /><span>Sharma</span><b>.</b></h1>
        <p className="hero-role">Creative video editor<br />& motion graphics artist.</p>
        <p className="hero-intro">I create cinematic edits, motion-driven visuals and stories that stay with you.</p>
        <div className="hero-education"><span>BASED IN INDIA</span><span>BCA · MANIPAL UNIVERSITY JAIPUR · CLASS OF {profile.graduation}</span></div>
        <div className="hero-actions"><Link className="button button-dark" to="/work">View my work <ArrowDownRight size={17} /></Link><Link className="text-link" to="/contact">Let’s work together <ArrowUpRight size={15} /></Link></div>
        <Socials />
      </div>
      <div className="hero-visual"><WorkStage /><span className="vertical-note">MOVING IMAGE · MADE WITH INTENTION</span></div>
      <a className="scroll-cue" href="#selected-work"><span>SCROLL TO EXPLORE</span><ArrowDown size={15} /></a>
    </section>

    <section className="section page-wrap selected-section" id="selected-work">
      <SectionHead eyebrow="A FEW THINGS I DO" title={<>Selected<br />work<span className="accent-dot">.</span></>}><Link className="text-link" to="/work">Explore all work <ArrowUpRight size={15} /></Link></SectionHead>
      <WorkGrid />
    </section>

    <section className="capabilities-section"><div className="page-wrap section"><SectionHead eyebrow="FROM FIRST FRAME TO FINAL POLISH" title={<>What I<br />bring<span className="accent-dot">.</span></>}><p>Different tools, one intention: make the story feel something.</p></SectionHead><div className="capability-list">{capabilities.map((item) => <div className="capability-row" key={item.number}><span className="capability-number">{item.number}</span><h3>{item.title}</h3><p>{item.detail}</p><ArrowUpRight className="capability-arrow" size={18} /></div>)}</div></div></section>

    <section className="about-teaser page-wrap"><div className="teaser-stamp">ABOUT<br />KRRISH<span>↘</span></div><div><span className="eyebrow">A LITTLE CONTEXT</span><h2>Curious about the<br />whole picture.</h2><p>Editing taught me how a moment moves. Filmmaking helps me find it in the first place. I like working across both.</p><Link className="text-link" to="/about">More about me <ArrowUpRight size={15} /></Link></div><div className="teaser-tools"><span className="eyebrow">IN THE TOOLKIT</span>{profile.tools.map((tool) => <span key={tool}>{tool}</span>)}</div></section>

    <ContactBand />
  </main>
}

function ContactBand() {
  return <section className="contact-band"><div className="page-wrap contact-band-inner"><span className="eyebrow">HAVE A STORY IN MIND?</span><h2>Let’s make<br />something <em>move.</em></h2><Link className="button button-light" to="/contact">Start a conversation <ArrowUpRight size={17} /></Link></div></section>
}

function PageIntro({ eyebrow, title, copy }) {
  return <section className="page-intro page-wrap"><span className="eyebrow">{eyebrow}</span><h1>{title}<b>.</b></h1>{copy && <p>{copy}</p>}</section>
}

function WorkPage() {
  const categories = ['All', ...new Set(projects.map((project) => project.category))]
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? projects : projects.filter((project) => project.category === active)
  return <main id="top" className="inner-page"><PageIntro eyebrow="THE PORTFOLIO" title="Selected work" copy="A collection of edits, motion studies and films." />
    <section className="page-wrap work-listing"><div className="filter-row"><span className="eyebrow">BROWSE BY DISCIPLINE</span><div className="filter-buttons" role="group" aria-label="Filter projects by category">{categories.map((category) => <button key={category} className={active === category ? 'filter-button active' : 'filter-button'} onClick={() => setActive(category)}>{category}</button>)}</div></div><WorkGrid items={filtered} /></section>
    <ContactBand />
  </main>
}

function ProjectPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)
  if (!project) return <NotFound />
  return <main id="top" className="inner-page"><section className="page-wrap project-detail"><Link className="text-link" to="/work"><ArrowLeft size={15} /> Back to work</Link><span className="eyebrow">{project.category}</span><h1>{project.title}<b>.</b></h1><div className="detail-media">{project.videoUrl ? <video controls playsInline preload="none" poster={project.thumbnail}><source src={project.videoUrl} /></video> : <img src={project.thumbnail} alt={project.title} />}</div><p className="detail-description">{project.description}</p><div className="detail-facts">{project.role && <p><span>ROLE</span>{project.role}</p>}{project.year && <p><span>YEAR</span>{project.year}</p>}{project.tools?.length > 0 && <p><span>TOOLS</span>{project.tools.join(' · ')}</p>}</div></section></main>
}

function AboutPage() {
  return <main id="top" className="inner-page"><PageIntro eyebrow="A LITTLE ABOUT ME" title="Making stories move" copy="I’m Krrish — a creative video editor, motion graphics artist and filmmaker based in Jaipur, India." /><section className="page-wrap about-page-grid"><div className="about-big-letter">K<span>.</span></div><div className="about-copy"><span className="eyebrow">THE SHORT VERSION</span><h2>Drawn to the details<br />between the frames.</h2><p>I work across editing, motion and filmmaking, bringing each piece together around what the story needs. From a quick social cut to a more considered film, I care about pace, texture and the feeling that lingers after the screen goes dark.</p><p>Currently studying BCA at Manipal University Jaipur, graduating in {profile.graduation}.</p><Link className="text-link" to="/contact">Have a project in mind? <ArrowUpRight size={15} /></Link></div></section><section className="capabilities-section"><div className="page-wrap section"><SectionHead eyebrow="WHAT I WORK WITH" title="Tools & craft." /><div className="tool-grid">{profile.tools.map((tool, index) => <div key={tool}><span>0{index + 1}</span><h3>{tool}</h3></div>)}</div></div></section><ContactBand /></main>
}

function ContactPage() {
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  async function submit(event) {
    event.preventDefault()
    setStatus('loading'); setMessage('')
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'The message could not be sent right now. Please try again.')
      setStatus('success'); setMessage('Thanks — your message has been accepted. I’ll be in touch soon.'); form.reset()
    } catch (error) { setStatus('error'); setMessage(error.message || 'Connection issue. Please try again.') }
  }
  return <main id="top" className="inner-page"><PageIntro eyebrow="GET IN TOUCH" title="Let’s talk" copy="Have a film, edit or idea you’d like to bring to life? Tell me a little about it." /><section className="page-wrap contact-layout"><div className="contact-aside"><span className="eyebrow">GOOD THINGS START WITH A HELLO</span><p>Share what you’re working on, where you are in the process and what you’re imagining.</p><div className="contact-socials"><span className="eyebrow">OR FIND ME HERE</span><Socials /></div></div><form className="contact-form" onSubmit={submit}>
    <label>Your name <span>*</span><input name="name" autoComplete="name" required maxLength="100" placeholder="Name" /></label>
    <label>Email address <span>*</span><input name="email" type="email" autoComplete="email" required maxLength="254" placeholder="you@example.com" /></label>
    <div className="form-pair"><label>Project type <small>OPTIONAL</small><select name="projectType" defaultValue=""><option value="">Choose a type</option><option>Video editing</option><option>Motion graphics</option><option>Filmmaking</option><option>Other</option></select></label><label>Budget range <small>OPTIONAL</small><select name="budget" defaultValue=""><option value="">Prefer not to say</option><option>Not sure yet</option><option>Let’s discuss</option></select></label></div>
    <label>Tell me about the project <span>*</span><textarea name="message" required minLength="10" maxLength="5000" rows="5" placeholder="A few details about the story, timeline or idea…" /></label>
    <div className="honey-field" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex="-1" autoComplete="off" /></label></div>
    <button className="button button-dark submit-button" disabled={status === 'loading'}>{status === 'loading' ? 'Sending…' : status === 'success' ? <>Message accepted <Check size={17} /></> : <>Send message <ArrowUpRight size={17} /></>}</button>
    <p className={`form-feedback ${status}`} role="status">{message}</p>
    </form></section></main>
}

function NotFound() { return <main id="top" className="not-found page-wrap"><span className="eyebrow">404 · LOST FRAME</span><h1>This page<br />is out of focus<b>.</b></h1><Link className="button button-dark" to="/">Back to home <ArrowLeft size={17} /></Link></main> }

export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('krrish-theme') || 'light' } catch { return 'light' }
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('krrish-theme', theme) } catch { /* Private browsing may disable storage. */ }
  }, [theme])
  const location = useLocation()
  useEffect(() => {
    const project = location.pathname.startsWith('/work/') ? projects.find((item) => item.slug === location.pathname.split('/')[2]) : null
    const titles = { '/': 'Krrish Sharma — Creative Editor & Filmmaker', '/work': 'Selected Work — Krrish Sharma', '/about': 'About — Krrish Sharma', '/contact': 'Contact — Krrish Sharma' }
    const title = project ? `${project.title} — Krrish Sharma` : titles[location.pathname] || 'Krrish Sharma — Creative Portfolio'
    const description = project?.description || 'Krrish Sharma is a freelance video editor, motion graphics artist and filmmaker creating cinematic visual stories.'
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
  }, [location.pathname])
  return <><a className="skip-link" href="#main-content">Skip to content</a><Header theme={theme} onToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} /><div id="main-content"><Routes><Route path="/" element={<Home />} /><Route path="/work" element={<WorkPage />} /><Route path="/work/:slug" element={<ProjectPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="*" element={<NotFound />} /></Routes></div><Footer /></>
}
