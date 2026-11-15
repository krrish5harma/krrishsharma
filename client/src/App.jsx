import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Eye, Github, Instagram, Moon, Sun, Youtube } from 'lucide-react'
import { getCalApi } from '@calcom/embed-react'
import { capabilities, profile, projects } from './data/profile.js'
import PillNav from './components/PillNav.jsx'
import CurvedLoop from './components/CurvedLoop.jsx'
import ShinyText from './components/ShinyText.jsx'

const HERO_CAROUSEL_INTERVAL_MS = 3500

const SideRays = lazy(() => import('./components/SideRays.jsx'))
const CircularGallery = lazy(() => import('./components/CircularGallery.jsx'))

const socials = [
  { label: 'Instagram', href: profile.socials.instagram },
  { label: 'YouTube', href: profile.socials.youtube },
  { label: 'GitHub', href: profile.socials.github },
]

function ActionButton({ as: Element = 'button', children, className = '', radius: _radius, size: _size, style, type = 'button', disabled, ...props }) {
  return <Element
    className={`site-button${className ? ` ${className}` : ''}`}
    style={style}
    type={Element === 'button' ? type : undefined}
    disabled={Element === 'button' ? disabled : undefined}
    {...props}
  >{children}</Element>
}

function ThemeSwitch({ theme, onToggle }) {
  return <ActionButton className="theme-switch" size="sm" radius={999} style={{ padding: '9px 12px', fontSize: 9 }} onClick={onToggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
    <span className="theme-switch-icon">{theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}</span><span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
  </ActionButton>
}

function BookCallButton({ className = '', children = 'Book a call', size = 'sm', style }) {
  return <ActionButton
    className={`book-call-button${className ? ` ${className}` : ''}`}
    size={size}
    radius={999}
    style={{ padding: '10px 13px', fontSize: 9, fontWeight: 700, ...style }}
    data-cal-namespace="15min"
    data-cal-link="krrish-sharma-pnmlzm/15min"
    data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
    aria-label="Book a 15-minute call with Krrish Sharma"
  >{children}<ArrowUpRight size={14} /></ActionButton>
}

function PillAnchor({ href, ...props }) {
  return <a href={href} {...props} />
}

const navigationItems = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

function Header({ theme, onToggle }) {
  return <header className="site-header">
    <div className="site-header-nav"><PillNav logo="/krrish-silhouette.png" logoAlt="Krrish Sharma home" logoHref="#top" items={navigationItems} defaultActiveIndex={-1} linkComponent={PillAnchor} theme={theme} layout="split" itemStyle="pill" hoverEffect="fill" indicator="dot" surface="none" size="sm" highlightColor="#d62839" highlightTextColor="#ffffff" collapse="auto" intro ariaLabel="Main navigation" className="portfolio-pill-nav" /></div>
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
  const items = [1, 2, 3, 4, 5].map((index) => ({
    image: '/krrish-about.jpg',
    video: `/hero%20section%20(${index}).mp4`,
    text: `KRRISH / 0${index}`,
    alt: `Krrish Sharma hero video ${index}`,
    description: `Film ${index} from Krrish Sharma.`,
  }))
  return <div className="hero-video-carousel">
    <Suspense fallback={<div className="gallery-loading"><span className="eyebrow">VIDEO CAROUSEL</span><p>Waiting for your video links.</p></div>}>
      <CircularGallery items={items} bend={2.2} textColor="#ffffff" borderRadius={0.05} scrollEase={0.07} itemSize={0.82} itemAspect={16 / 10} gap={0.24} wave={0.18} fadeEdges={0.11} shadow={0.3} grayscale={false} showTitles font="500 20px 'DM Mono'" scrollSpeed={1.4} autoAdvanceMs={HERO_CAROUSEL_INTERVAL_MS} snap openOnClick intro />
    </Suspense>
    <span className="gallery-note">MUTED PREVIEWS · TAP TO FOCUS · 3.5 SEC AUTO-ADVANCE</span>
  </div>
}

function SiteBackground({ theme }) {
  return <div className="site-background" aria-hidden="true">
    <Suspense fallback={null}><SideRays rayColor1="#6366f1" rayColor2="#ff0000" origin="top-right" speed={2.5} intensity={2.6} spread={1.9} density={5} followMouse lightMode={theme === 'light'} /></Suspense>
  </div>
}

function Hero() {
  return <section className="hero-frame page-shell" id="top">
    <div className="hero-grain" />
    <div className="hero-copy" data-reveal>
      <span className="eyebrow hero-kicker"><i /> INDEPENDENT CREATIVE <b>—</b> JAIPUR, INDIA</span>
      <h1 className="hero-title"><ShinyText text="Krrish" className="title-serif" color="#ffffff" shineColor="#5f00ff" speed={HERO_CAROUSEL_INTERVAL_MS / 1000} shineWidth={100} softness={0.8} trigger="loop" glow={0.9} easing="snappy" pauseOnHover /><span className="title-sans"><ShinyText text="SHARMA" color="#ffffff" shineColor="#5f00ff" speed={HERO_CAROUSEL_INTERVAL_MS / 1000} shineWidth={100} softness={0.8} trigger="loop" glow={0.9} easing="snappy" pauseOnHover /><span className="red-period">.</span></span></h1>
      <div className="hero-description"><span className="hero-role">Video editor<br />& motion artist.</span><p>I shape footage, movement and atmosphere into stories that stay with you.</p></div>
      <div className="hero-education"><span>BASED IN INDIA</span><span>BCA · MANIPAL UNIVERSITY JAIPUR · CLASS OF 2027</span></div>
      <div className="hero-actions"><BookCallButton className="hero-book-call" style={{ minHeight: 48, padding: '0 18px', fontSize: 10, fontWeight: 700 }}>Book a call <ArrowUpRight size={16} /></BookCallButton><a href="#work" className="under-link">Explore the work <ArrowDownRight size={14} /></a></div>
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
      <div className="about-monogram" data-reveal><div className="mono-frame about-portrait-frame"><img src="/krrish-about.jpg" alt="Krrish Sharma standing beside a car" /><i>SHARMA</i><b>↗</b></div><span className="mono-caption">JAIPUR · INDIA<br />26° 54′ N / 75° 48′ E</span></div>
      <div className="about-copy" data-reveal><span className="eyebrow">EDITOR BY INSTINCT · FILMMAKER BY CURIOSITY</span><h2>Every frame<br />has a <em>feeling.</em></h2><p>I’m Krrish, a freelance creative video editor and motion graphics artist. I move between the edit, the camera and the details that make an image feel alive.</p><p>Currently studying BCA at Manipal University Jaipur, graduating in 2027. I enjoy working where cinematic storytelling meets motion and visual polish.</p><a href="#expertise" className="under-link">More about my approach <ArrowUpRight size={14} /></a></div>
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
  return <a href={project.videoUrl || project.thumbnail} target="_blank" rel="noreferrer" className={`work-card ${relative === 0 ? 'is-active' : ''}`} data-reveal aria-hidden={relative !== 0} tabIndex={relative === 0 ? 0 : -1} style={{ '--x': `${relative * 86}%`, '--rot': `${relative * -7}deg`, '--scale': distance ? '.84' : '1', '--card-opacity': distance > 1 ? '.3' : distance ? '.7' : '1', '--card-z': 10 - distance }}><div className="work-card-image"><img src={project.thumbnail} alt={project.title} loading="lazy" /><span className="work-card-count">0{index + 1}</span><span className="work-card-open"><ArrowUpRight /></span><span className="work-card-title">{project.title}</span></div><div className="work-card-meta"><span>{project.category}</span><span>{project.year || 'PROJECT'}</span></div></a>
}

function WorkSection() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches || projects.length < 2) return undefined
    const timer = window.setInterval(() => setActive((index) => (index + 1) % projects.length), 5000)
    return () => window.clearInterval(timer)
  }, [paused])
  const visible = projects
  return <section className="work-section page-shell" id="work">
    <SectionLabel number="04" title="SELECTED WORK" />
    <div className="work-heading"><SectionTitle eyebrow="A FEW THINGS MADE WITH INTENTION">In good<br /><em>company.</em></SectionTitle><a href="#instagram-reels" className="under-link">See featured reels <ArrowUpRight size={14} /></a></div>
    {visible.length ? <div className="work-carousel-wrap" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}>
      <div className="work-carousel">{visible.map((project, index) => { const wrapped = (index - active + visible.length) % visible.length; const relative = wrapped > visible.length / 2 ? wrapped - visible.length : wrapped; return <WorkCard project={project} index={index} relative={relative} key={project.slug} /> })}</div>
      {visible.length > 1 && <div className="work-controls"><ActionButton size="sm" radius={999} style={{ padding: 10 }} aria-label="Previous project" onClick={() => setActive((active - 1 + visible.length) % visible.length)}><ArrowLeft size={16} /></ActionButton><span>{String(active + 1).padStart(2, '0')} <i>/</i> {String(visible.length).padStart(2, '0')}</span><ActionButton size="sm" radius={999} style={{ padding: 10 }} aria-label="Next project" onClick={() => setActive((active + 1) % visible.length)}><ArrowRight size={16} /></ActionButton></div>}
    </div> : <div className="work-empty" data-reveal><div className="empty-number">K<span>/</span>00</div><div><span className="eyebrow">THE REEL IS OPEN</span><h3>Next frame: yours.</h3><p>Selected edits, motion pieces and films will appear here as approved project media is ready.</p><a href={profile.socials.youtube} target="_blank" rel="noreferrer" className="under-link">Watch on YouTube <ArrowUpRight size={14} /></a></div><span className="empty-stamp">NO PLACEHOLDERS<br />AS PORTFOLIO WORK</span></div>}
    <Marquee className="work-marquee">CUT WITH PURPOSE · BUILT AROUND THE STORY · MAKE IT MOVE</Marquee>
  </section>
}

const featuredReels = [
  { code: 'Dd9XWwXTwPa', label: '01', views: 155000 },
  { code: 'DWEPrx7kwCK', label: '02', views: 126000 },
  { code: 'DcoCA0LTpXS', label: '03', views: 70900 },
]

function FeaturedReelsSection() {
  const [activeReel, setActiveReel] = useState(null)
  useEffect(() => {
    if (!activeReel) return undefined
    const onKeyDown = (event) => { if (event.key === 'Escape') setActiveReel(null) }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeReel])

  return <section className="featured-reels-section page-shell" id="instagram-reels">
    <SectionLabel number="05" title="THE REELS THAT TRAVELED" />
    <div className="featured-reels-heading">
      <SectionTitle eyebrow="SELECTED FROM INSTAGRAM">Made to<br /><em>move people.</em></SectionTitle>
      <p data-reveal>Three standout edits. Pick a frame to watch the full reel.</p>
    </div>
    <div className="featured-reels-grid">
      {featuredReels.map(({ code, label, views }) => {
        const reelUrl = `https://www.instagram.com/reel/${code}/`
        const formattedViews = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(views)
        return <article className="featured-reel-card" data-reveal key={code}>
          <button type="button" className="featured-reel-poster" onClick={() => setActiveReel({ code, label, reelUrl })} aria-label={`Play featured Instagram reel ${label}; ${formattedViews} views`}>
            <span className="reel-poster-index">{label}<i> / 03</i></span>
            <span className="reel-poster-mark" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation"><defs><linearGradient id={`instagram-reel-gradient-${label}`} x1="0" y1="1" x2="1" y2="0"><stop stopColor="#feda75" /><stop offset=".48" stopColor="#fa7e1e" /><stop offset="1" stopColor="#d62976" /></linearGradient></defs><rect x="3" y="3" width="18" height="18" rx="5.25" fill="none" stroke={`url(#instagram-reel-gradient-${label})`} strokeWidth="1.6" /><circle cx="12" cy="12" r="4.15" fill="none" stroke={`url(#instagram-reel-gradient-${label})`} strokeWidth="1.6" /><circle cx="17.65" cy="6.45" r="1.05" fill="#d62976" /></svg></span>
            <span className="reel-poster-meta"><i>INSTAGRAM</i><b>FEATURED REEL</b></span>
            <span className="reel-play-mark" aria-hidden="true"><i /></span>
            <span className="reel-poster-bottom"><span><b><Eye size={13} /> {formattedViews} VIEWS</b><i>COUNT · NOV ’26</i></span><ArrowUpRight size={15} /></span>
          </button>
          <a className="featured-reel-link" href={reelUrl} target="_blank" rel="noreferrer"><span>OPEN ON INSTAGRAM</span><ArrowUpRight size={13} /></a>
        </article>
      })}
    </div>
    {activeReel && <div className="reel-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveReel(null) }}>
      <section className="reel-modal" role="dialog" aria-modal="true" aria-label={`Featured Instagram reel ${activeReel.label}`}>
        <div className="reel-modal-heading"><span>INSTAGRAM REEL <i>/ {activeReel.label}</i></span><button type="button" onClick={() => setActiveReel(null)} aria-label="Close reel"><span aria-hidden="true">×</span></button></div>
        <div className="reel-modal-frame"><iframe src={`${activeReel.reelUrl}embed/?theme=dark`} title={`Krrish Sharma Instagram reel ${activeReel.label}`} allow="encrypted-media; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" /></div>
        <a href={activeReel.reelUrl} target="_blank" rel="noreferrer">OPEN IN INSTAGRAM <ArrowUpRight size={13} /></a>
      </section>
    </div>}
  </section>
}

function ContactSection() {
  return <section className="contact-section page-shell" id="contact">
    <SectionLabel number="06" title="LET’S MAKE SOMETHING" />
    <div className="contact-callout" data-reveal><span className="eyebrow">HAVE A STORY IN MIND?</span><h2>Let’s make<br /><em>it move.</em></h2><BookCallButton className="contact-book-call">Book a 15-minute call <ArrowUpRight size={21} /></BookCallButton><div className="contact-stamp">OPEN<br />FOR<br />PROJECTS<span>↗</span></div></div>
  </section>
}

function Footer() {
  return <footer className="site-footer">
    <div className="footer-shell page-shell">
      <div className="footer-top">
        <div className="footer-intro"><a href="#top" className="footer-mark" aria-label="Krrish Sharma, back to top">K<span>.</span></a><p>Independent video editor and motion artist,<br />creating stories that stay with you.</p></div>
        <nav className="footer-column" aria-label="Footer navigation"><span>Explore</span><a href="#work">Selected work</a><a href="#about">About Krrish</a><a href="#expertise">Craft &amp; toolkit</a></nav>
        <div className="footer-column"><span>Find me</span><a href={profile.socials.instagram} target="_blank" rel="noreferrer">Instagram</a><a href={profile.socials.youtube} target="_blank" rel="noreferrer">YouTube</a><a href={profile.socials.github} target="_blank" rel="noreferrer">GitHub</a></div>
        <div className="footer-column footer-location"><span>Based in</span><p>Jaipur, India<br />Available for select projects</p></div>
      </div>
      <div className="footer-feature">
        <div className="footer-feature-head"><span>INDEPENDENT CREATIVE · JAIPUR, INDIA</span><BookCallButton className="footer-feature-cta">Work together</BookCallButton></div>
        <div className="footer-feature-main"><h2>Krrish Sharma<span>.</span></h2><p>Let’s make something<br />worth feeling.</p></div>
        <div className="footer-feature-bottom"><span>Have a story in mind? Let’s talk.</span><div className="footer-socials" aria-label="Social media links"><a href={profile.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={20} /></a><a href={profile.socials.youtube} target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={21} /></a><a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={20} /></a></div></div>
      </div>
      <div className="footer-legal"><span>© {new Date().getFullYear()} Krrish Sharma</span><span>Made with intention</span><a href="#top">Back to top <ArrowUpRight size={13} /></a></div>
    </div>
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
    <img className="intro-loader-fallback" src="/krrish-silhouette.png" alt="Krrish Sharma" />
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
  return <><main id="top"><Hero /><AboutSection /><ExpertiseSection /><WorkSection /><FeaturedReelsSection /><ContactSection /></main>{intro && <IntroLoader onFinish={finishIntro} />}</>
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('krrish-theme-v2')
      return saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    } catch { return 'dark' }
  })
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
    const title = 'Krrish Sharma — Creative Editor & Filmmaker'
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Krrish Sharma is a freelance video editor, motion graphics artist and filmmaker creating cinematic visual stories.')
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
  }, [])
  useEffect(() => {
    const nodes = [...document.querySelectorAll('[data-reveal]')]
    if (!('IntersectionObserver' in window)) { nodes.forEach((node) => node.classList.add('is-visible')); return undefined }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.14 })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
  return <div className="app-shell"><SiteBackground theme={theme} /><a className="skip-link" href="#main-content">Skip to content</a><Header theme={theme} onToggle={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} /><div id="main-content"><Home /></div><Footer /></div>
}
