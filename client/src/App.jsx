import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, Moon, Sun } from 'lucide-react'
import { getCalApi } from '@calcom/embed-react'
import { capabilities, profile, projects } from './data/profile.js'
import GlassSurface from './components/GlassSurface.jsx'
import PillNav from './components/PillNav.jsx'
import CurvedLoop from './components/CurvedLoop.jsx'
import TechText from './components/TechText.jsx'

const LiquidGlassLogo = lazy(() => import('./components/liquid-glass-logo').then((module) => ({ default: module.LiquidGlassLogo })))
const AeroShards = lazy(() => import('./components/AeroShards.jsx'))
const CircularGallery = lazy(() => import('./components/CircularGallery.jsx'))

const socials = [
  { label: 'Instagram', href: profile.socials.instagram },
  { label: 'YouTube', href: profile.socials.youtube },
  { label: 'GitHub', href: profile.socials.github },
]

function GlassButton({ as: Element = 'button', children, className = '', radius = 14, size: _size, style, type = 'button', disabled, ...props }) {
  return <Element
    className={`glass-button${className ? ` ${className}` : ''}`}
    style={{ '--glass-button-radius': `${radius}px`, ...style }}
    type={Element === 'button' ? type : undefined}
    disabled={Element === 'button' ? disabled : undefined}
    {...props}
  >
    <GlassSurface className="glass-button-surface" width="100%" height="100%" borderRadius={radius} borderWidth={0.1} blur={3} opacity={0.92} displace={0.35} backgroundOpacity={0.12} />
    <span className="glass-button-content">{children}</span>
  </Element>
}

function ThemeSwitch({ theme, onToggle }) {
  return <GlassButton className="theme-switch" size="sm" radius={999} style={{ padding: '9px 12px', fontSize: 9 }} onClick={onToggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
    <span className="theme-switch-icon">{theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}</span><span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
  </GlassButton>
}

function BookCallButton({ className = '', children = 'Book a call', size = 'sm', style }) {
  return <GlassButton
    className={`book-call-button${className ? ` ${className}` : ''}`}
    size={size}
    radius={999}
    style={{ padding: '10px 13px', fontSize: 9, fontWeight: 700, ...style }}
    data-cal-namespace="15min"
    data-cal-link="krrish-sharma-pnmlzm/15min"
    data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
    aria-label="Book a 15-minute call with Krrish Sharma"
  >{children}<ArrowUpRight size={14} /></GlassButton>
}

function RouterPillLink({ href, ...props }) {
  return <Link to={href} {...props} />
}

const navigationItems = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

function Header({ theme, onToggle }) {
  const location = useLocation()
  const activeHref = location.pathname.startsWith('/work') ? '/work' : ['/about', '/contact'].includes(location.pathname) ? location.pathname : undefined
  return <header className="site-header">
    <div className="site-header-nav"><PillNav logo="/krrish-silhouette.png" logoAlt="Krrish Sharma home" logoHref="/" items={navigationItems} activeHref={activeHref} defaultActiveIndex={-1} linkComponent={RouterPillLink} theme={theme} layout="split" itemStyle="pill" hoverEffect="fill" indicator="dot" surface="glass" size="sm" highlightColor="#d62839" highlightTextColor="#ffffff" collapse="auto" intro ariaLabel="Main navigation" className="portfolio-pill-nav" /></div>
    <BookCallButton className="header-book-call" />
    <ThemeSwitch theme={theme} onToggle={onToggle} />
  </header>
}

function SocialLinks({ compact = false }) {
  return <div className={`social-links ${compact ? 'compact' : ''}`}>{socials.map(({ label, href }) => <a key={label} href={href} target="_blank" rel="noreferrer">{label}<ArrowUpRight size={12} /></a>)}</div>
}

function Marquee({ children, className = '' }) {
  return <div className={`marquee ${className}`} aria-label={children}><div className="marquee-track" aria-hidden="true">{Array.from({ length: 4 }, (_, i) => <span key={i}>{children}<b> ✳ </b></span>)}</div></div>
}

function HeroVideoCarousel() {
  const items = [1, 2, 3].map((index) => ({
    image: '/krrish-silhouette.png',
    text: `VIDEO LINK 0${index}`,
    alt: `Placeholder for video ${index}`,
    description: 'Your YouTube video will appear here when you share its link.',
  }))
  return <div className="hero-video-carousel">
    <Suspense fallback={<div className="gallery-loading"><span className="eyebrow">VIDEO CAROUSEL</span><p>Waiting for your video links.</p></div>}>
      <CircularGallery items={items} bend={2.2} textColor="#ffffff" borderRadius={0.05} scrollEase={0.07} itemSize={0.82} itemAspect={16 / 10} gap={0.24} wave={0.18} fadeEdges={0.11} shadow={0.3} grayscale={false} showTitles font="500 20px 'DM Mono'" scrollSpeed={1.4} snap openOnClick={false} intro />
    </Suspense>
    <span className="gallery-note">DRAG TO EXPLORE · VIDEO LINKS PENDING</span>
  </div>
}

function SiteBackground({ theme }) {
  const [failed, setFailed] = useState(false)
  return <div className={`site-background ${failed ? 'has-failed' : ''}`} aria-hidden="true">
    {!failed && <Suspense fallback={null}><AeroShards shardColor="#380000" accentColor="#ff0000" backgroundColor="transparent" lightMode={theme === 'light'} placement="full" material="glass" markers="plus" count={1300} depthOfField={0.48} vignette={0.3} mouseInteraction pulseOnClick holdToGather speed={1.21} scale={1.11} grain={0.12} parallax={0.76} onError={(error) => { console.error('AeroShards WebGPU fallback:', error); setFailed(true) }} /></Suspense>}
    {failed && <AeroShardsFallback theme={theme} />}
  </div>
}

function AeroShardsFallback({ theme }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const random = (seed) => { const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return value - Math.floor(value) }
    const shards = Array.from({ length: 260 }, (_, index) => ({
      x: random(index + 1), y: random(index + 301), size: 5 + random(index + 701) * 30,
      angle: random(index + 1001) * Math.PI * 2, sides: 3 + Math.floor(random(index + 1401) * 3),
      speed: 0.06 + random(index + 1701) * 0.22, depth: 0.12 + random(index + 2001) * 0.3,
      phase: random(index + 2301) * Math.PI * 2,
    }))
    const pulses = []
    const pointer = { x: -1000, y: -1000, down: false }
    let frame = 0
    let width = 1
    let height = 1
    let dpr = 1
    let start = performance.now()
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, rect.width); height = Math.max(1, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(performance.now())
    }
    const draw = (now) => {
      const elapsed = reducedMotion ? 0 : (now - start) / 1000
      context.clearRect(0, 0, width, height)
      const dark = theme !== 'light'
      for (const shard of shards) {
        const drift = elapsed * shard.speed
        const x = ((shard.x * width + drift * width * 0.12 + 30) % (width + 60)) - 30
        const y = shard.y * height + Math.sin(elapsed * 0.42 + shard.phase) * shard.size * 0.42
        const dx = x - pointer.x, dy = y - pointer.y
        const distance = Math.hypot(dx, dy)
        const near = Math.max(0, 1 - distance / 240)
        const size = shard.size * (1 + near * 0.26)
        const alpha = 0.22 + shard.depth * (dark ? 1.15 : 0.72) + near * 0.28
        context.save()
        context.translate(x + (pointer.x > -500 ? dx * near * 0.025 : 0), y + (pointer.y > -500 ? dy * near * 0.025 : 0))
        context.rotate(shard.angle + elapsed * shard.speed * 0.18)
        context.beginPath()
        for (let side = 0; side < shard.sides; side++) {
          const angle = side * Math.PI * 2 / shard.sides
          const radius = size * (0.58 + random(side + Math.round(shard.phase * 100)) * 0.5)
          const px = Math.cos(angle) * radius, py = Math.sin(angle) * radius
          if (side === 0) context.moveTo(px, py); else context.lineTo(px, py)
        }
        context.closePath()
        context.fillStyle = dark ? `rgba(56,0,0,${alpha * 0.52})` : `rgba(56,0,0,${alpha * 0.28})`
        context.strokeStyle = `rgba(255,0,0,${Math.min(0.88, alpha * 1.1 + near * 0.28)})`
        context.lineWidth = 0.9 + near * 0.8
        context.shadowColor = 'rgba(255,0,0,.55)'
        context.shadowBlur = 2 + near * 8
        context.fill(); context.stroke()
        context.restore()
      }
      for (const pulse of pulses) {
        const age = elapsed - pulse.time
        const radius = age * 260
        context.beginPath(); context.arc(pulse.x, pulse.y, radius, 0, Math.PI * 2)
        context.strokeStyle = `rgba(255,0,0,${Math.max(0, 0.52 * (1 - age / 1.25))})`
        context.lineWidth = 2; context.stroke()
      }
      while (pulses.length && elapsed - pulses[0].time > 1.25) pulses.shift()
      if (!reducedMotion || pulses.length) frame = requestAnimationFrame(draw)
    }
    const onMove = (event) => { pointer.x = event.clientX; pointer.y = event.clientY }
    const onDown = (event) => {
      if (reducedMotion) return
      if (event.target.closest?.('a,button,input,textarea,select,[role="button"]')) return
      pointer.down = true
      pulses.push({ x: event.clientX, y: event.clientY, time: (performance.now() - start) / 1000 })
      if (!frame) frame = requestAnimationFrame(draw)
    }
    const onUp = () => { pointer.down = false }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    resize()
    return () => {
      cancelAnimationFrame(frame); observer.disconnect()
      window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerdown', onDown); window.removeEventListener('pointerup', onUp)
    }
  }, [theme])
  return <canvas ref={canvasRef} className="aero-shards-fallback" />
}

function Hero() {
  return <section className="hero-frame page-shell" id="top">
    <div className="hero-grain" />
    <div className="hero-copy" data-reveal>
      <span className="eyebrow hero-kicker"><i /> INDEPENDENT CREATIVE <b>—</b> JAIPUR, INDIA</span>
      <h1 className="hero-title tech-hero-title" aria-label="Krrish Sharma"><span className="sr-only">Krrish Sharma</span><TechText className="tech-hero-line tech-hero-serif" text="Krrish" fontFamily="'Instrument Serif', Georgia, serif" fontWeight={400} fontSize={150} letterSpacing={-0.04} align="left" color="currentColor" accentColor="#d62839" reveal="letter" dashLength={4} dashGap={2} specks={15} intro="none" clickKick guides={false} /><span className="tech-hero-line tech-hero-sans"><TechText text="SHARMA" fontFamily="Manrope, Arial, sans-serif" fontWeight={800} fontSize={120} letterSpacing={-0.08} align="left" color="currentColor" accentColor="#d62839" reveal="letter" dashLength={4} dashGap={2} specks={15} intro="none" clickKick guides={false} /></span><span className="red-period tech-hero-period">.</span></h1>
      <div className="hero-description"><span className="hero-role">Video editor<br />& motion artist.</span><p>I shape footage, movement and atmosphere into stories that stay with you.</p></div>
      <div className="hero-education"><span>BASED IN INDIA</span><span>BCA · MANIPAL UNIVERSITY JAIPUR · CLASS OF 2027</span></div>
      <div className="hero-actions"><BookCallButton className="hero-book-call" style={{ minHeight: 48, padding: '0 18px', fontSize: 10, fontWeight: 700 }}>Book a call <ArrowUpRight size={16} /></BookCallButton><Link to="/work" className="under-link">Explore the work <ArrowDownRight size={14} /></Link></div>
      <SocialLinks compact />
    </div>
    <div className="hero-visual" data-reveal><div className="visual-index"><span>VIDEO / 01</span><span>YOUR REEL</span></div><HeroVideoCarousel /></div>
    <a className="scroll-cue" href="#about"><span className="scroll-line" /><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
  </section>
}

function SectionLabel({ number, title }) {
  return <div className="section-label"><span>{number} / 08</span><span>{title}</span><i /></div>
}

function SectionTitle({ eyebrow, children, className = '' }) {
  return <div className={`section-title ${className}`} data-reveal><span className="eyebrow">{eyebrow}</span><h2>{children}</h2></div>
}

function AboutSection() {
  return <section className="about-section page-shell" id="about">
    <SectionLabel number="02" title="A LITTLE ABOUT ME" />
    <div className="about-layout">
      <div className="about-monogram" data-reveal><div className="mono-frame"><span>K</span><i>SHARMA</i><b>↗</b></div><span className="mono-caption">JAIPUR · INDIA<br />26° 54′ N / 75° 48′ E</span></div>
      <div className="about-copy" data-reveal><span className="eyebrow">EDITOR BY INSTINCT · FILMMAKER BY CURIOSITY</span><h2>Every frame<br />has a <em>feeling.</em></h2><p>I’m Krrish, a freelance creative video editor and motion graphics artist. I move between the edit, the camera and the details that make an image feel alive.</p><p>Currently studying BCA at Manipal University Jaipur, graduating in 2027. I enjoy working where cinematic storytelling meets motion and visual polish.</p><Link to="/about" className="under-link">More about my approach <ArrowUpRight size={14} /></Link></div>
    </div>
    <Marquee className="skills-marquee">VIDEO EDITING · MOTION DESIGN · CINEMATOGRAPHY · FILMMAKING</Marquee>
  </section>
}

function ExpertiseSection() {
  return <section className="expertise-section page-shell" id="expertise">
    <SectionLabel number="03" title="CRAFT & TOOLKIT" />
    <div className="expertise-heading"><SectionTitle eyebrow="THE THINGS I BRING TO THE FRAME">Crafted in<br /><em>the edit.</em></SectionTitle><p data-reveal>From the first cut to the final grade, each part of the process should serve the story.</p></div>
    <div className="expertise-grid">{capabilities.map((item, index) => <article className="expertise-card" data-reveal key={item.number}><span className="expertise-number">{item.number}</span><span className="expertise-symbol">{['✳', '◈', '⌁', '⊹'][index]}</span><h3>{item.title}</h3><p>{item.detail}</p><span className="expertise-line" /></article>)}</div>
    <div className="tools-loop" data-reveal><span className="eyebrow">SKILLS &amp; TOOLS</span><CurvedLoop className="skills-loop-text" marqueeText={profile.tools.join('     ')} shape="wave" speed={0.7} curveAmount={54} direction="left" fontSize={44} fontWeight={500} letterSpacing={1.4} separator="✦" separatorColor="var(--red-hot)" color="var(--ink)" scrollBoost={0.25} edgeFade={0.12} interactive pauseOnHover /></div>
  </section>
}

function WorkCard({ project, index, relative }) {
  const distance = Math.abs(relative)
  return <Link to={`/work/${project.slug}`} className={`work-card ${relative === 0 ? 'is-active' : ''}`} data-reveal aria-hidden={relative !== 0} tabIndex={relative === 0 ? 0 : -1} style={{ '--x': `${relative * 86}%`, '--rot': `${relative * -7}deg`, '--scale': distance ? '.84' : '1', '--card-opacity': distance > 1 ? '.3' : distance ? '.7' : '1', '--card-z': 10 - distance }}><div className="work-card-image"><img src={project.thumbnail} alt={project.title} loading="lazy" /><span className="work-card-count">0{index + 1}</span><span className="work-card-open"><ArrowUpRight /></span><span className="work-card-title">{project.title}</span></div><div className="work-card-meta"><span>{project.category}</span><span>{project.year || 'PROJECT'}</span></div></Link>
}

function WorkSection({ standalone = false }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches || projects.length < 2) return undefined
    const timer = window.setInterval(() => setActive((index) => (index + 1) % projects.length), 5000)
    return () => window.clearInterval(timer)
  }, [paused])
  const categories = ['All', ...new Set(projects.map((project) => project.category))]
  const [filter, setFilter] = useState('All')
  const visible = filter === 'All' ? projects : projects.filter((project) => project.category === filter)
  useEffect(() => setActive(0), [filter])
  return <section className={`work-section page-shell ${standalone ? 'work-page-section' : ''}`} id="work">
    <SectionLabel number="04" title="SELECTED WORK" />
    <div className="work-heading"><SectionTitle eyebrow="A FEW THINGS MADE WITH INTENTION">In good<br /><em>company.</em></SectionTitle>{!standalone && <Link to="/work" className="under-link">View the full reel <ArrowUpRight size={14} /></Link>}</div>
    {standalone && <div className="work-filters" role="group" aria-label="Filter work by category">{categories.map((category) => <GlassButton size="sm" radius={999} className={filter === category ? 'active' : ''} style={{ padding: '9px 14px', fontSize: 9 }} onClick={() => setFilter(category)} key={category}>{category}</GlassButton>)}</div>}
    {visible.length ? <div className="work-carousel-wrap" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}>
      <div className="work-carousel">{visible.map((project, index) => { const wrapped = (index - active + visible.length) % visible.length; const relative = wrapped > visible.length / 2 ? wrapped - visible.length : wrapped; return <WorkCard project={project} index={index} relative={relative} key={project.slug} /> })}</div>
      {visible.length > 1 && <div className="work-controls"><GlassButton size="sm" radius={999} style={{ padding: 10 }} aria-label="Previous project" onClick={() => setActive((active - 1 + visible.length) % visible.length)}><ArrowLeft size={16} /></GlassButton><span>{String(active + 1).padStart(2, '0')} <i>/</i> {String(visible.length).padStart(2, '0')}</span><GlassButton size="sm" radius={999} style={{ padding: 10 }} aria-label="Next project" onClick={() => setActive((active + 1) % visible.length)}><ArrowRight size={16} /></GlassButton></div>}
    </div> : <div className="work-empty" data-reveal><div className="empty-number">K<span>/</span>00</div><div><span className="eyebrow">THE REEL IS OPEN</span><h3>Next frame: yours.</h3><p>Selected edits, motion pieces and films will appear here as approved project media is ready.</p><a href={profile.socials.youtube} target="_blank" rel="noreferrer" className="under-link">Watch on YouTube <ArrowUpRight size={14} /></a></div><span className="empty-stamp">NO PLACEHOLDERS<br />AS PORTFOLIO WORK</span></div>}
    <Marquee className="work-marquee">CUT WITH PURPOSE · BUILT AROUND THE STORY · MAKE IT MOVE</Marquee>
  </section>
}

function ExperimentsSection() {
  const notes = [
    { mark: 'A', label: 'PACE', title: 'Let it breathe.', text: 'A quiet beat can hit harder than another cut.' },
    { mark: 'B', label: 'MOVEMENT', title: 'Earn the motion.', text: 'Movement works best when it carries the story forward.' },
    { mark: 'C', label: 'TEXTURE', title: 'Finish with feeling.', text: 'Sound, tone and detail shape what stays in the frame.' },
  ]
  return <section className="experiments-section page-shell">
    <SectionLabel number="05" title="NOTES FROM THE EDIT" />
    <div className="experiments-heading"><SectionTitle eyebrow="QUESTIONS I KEEP COMING BACK TO">The detail<br />in <em>between.</em></SectionTitle><p data-reveal>Small creative questions shape the bigger feeling. These are a few that keep me curious.</p></div>
    <div className="experiments-grid">{notes.map((note) => <article className="experiment-note" data-reveal key={note.mark}><span>{note.mark} / {note.label}</span><h3>{note.title}</h3><p>{note.text}</p><i>✳</i></article>)}</div>
  </section>
}

function JourneySection() {
  return <section className="journey-section page-shell">
    <SectionLabel number="06" title="THE JOURNEY SO FAR" />
    <div className="journey-layout"><SectionTitle eyebrow="STILL LEARNING · ALWAYS MAKING">In progress<br /><em>by design.</em></SectionTitle><div className="timeline"><div className="timeline-item" data-reveal><span>NOW</span><div><h3>Independent creative</h3><p>Video editing · Motion graphics · Filmmaking</p></div><i /></div><div className="timeline-item" data-reveal><span>2027</span><div><h3>BCA · Manipal University Jaipur</h3><p>Expected graduation</p></div><i /></div></div></div>
  </section>
}

function ContactSection() {
  return <section className="contact-section page-shell" id="contact">
    <SectionLabel number="07" title="LET’S MAKE SOMETHING" />
    <div className="contact-callout" data-reveal><span className="eyebrow">HAVE A STORY IN MIND?</span><h2>Let’s make<br /><em>it move.</em></h2><GlassButton as={Link} to="/contact" className="button button-cream" size="sm" radius={10} style={{ minHeight: 48, padding: '0 18px', fontSize: 10, fontWeight: 700 }}>Tell me about it <ArrowUpRight size={16} /></GlassButton><div className="contact-stamp">OPEN<br />FOR<br />PROJECTS<span>↗</span></div></div>
  </section>
}

function Footer() {
  return <footer className="site-footer">
    <div className="footer-top page-shell"><span className="eyebrow">08 / 08 · INDEPENDENT CREATIVE · JAIPUR, INDIA</span><div className="footer-actions"><BookCallButton className="footer-book-call">Book a 15-minute call</BookCallButton><SocialLinks /></div></div>
    <Marquee className="signature-marquee">KRRISH SHARMA</Marquee>
    <div className="footer-bottom page-shell"><Link to="/" className="footer-mini-brand">K<span>.</span>SHARMA</Link><span>© {new Date().getFullYear()} · MADE WITH INTENTION</span><div><Link to="/work">WORK</Link><Link to="/about">ABOUT</Link><Link to="/contact">CONTACT</Link></div><a href="#top" className="back-top" aria-label="Back to top"><ArrowUpRight size={17} /></a></div>
  </footer>
}

function IntroLoader({ onFinish }) {
  const [exiting, setExiting] = useState(false)
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const exitTimer = window.setTimeout(() => setExiting(true), reducedMotion ? 250 : 2050)
    const finishTimer = window.setTimeout(onFinish, reducedMotion ? 700 : 2600)
    return () => { window.clearTimeout(exitTimer); window.clearTimeout(finishTimer) }
  }, [onFinish])
  return <div className={`intro-loader ${exiting ? 'is-exiting' : ''}`} aria-label="Krrish Sharma portfolio loading" aria-live="polite">
    <Suspense fallback={<img className="intro-loader-fallback" src="/krrish-silhouette.png" alt="Krrish Sharma" />}>
      <LiquidGlassLogo logo="/krrish-silhouette.png" ending="logo" depth={2.9} theme="dark" background="#000000" style={{ height: 480 }} aria-label="Krrish Sharma" />
    </Suspense>
  </div>
}

function Home() {
  const [intro, setIntro] = useState(() => {
    try { return !sessionStorage.getItem('krrish-intro-seen') } catch { return true }
  })
  const finishIntro = () => {
    try { sessionStorage.setItem('krrish-intro-seen', '1') } catch { /* Storage can be disabled. */ }
    setIntro(false)
  }
  return <><main id="top"><Hero /><AboutSection /><ExpertiseSection /><WorkSection /><ExperimentsSection /><JourneySection /><ContactSection /></main>{intro && <IntroLoader onFinish={finishIntro} />}</>
}

function PageIntro({ eyebrow, title, children }) {
  return <div className="page-intro page-shell" data-reveal><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{children && <p>{children}</p>}</div>
}

function WorkPage() {
  return <main id="top" className="inner-page"><PageIntro eyebrow="THE PORTFOLIO / 04" title={<>Selected<br /><em>work.</em></>}>A collection of edits, motion pieces and films shaped around the story.</PageIntro><WorkSection standalone /><ContactSection /></main>
}

function ProjectPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)
  if (!project) return <main id="top" className="not-found page-shell"><span className="eyebrow">PROJECT / NOT FOUND</span><h1>That frame<br /><em>is missing.</em></h1><GlassButton as={Link} className="button button-red" to="/work" size="sm" radius={10} style={{ minHeight: 48, padding: '0 18px', fontSize: 10, fontWeight: 700 }}>Back to work <ArrowLeft size={15} /></GlassButton></main>
  return <main id="top" className="project-detail page-shell"><Link className="under-link" to="/work"><ArrowLeft size={14} /> Back to work</Link><span className="eyebrow">{project.category}</span><h1>{project.title}<span>.</span></h1><div className="detail-media">{project.videoUrl ? <video controls playsInline preload="none" poster={project.thumbnail}><source src={project.videoUrl} /></video> : <img src={project.thumbnail} alt={project.title} />}</div><p>{project.description}</p><div className="detail-facts">{project.role && <span>ROLE / {project.role}</span>}{project.year && <span>YEAR / {project.year}</span>}{project.tools?.length && <span>TOOLS / {project.tools.join(' · ')}</span>}</div></main>
}

function AboutPage() {
  return <main id="top" className="inner-page"><PageIntro eyebrow="ABOUT / 02" title={<>Krrish<br /><em>Sharma.</em></>}>Freelance creative video editor, motion graphics artist and filmmaker in Jaipur, India.</PageIntro><AboutSection /><ExpertiseSection /><JourneySection /><ContactSection /></main>
}

function ContactPage() {
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')
  async function submit(event) {
    event.preventDefault(); setStatus('loading'); setFeedback('')
    const form = event.currentTarget
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Your message could not be sent. Please try again.')
      setStatus('success'); setFeedback('Thanks — your message has been accepted.'); form.reset()
    } catch (error) { setStatus('error'); setFeedback(error.message || 'Connection issue. Please try again.') }
  }
  return <main id="top" className="inner-page"><PageIntro eyebrow="CONTACT / 07" title={<>Let’s make<br /><em>something.</em></>}>Have a film, edit or idea you want to bring to life? Tell me a little about it.</PageIntro><section className="contact-page page-shell"><div className="contact-page-intro"><span className="eyebrow">A GOOD PLACE TO START</span><p>Share what you’re working on, where you are in the process and what you’re imagining.</p><SocialLinks /></div><form className="contact-form" onSubmit={submit}><label>Your name <b>*</b><input name="name" autoComplete="name" required maxLength="100" placeholder="Name" /></label><label>Email address <b>*</b><input name="email" type="email" autoComplete="email" required maxLength="254" placeholder="you@example.com" /></label><div className="form-row"><label>Project type <small>OPTIONAL</small><select name="projectType" defaultValue=""><option value="">Choose a type</option><option>Video editing</option><option>Motion graphics</option><option>Filmmaking</option><option>Other</option></select></label><label>Budget range <small>OPTIONAL</small><select name="budget" defaultValue=""><option value="">Prefer not to say</option><option>Not sure yet</option><option>Let’s discuss</option></select></label></div><label>Project brief <b>*</b><textarea name="message" required minLength="10" maxLength="5000" rows="5" placeholder="A few details about the story, timing or idea…" /></label><div className="honeypot" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex="-1" autoComplete="off" /></label></div><GlassButton className="button button-red" type="submit" size="sm" radius={10} style={{ minHeight: 48, padding: '0 18px', fontSize: 10, fontWeight: 700 }} disabled={status === 'loading'}>{status === 'loading' ? 'Sending…' : status === 'success' ? <>Message accepted <Check size={16} /></> : <>Send the brief <ArrowUpRight size={16} /></>}</GlassButton><p className={`form-feedback ${status}`} role="status">{feedback}</p></form></section></main>
}

function NotFound() { return <main id="top" className="not-found page-shell"><span className="eyebrow">404 / LOST FRAME</span><h1>This page<br /><em>is out of focus.</em></h1><GlassButton as={Link} className="button button-red" to="/" size="sm" radius={10} style={{ minHeight: 48, padding: '0 18px', fontSize: 10, fontWeight: 700 }}>Back to home <ArrowLeft size={15} /></GlassButton></main> }

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('krrish-theme-v2')
      return saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    } catch { return 'dark' }
  })
  const location = useLocation()
  useEffect(() => {
    let mounted = true
    void (async () => {
      try {
        const cal = await getCalApi({ namespace: '15min' })
        if (mounted) cal('ui', { hideEventTypeDetails: false, layout: 'month_view' })
      } catch {
        // The booking buttons retain their direct Cal.com links if the embed cannot initialize.
      }
    })()
    return () => { mounted = false }
  }, [])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('krrish-theme-v2', theme) } catch { /* Storage may be unavailable in private browsing. */ }
  }, [theme])
  useEffect(() => {
    const project = location.pathname.startsWith('/work/') ? projects.find((item) => item.slug === location.pathname.split('/')[2]) : null
    const titles = { '/': 'Krrish Sharma — Creative Editor & Filmmaker', '/work': 'Selected Work — Krrish Sharma', '/about': 'About — Krrish Sharma', '/contact': 'Contact — Krrish Sharma' }
    const title = project ? `${project.title} — Krrish Sharma` : titles[location.pathname] || 'Krrish Sharma — Creative Portfolio'
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', project?.description || 'Krrish Sharma is a freelance video editor, motion graphics artist and filmmaker creating cinematic visual stories.')
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
  }, [location.pathname])
  useEffect(() => {
    const nodes = [...document.querySelectorAll('[data-reveal]')]
    if (!('IntersectionObserver' in window)) { nodes.forEach((node) => node.classList.add('is-visible')); return undefined }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.14 })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [location.pathname])
  return <div className="app-shell"><SiteBackground theme={theme} /><a className="skip-link" href="#main-content">Skip to content</a><Header theme={theme} onToggle={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} /><div id="main-content"><Routes><Route path="/" element={<Home />} /><Route path="/work" element={<WorkPage />} /><Route path="/work/:slug" element={<ProjectPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="*" element={<NotFound />} /></Routes></div><Footer /></div>
}
