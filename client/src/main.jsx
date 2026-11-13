import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('Portfolio render error:', error)
  }

  render() {
    if (this.state.hasError) {
      return <main style={{ minHeight: '100vh', padding: '12vh 8vw', background: '#171715', color: '#f5f3ef', fontFamily: 'Manrope, Arial, sans-serif' }}>
        <p style={{ color: '#f05b4d', fontFamily: 'monospace', letterSpacing: '.12em' }}>KRRISH SHARMA / PORTFOLIO</p>
        <h1 style={{ maxWidth: 700, fontSize: 'clamp(48px, 9vw, 104px)', lineHeight: '.95', letterSpacing: '-.08em' }}>This page hit a snag<span style={{ color: '#f05b4d' }}>.</span></h1>
        <p style={{ maxWidth: 480, lineHeight: 1.7, color: '#aaa79f' }}>Reload the page to try again, or head back to the portfolio home.</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: '14px 18px', border: 0, background: '#f05b4d', color: '#171715', fontWeight: 700, cursor: 'pointer' }}>Reload portfolio</button>
      </main>
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode><AppErrorBoundary><BrowserRouter><App /></BrowserRouter></AppErrorBoundary></React.StrictMode>,
)
