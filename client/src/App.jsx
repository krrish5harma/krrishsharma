import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowUpRight, BriefcaseBusiness, CalendarDays, Eye, Github, Instagram, Mail, Moon, Sun, UserRound, X, Youtube } from 'lucide-react'
import { getCalApi } from '@calcom/embed-react'
import { capabilities, profile } from './data/profile.js'
import PillNav from './components/PillNav.jsx'
import CurvedLoop from './components/CurvedLoop.jsx'
import ShinyText from './components/ShinyText.jsx'

const HERO_CAROUSEL_INTERVAL_MS = 3500

const SideRays = lazy(() => import('./components/SideRays.jsx'))
const CircularGallery = lazy(() => import('./components/CircularGallery.jsx'))
const CircularCarousel = lazy(() => import('./components/CircularCarousel.jsx'))

const socials = [
  { label: 'Instagram', href: profile.socials.instagram, Icon: Instagram },
  { label: 'GitHub', href: profile.socials.github, Icon: Github },
  { label: 'YouTube', href: profile.socials.youtube, Icon: Youtube },
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
  return <ActionButton className="theme-switch" size="md" radius={999} style={{ padding: '10px 14px' }} onClick={onToggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
    <span className="theme-switch-icon" aria-hidden="true">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</span><span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
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
  ><CalendarDays size={16} aria-hidden="true" />{children}<ArrowUpRight size={16} aria-hidden="true" /></ActionButton>
}

function PillAnchor({ href, ...props }) {
  return <a href={href} {...props} />
}

const navigationItems = [
  { label: 'Work', href: '#work', icon: <BriefcaseBusiness aria-hidden="true" /> },
  { label: 'About', href: '#about', icon: <UserRound aria-hidden="true" /> },
  { label: 'Contact', href: '#contact', icon: <Mail aria-hidden="true" /> },
]

function Header({ theme, onToggle }) {
  return <header className="site-header">
    <div className="site-header-nav"><PillNav logo="/krrish-silhouette.png" logoAlt="Krrish Sharma home" logoHref="#top" items={navigationItems} defaultActiveIndex={-1} linkComponent={PillAnchor} theme={theme} layout="split" itemStyle="pill" hoverEffect="fill" indicator="dot" surface="none" size="md" highlightColor="#d62839" highlightTextColor="#ffffff" collapse="auto" intro ariaLabel="Main navigation" className="portfolio-pill-nav" /></div>
    <BookCallButton className="header-book-call" />
    <ThemeSwitch theme={theme} onToggle={onToggle} />
  </header>
}

function SocialLinks({ compact = false, className = '', showArrow = true }) {
  return <div className={`social-links ${compact ? 'compact' : ''}${className ? ` ${className}` : ''}`}>{socials.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer"><Icon className="social-icon" size={14} aria-hidden="true" /><span>{label}</span>{showArrow && <ArrowUpRight size={12} aria-hidden="true" />}</a>)}</div>
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
      <div className="hero-actions"><BookCallButton className="hero-book-call" style={{ minHeight: 48, padding: '0 18px', fontSize: 10, fontWeight: 700 }}>Book a call</BookCallButton><a href="#work" className="under-link">Explore the work <ArrowDownRight size={14} /></a></div>
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
    <div className="tools-loop skills-display" data-reveal><span className="eyebrow">SKILLS &amp; TOOLS</span><CurvedLoop className="skills-loop-text" marqueeText={profile.tools.join('     ')} shape="wave" speed={0.7} curveAmount={54} direction="left" fontSize={44} fontWeight={500} letterSpacing={1.4} separator="✦" separatorColor="var(--red-hot)" color="var(--ink)" scrollBoost={0.25} edgeFade={0.12} interactive pauseOnHover /></div>
  </section>
}

function ExpertiseSection() {
  return <section className="expertise-section page-shell" id="expertise">
    <SectionLabel number="03" title="CRAFT & TOOLKIT" />
    <div className="expertise-heading"><SectionTitle eyebrow="THE THINGS I BRING TO THE FRAME">Crafted in<br /><em>the edit.</em></SectionTitle><p data-reveal>From the first cut to the final grade, each part of the process should serve the story.</p></div>
    <div className="expertise-grid">{capabilities.map((item, index) => <article className="expertise-card" data-reveal key={item.number}><span className="expertise-number">{item.number}</span><span className="expertise-symbol">{['✳', '◈', '⌁', '⊹'][index]}</span><h3>{item.title}</h3><p>{item.detail}</p><span className="expertise-line" /></article>)}</div>
  </section>
}

// A single paused Vimeo player warms on hover/press; no carousel videos autoplay.
const workVideos = [
  { id: '01', title: 'Velocity edit for a German fashion brand', embedUrl: 'https://player.vimeo.com/video/1247151590?autopause=0&player_id=0&app_id=58479', overlayText: 'Velocity edit · German fashion brand', views: null },
  { id: '02', title: 'Velocity edit for a German client', embedUrl: 'https://player.vimeo.com/video/1247151562?autopause=0&player_id=0&app_id=58479', overlayText: 'Velocity edit · German client', orientation: 'landscape', aspectRatio: '16 / 9', views: null },
  { id: '03', title: 'Velocity edit for a gym client', embedUrl: 'https://player.vimeo.com/video/1247151506?autopause=0&player_id=0&app_id=58479', overlayText: 'Velocity edit · Gym client', views: null },
  { id: '04', title: '3D camera animation for a client', embedUrl: 'https://player.vimeo.com/video/1247151497?autopause=0&player_id=0&app_id=58479', overlayText: '3D camera animation · Client project', views: null },
  { id: '05', title: 'University fest content creation and edit', embedUrl: 'https://player.vimeo.com/video/1247151493?autopause=0&player_id=0&app_id=58479', overlayText: 'University fest · Creator, velocity edit & videography', views: 126000 },
  { id: '06', title: 'Velocity edit for an energy drink company', embedUrl: 'https://player.vimeo.com/video/1247151491?autopause=0&player_id=0&app_id=58479', overlayText: 'Velocity edit · Energy drink campaign', orientation: 'landscape', aspectRatio: '16 / 9', views: null },
  { id: '07', title: 'Videography and fast-paced edit for a travel company', embedUrl: 'https://player.vimeo.com/video/1247151415?autopause=0&player_id=0&app_id=58479', overlayText: 'Travel company · Videography & fast-paced edit', orientation: 'landscape', aspectRatio: '4 / 3', views: null },
  { id: '08', title: 'Content creation and edit for a dubstep campaign', embedUrl: 'https://player.vimeo.com/video/1247151416?autopause=0&player_id=0&app_id=58479', overlayText: 'Dubstep campaign · Content creation & edit', orientation: 'landscape', aspectRatio: '16 / 9', views: null },
  { id: '09', title: 'Red Bull event F1 pit stop content creation', embedUrl: 'https://player.vimeo.com/video/1247151414?autopause=0&player_id=0&app_id=58479', overlayText: 'Red Bull F1 pit stop · Event media team', views: 161000 },
  { id: '10', title: 'University Dandiya event content creation and edit', embedUrl: 'https://player.vimeo.com/video/1247151417?autopause=0&player_id=0&app_id=58479', overlayText: 'University Dandiya event · Executive committee', orientation: 'landscape', aspectRatio: '16 / 9', views: null },
]

const workThumbnails = {
  '01': 'https://i.vimeocdn.com/video/2226833485-edf41f00641ed2bfb182ce2ba2c960199e037c471e3ee28abaf6887d116e1547-d_640x1138?region=us',
  '02': 'https://i.vimeocdn.com/video/2226833464-921d6904ada53d84ee49e93cde93be9a011e5ea3a5880268512cc5ca8d52be4e-d_640x360?region=us',
  '03': 'https://i.vimeocdn.com/video/2226833364-a4448d34e63d246c6e514d21b702f91c8ef8648b10b921266a7bd7825bab55f9-d_640x1138?region=us',
  '04': 'https://i.vimeocdn.com/video/2226833529-7ec8217c91f43b48bef585735511aaa8eff74e7aff6ccd3293ad11ae7a3afe0a-d_640x1138?region=us',
  '05': 'https://i.vimeocdn.com/video/2226833385-361a195f90072a7ba1d4b9533adad4da445e3155e9c35f1ff76b9960d4845be3-d_640x1138?region=us',
  '06': 'https://i.vimeocdn.com/video/2226833771-166065f639114bd4fd712f7e989b7d05af49a781d847fbf848dc9cbab6ee5ed2-d_640x360?region=us',
  '07': 'https://i.vimeocdn.com/video/2226833263-804dbdcbc6a49666025aebf83c228b0bdb24152a46b7cbcb57c97722dcc9240f-d_640x480?region=us',
  '08': 'https://i.vimeocdn.com/video/2226833264-aed028a93f5cf7b3e17db02081ddcbb6418d7368353b9e794f2bd79eb3de4429-d_640x360?region=us',
  '09': 'https://i.vimeocdn.com/video/2226833273-c3a20a6f4cec5c3cf7893e64bec00a1ae76fdbedaf0669c9219eb11d1cb7356f-d_640x1138?region=us',
  '10': 'https://i.vimeocdn.com/video/2226833269-cda70d8e4a921725a23e452d86e0f4d6de7de5853d64f92412ffc7519e229fb7-d_640x360?region=us',
}
const workCarouselItems = workVideos.map((item) => ({
  ...item,
  src: workThumbnails[item.id],
  alt: `${item.title} video thumbnail`,
  subtitle: item.views ? `${item.overlayText} · ${new Intl.NumberFormat('en', { notation: 'compact' }).format(item.views)} views` : item.overlayText,
}))

function getVimeoAutoplayUrl(embedUrl, autoplay, controls = false, playerId = 'portfolio-work') {
  if (!embedUrl) return ''
  try {
    const source = new URL(embedUrl)
    const id = source.pathname.match(/(?:video\/)?(\d+)/)?.[1]
    const player = source.hostname === 'player.vimeo.com' && id
      ? source
      : id ? new URL(`https://player.vimeo.com/video/${id}`) : null
    if (!player) return ''
    const privacyHash = source.searchParams.get('h')
    if (privacyHash && !player.searchParams.has('h')) player.searchParams.set('h', privacyHash)
    player.searchParams.set('autoplay', autoplay ? '1' : '0')
    player.searchParams.set('muted', '1')
    player.searchParams.set('loop', '1')
    player.searchParams.set('autopause', '0')
    player.searchParams.set('playsinline', '1')
    player.searchParams.set('controls', controls ? '1' : '0')
    player.searchParams.set('title', '0')
    player.searchParams.set('byline', '0')
    player.searchParams.set('portrait', '0')
    player.searchParams.set('dnt', '1')
    player.searchParams.set('api', '1')
    player.searchParams.set('player_id', playerId)
    return player.toString()
  } catch {
    return ''
  }
}

let vimeoSdkPromise

function loadVimeoSdk() {
  if (window.Vimeo?.Player) return Promise.resolve(window.Vimeo.Player)
  if (vimeoSdkPromise) return vimeoSdkPromise

  vimeoSdkPromise = new Promise((resolve) => {
    const existingScript = document.querySelector('script[data-vimeo-player-sdk]')
    const script = existingScript || document.createElement('script')
    const finish = () => resolve(window.Vimeo?.Player || null)
    script.addEventListener('load', finish, { once: true })
    script.addEventListener('error', finish, { once: true })
    if (!existingScript) {
      script.src = 'https://player.vimeo.com/api/player.js'
      script.async = true
      script.dataset.vimeoPlayerSdk = 'true'
      document.head.appendChild(script)
    }
  })

  return vimeoSdkPromise
}

function WorkSection() {
  const workSectionRef = useRef(null)
  const closeViewerRef = useRef(null)
  const playerIframeRef = useRef(null)
  const vimeoPlayerRef = useRef(null)
  const pendingPlayRef = useRef(null)
  const reuseWarmPlayerRef = useRef(false)
  const warmTimerRef = useRef(null)
  const hoveredVideoIdRef = useRef(null)
  const [activeVideo, setActiveVideo] = useState(null)
  const [warmVideo, setWarmVideo] = useState(null)
  const [readyVideoId, setReadyVideoId] = useState(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const playerVideo = activeVideo || warmVideo
  const iframeMode = !activeVideo || reuseWarmPlayerRef.current ? 'warm' : 'autoplay'
  const playerIsReady = Boolean(playerVideo && readyVideoId === playerVideo.id)

  const closeWorkVideo = () => {
    pendingPlayRef.current = null
    reuseWarmPlayerRef.current = false
    setActiveVideo(null)
    setWarmVideo(null)
    setReadyVideoId(null)
    hoveredVideoIdRef.current = null
  }

  useEffect(() => {
    const section = workSectionRef.current
    if (!section || !('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      loadVimeoSdk()
      observer.disconnect()
    }, { rootMargin: '650px 0px' })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!activeVideo) return undefined
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => closeViewerRef.current?.focus(), 0)
    const onKeyDown = (event) => { if (event.key === 'Escape') closeWorkVideo() }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus?.()
    }
  }, [activeVideo])

  useEffect(() => {
    if (!playerVideo) return undefined
    let cancelled = false
    let player = null
    setReadyVideoId(null)

    loadVimeoSdk().then((Player) => {
      if (cancelled || !Player || !playerIframeRef.current) return
      player = new Player(playerIframeRef.current)
      player.ready().then(() => {
        if (cancelled) return
        vimeoPlayerRef.current = player
        setReadyVideoId(playerVideo.id)
        if (pendingPlayRef.current === playerVideo.id) {
          pendingPlayRef.current = null
          player.play().catch(() => {})
        }
      }).catch(() => {})
    })

    return () => {
      cancelled = true
      if (vimeoPlayerRef.current === player) vimeoPlayerRef.current = null
      player?.destroy().catch(() => {})
    }
  }, [playerVideo?.id, iframeMode])

  useEffect(() => {
    if (!activeVideo || activeVideo.id !== warmVideo?.id) return
    const player = vimeoPlayerRef.current
    if (!player) {
      pendingPlayRef.current = activeVideo.id
      return
    }
    player.play().catch(() => {})
  }, [activeVideo, warmVideo])

  useEffect(() => () => window.clearTimeout(warmTimerRef.current), [])

  const scheduleVideoWarmup = (event) => {
    const card = event.target.closest?.('[data-cc-index]')
    if (!card) return
    const video = workVideos[Number(card.getAttribute('data-cc-index'))]
    if (!video || video.id === hoveredVideoIdRef.current) return
    hoveredVideoIdRef.current = video.id
    window.clearTimeout(warmTimerRef.current)
    warmTimerRef.current = window.setTimeout(() => setWarmVideo(video), 120)
  }

  const warmVideoOnPress = (event) => {
    const card = event.target.closest?.('[data-cc-index]')
    if (!card) return
    const video = workVideos[Number(card.getAttribute('data-cc-index'))]
    if (!video) return
    window.clearTimeout(warmTimerRef.current)
    hoveredVideoIdRef.current = video.id
    setWarmVideo(video)
  }

  const openWorkVideo = (item) => {
    const selectedVideo = workVideos.find((video) => video.id === item.id)
    if (!selectedVideo) return
    const canReuseWarmPlayer = warmVideo?.id === selectedVideo.id
      && readyVideoId === selectedVideo.id
      && Boolean(vimeoPlayerRef.current)
    reuseWarmPlayerRef.current = canReuseWarmPlayer
    if (!canReuseWarmPlayer) {
      setWarmVideo(null)
      setReadyVideoId(null)
    }
    pendingPlayRef.current = canReuseWarmPlayer ? selectedVideo.id : null
    setActiveVideo(selectedVideo)
  }

  return <section ref={workSectionRef} className="work-section page-shell" id="work">
    <SectionLabel number="04" title="SELECTED WORK" />
    <div className="work-heading"><SectionTitle eyebrow="A FEW THINGS MADE WITH INTENTION">Stories in<br /><em>motion.</em></SectionTitle><span className="work-vimeo-note">10 FILMS · DRAG THE RING TO EXPLORE</span></div>
    <div className="work-circular-stage" onPointerMove={scheduleVideoWarmup} onPointerDown={warmVideoOnPress} onPointerLeave={() => { hoveredVideoIdRef.current = null }} onFocusCapture={() => setWarmVideo(workVideos[carouselIndex])}>
      <Suspense fallback={<div className="gallery-loading work-carousel-loading"><span className="eyebrow">SELECTED WORK</span><p>Preparing the video reel…</p></div>}>
        <CircularCarousel
          items={workCarouselItems}
          preset="cylinder"
          intro="rise"
          cardWidth={420}
          aspectRatio={1}
          speed={11}
          captions
          gap={48}
          perspective={3200}
          momentum={0.3}
          autoplay={activeVideo ? 'off' : 'drift'}
          direction="left"
          draggable
          snap
          pauseOnHover
          focusOnClick
          fadeColor="var(--bg)"
          cornerRadius={18}
          innerShade={0.5}
          onChange={setCarouselIndex}
          onItemClick={openWorkVideo}
        />
      </Suspense>
    </div>
    <p className="work-marquee-hint">DRAG OR SCROLL TO BROWSE <span>·</span> SELECT A FILM TO WATCH</p>
    {playerVideo && <div className={activeVideo ? 'work-viewer-backdrop' : 'work-player-prewarm'} onMouseDown={(event) => { if (activeVideo && event.target === event.currentTarget) closeWorkVideo() }} onContextMenu={(event) => event.preventDefault()} aria-hidden={!activeVideo}>
      <section className={`work-viewer${activeVideo ? '' : ' work-viewer-prewarm'}`} role={activeVideo ? 'dialog' : undefined} aria-modal={activeVideo ? 'true' : undefined} aria-labelledby={activeVideo ? 'work-viewer-title' : undefined} onContextMenu={(event) => event.preventDefault()}>
        {activeVideo && <header className="work-viewer-header"><div><span>SELECTED WORK / {activeVideo.id}</span><h2 id="work-viewer-title">{activeVideo.title}</h2></div><button ref={closeViewerRef} type="button" className="work-viewer-close" onClick={closeWorkVideo} aria-label="Close full screen video"><X size={20} /></button></header>}
        <div className={`work-viewer-stage is-${playerVideo.orientation || 'portrait'}${activeVideo && !playerIsReady ? ' is-loading' : ''}`} style={{ '--viewer-aspect': playerVideo.aspectRatio || (playerVideo.orientation === 'landscape' ? '16 / 9' : '9 / 16') }} onContextMenu={(event) => event.preventDefault()}>
          {activeVideo && !playerIsReady && <><img className="work-viewer-poster" src={workThumbnails[activeVideo.id]} alt="" /><span className="work-viewer-loading" role="status">Opening film…</span></>}
          <iframe key={`${playerVideo.id}-${activeVideo ? iframeMode : 'warm'}`} ref={playerIframeRef} onLoad={() => setReadyVideoId(playerVideo.id)} src={getVimeoAutoplayUrl(playerVideo.embedUrl, Boolean(activeVideo && !reuseWarmPlayerRef.current), true, `portfolio-work-${playerVideo.id}`)} title={playerVideo.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" tabIndex={activeVideo ? 0 : -1} />
        </div>
        {activeVideo && <footer className="work-viewer-footer"><p>{activeVideo.overlayText}</p>{Number.isFinite(activeVideo.views) && <span><Eye size={14} aria-hidden="true" />{new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(activeVideo.views)} views</span>}</footer>}
      </section>
    </div>}
  </section>
}
const featuredReels = [
  { code: 'Dd9XWwXTwPa', label: '01', views: 161000, thumbnail: '/images/reels/redbull-f1-event.png' },
  { code: 'DWEPrx7kwCK', label: '02', views: 126000, thumbnail: '/images/reels/oniros-college-fest.png' },
  { code: 'DcoCA0LTpXS', label: '03', views: 71000, thumbnail: '/images/reels/manipal-fest.png' },
]

function FeaturedReelsSection() {
  const [activeReel, setActiveReel] = useState(null)

  return <section className="featured-reels-section page-shell" id="instagram-reels">
    <SectionLabel number="05" title="THE REELS THAT TRAVELED" />
    <div className="featured-reels-heading">
      <SectionTitle eyebrow="SELECTED FROM INSTAGRAM">Made to<br /><em>move people.</em></SectionTitle>
      <p data-reveal>Three standout edits. Pick a frame to watch the full reel.</p>
    </div>
    <div className="featured-reels-grid">
      {featuredReels.map(({ code, label, views, thumbnail }) => {
        const reelUrl = `https://www.instagram.com/reel/${code}/`
        const formattedViews = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(views)
        return <article className="featured-reel-card" data-reveal key={code}>
          {activeReel === code
            ? <div className="featured-reel-live">
              <div className="featured-reel-live-head"><span><Instagram size={14} /> INSTAGRAM / {label}</span><button type="button" onClick={() => setActiveReel(null)} aria-label={`Close Instagram reel ${label}`}><X size={16} /></button></div>
              <div className="featured-reel-live-frame"><iframe src={`${reelUrl}embed/?theme=dark`} title={`Krrish Sharma Instagram reel ${label}`} allow="encrypted-media; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" /></div>
            </div>
            : <button type="button" className="featured-reel-poster" onClick={() => setActiveReel(code)} aria-label={`Play featured Instagram reel ${label}; ${formattedViews} views`}>
              <img className="reel-thumbnail" src={thumbnail} alt="" loading="lazy" decoding="async" />
              <span className="reel-poster-index">{label}<i> / 03</i></span>
              <span className="reel-play-mark" aria-hidden="true"><i /></span>
            </button>}
          <a className="featured-reel-link" href={reelUrl} target="_blank" rel="noreferrer"><span>OPEN ON INSTAGRAM</span><ArrowUpRight size={13} /></a>
        </article>
      })}
    </div>
  </section>
}

function ContactSection() {
  return <section className="contact-section page-shell" id="contact">
    <SectionLabel number="06" title="LET’S MAKE SOMETHING" />
    <div className="contact-callout" data-reveal><span className="eyebrow">HAVE A STORY IN MIND?</span><h2>Let’s make<br /><em>it move.</em></h2><BookCallButton className="contact-book-call">Book a 15-minute call</BookCallButton><div className="contact-stamp">OPEN<br />FOR<br />PROJECTS<span>↗</span></div></div>
  </section>
}

function Footer() {
  return <footer className="site-footer">
    <div className="footer-shell page-shell">
      <div className="footer-top">
        <div className="footer-intro"><a href="#top" className="footer-mark" aria-label="Krrish Sharma, back to top">K<span>.</span></a><p>Independent video editor and motion artist,<br />creating stories that stay with you.</p></div>
        <nav className="footer-column" aria-label="Footer navigation"><span>Explore</span><a href="#work">Selected work</a><a href="#about">About Krrish</a><a href="#expertise">Craft &amp; toolkit</a></nav>
        <nav className="footer-column" aria-label="Get in touch"><span>Connect</span><a href="#contact">Book a conversation</a><a href="#contact">Start a project</a></nav>
        <div className="footer-column footer-location"><span>Based in</span><p>Jaipur, India<br />Available for select projects</p></div>
      </div>
      <div className="footer-feature">
        <div className="footer-feature-head"><span>INDEPENDENT CREATIVE · JAIPUR, INDIA</span><BookCallButton className="footer-feature-cta">Work together</BookCallButton></div>
        <div className="footer-feature-main"><h2>Krrish Sharma<span>.</span></h2><p>Let’s make something<br />worth feeling.</p></div>
        <div className="footer-feature-bottom"><span>Have a story in mind? Let’s talk.</span><SocialLinks compact className="footer-social-links" showArrow={false} /></div>
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
