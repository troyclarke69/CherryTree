import { useEffect, useRef } from 'react'

type SplashPageProps = {
  onEnter: () => void
}

type Hotspot = {
  id: string
  text: string
  startTime: number
  endTime: number
  x: number
  y: number
}

const HOTSPOT_DATA: Hotspot[] = [
//   { id: 'link-1', text: 'Begin the experience', startTime: 9.0, endTime: 15.0, x: 20.0, y: 20.0 },
//   { id: 'link-2', text: 'See our work', startTime: 16.5, endTime: 26.0, x: 65.0, y: 70.0 },
  { id: 'link-3', text: 'Enter site', startTime: 12.0, endTime: 999.0, x: 75.0, y: 15.0 },
]

export default function SplashPage({ onEnter }: SplashPageProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const flashRef = useRef<HTMLDivElement | null>(null)
  const activeNodes = useRef(new Map<string, HTMLAnchorElement>())
  const enteredRef = useRef(false)
  const transitionTimer = useRef<number | null>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const video = videoRef.current
    const image = imageRef.current
    const overlay = overlayRef.current
    const flash = flashRef.current

    if (!wrapper || !video || !image || !overlay || !flash) {
      return undefined
    }

    const recalcTypography = () => {
      const width = wrapper.getBoundingClientRect().width
      const size = Math.max(11, Math.min(22, width * 0.0165))
      activeNodes.current.forEach((node) => {
        node.style.fontSize = `${size}px`
        node.style.padding = `${size * 0.5}px ${size * 1.1}px`
        node.style.borderRadius = `${size * 0.4}px`
      })
    }

    const purgeLink = (id: string) => {
      activeNodes.current.get(id)?.remove()
      activeNodes.current.delete(id)
    }

    const injectLink = (item: Hotspot) => {
      const link = document.createElement('a')
      link.id = item.id
      link.href = '#'
      link.className = 'interactive-link loaded'
      link.innerText = item.text
      link.style.left = `${item.x}%`
      link.style.top = `${item.y}%`
      link.addEventListener('click', (event) => {
        event.preventDefault()
        if (!enteredRef.current) {
          enteredRef.current = true
          onEnter()
        }
      })

      overlay.appendChild(link)
      activeNodes.current.set(item.id, link)
      recalcTypography()
    }

    const evaluateTimeline = () => {
      const currentTime = video.currentTime
      HOTSPOT_DATA.forEach((item) => {
        const visible = currentTime >= item.startTime && currentTime <= item.endTime
        if (visible && !activeNodes.current.has(item.id)) {
          injectLink(item)
        } else if (!visible && activeNodes.current.has(item.id)) {
          purgeLink(item.id)
        }
      })
    }

    const markEntered = () => {
      if (enteredRef.current) {
        return
      }
      enteredRef.current = true
      transitionTimer.current = window.setTimeout(onEnter, 200)
    }

    const executeHandoff = () => {
      flash.classList.add('flash-active')

      setTimeout(() => {
        video.classList.replace('visible', 'hidden')
        image.classList.replace('hidden', 'visible')
        activeNodes.current.forEach((_, id) => {
          const hotspot = HOTSPOT_DATA.find((item) => item.id === id)
          if (hotspot && hotspot.endTime <= video.duration) {
            purgeLink(id)
          }
        })
      }, 100)

      setTimeout(() => {
        HOTSPOT_DATA.forEach((item) => {
          if (item.endTime >= video.duration && !activeNodes.current.has(item.id)) {
            injectLink(item)
          }
        })
      }, 600)

      markEntered()
    }

    video.addEventListener('timeupdate', evaluateTimeline)
    video.addEventListener('ended', executeHandoff)
    window.addEventListener('resize', recalcTypography)

    recalcTypography()

    return () => {
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current)
      }
      video.removeEventListener('timeupdate', evaluateTimeline)
      video.removeEventListener('ended', executeHandoff)
      window.removeEventListener('resize', recalcTypography)
      activeNodes.current.forEach((node) => node.remove())
      activeNodes.current.clear()
    }
  }, [onEnter])

  return (
    <div className="splash-screen">
      <div className="interactive-wrapper" ref={wrapperRef}>
        <video
          ref={videoRef}
          className="media-asset visible"
          src="/video/CT-1.mp4"
          playsInline
          muted
          autoPlay
        />
        <img
          ref={imageRef}
          className="media-asset hidden"
          src="/images/dark-blue.png"
          alt="Freeze Frame Background"
        />
        <div className="flash-layer" ref={flashRef} />
        <div className="overlay-layer" ref={overlayRef} />
      </div>
    </div>
  )
}
