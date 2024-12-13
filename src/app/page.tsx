import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import smol1 from '@/assets/images/smol1.png'
import smol2 from '@/assets/images/smol2.png'
import smol3 from '@/assets/images/smol3.png'
import smol4 from '@/assets/images/smol4.png'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  baseX: number
  baseY: number
  density: number
  color: string
}

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Particle[]>([])
  const hueRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particlesRef.current = []
      const numberOfParticles = (canvas.width * canvas.height) / 15000
      
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2 + 1
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const hue = Math.random() * 60 - 30 // Range of -30 to 30
        const color = `hsl(${200 + hue}, 70%, 60%)`
        
        particlesRef.current.push({
          x,
          y,
          size,
          baseX: x,
          baseY: y,
          density: (Math.random() * 30) + 1,
          color
        })
      }
    }

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.fillStyle = 'rgba(245, 245, 245, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      hueRef.current = (hueRef.current + 0.5) % 360

      particlesRef.current.forEach((particle) => {
        let dx = mouseRef.current.x - particle.x
        let dy = mouseRef.current.y - particle.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        let forceDirectionX = dx / distance
        let forceDirectionY = dy / distance
        let maxDistance = 100
        let force = (maxDistance - distance) / maxDistance
        let directionX = forceDirectionX * force * particle.density
        let directionY = forceDirectionY * force * particle.density

        if (distance < maxDistance) {
          // Push particles away from cursor
          particle.x -= directionX
          particle.y -= directionY
        } else {
          // Return to original position
          if (particle.x !== particle.baseX) {
            dx = particle.x - particle.baseX
            particle.x -= dx / 10
          }
          if (particle.y !== particle.baseY) {
            dy = particle.y - particle.baseY
            particle.y -= dy / 10
          }
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Draw connections
        particlesRef.current.forEach((otherParticle) => {
          const dist = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) +
            Math.pow(particle.y - otherParticle.y, 2)
          )
          if (dist < 50) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(100, 149, 237, ${0.2 * (1 - dist / 50)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      }
    }

    // Initialize
    updateCanvasSize()
    animate()

    // Event listeners
    window.addEventListener('resize', updateCanvasSize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      {/* Interactive Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Main Content */}
      <main className="relative flex-grow flex flex-col lg:flex-row items-center max-w-[1400px] mx-auto w-full px-6 xl:px-8" style={{ zIndex: 2 }}>
        {/* Content */}
        <div className="relative z-10 lg:w-[45%] space-y-10 py-12 lg:py-24">
          <div className="relative">
            <h1 className="text-7xl md:text-8xl xl:text-[120px] font-black leading-[0.9] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]">
              Smol<br />Mart
            </h1>
          </div>
          
          <p className="text-xl xl:text-2xl text-[#555] max-w-xl leading-relaxed">
            Where miniature masterpieces meet colossal creativity. Join the revolution of pocket-sized digital art that's making a massive impact.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/80 backdrop-blur-sm border-2 border-[#333] text-[#333] placeholder-[#999] h-12 text-lg flex-grow"
            />
            <Button className="bg-[#333] hover:bg-[#555] text-white font-bold transition-all duration-300 transform hover:scale-105 h-12 text-lg px-8 whitespace-nowrap">
              Join Waitlist
            </Button>
          </div>

          <div className="flex items-center space-x-8 text-sm text-[#666]">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Exclusive Access</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Limited Collection</span>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="relative lg:w-[55%] flex items-center justify-center lg:justify-end h-full py-12 pb-16 lg:py-24">
          <div className="relative z-10 grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 transform rotate-6 w-full max-w-[500px] mx-auto px-4">
            {[
              { src: smol1, alt: 'Smol NFT 1' },
              { src: smol2, alt: 'Smol NFT 2' },
              { src: smol3, alt: 'Smol NFT 3' },
              { src: smol4, alt: 'Smol NFT 4' },
            ].map((image, i) => (
              <div 
                key={i} 
                className="group relative w-40 h-40 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:rotate-0 hover:z-20"
                style={{ 
                  animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <div className="absolute inset-0 shadow-inner opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative bg-[#333]/90 backdrop-blur-md text-white py-24 px-6 xl:px-8" style={{ zIndex: 2 }}>
        <div className="relative max-w-[1400px] mx-auto px-4 xl:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Unique Artwork",
                description: "Each piece is a one-of-a-kind digital masterpiece, crafted with passion and precision.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Limited Collection",
                description: "Join an exclusive community of collectors owning truly rare digital assets.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )
              },
              {
                title: "Exclusive Community",
                description: "Connect with fellow collectors and artists in our vibrant, creative ecosystem.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              }
            ].map((feature, i) => (
              <div key={i} className="bg-[#2a2a2a]/80 backdrop-blur-sm rounded-xl p-10 transition-transform duration-300 hover:-translate-y-2">
                <div className="text-[#999] mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-[#999] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f0f0f0]/80 backdrop-blur-sm py-8 px-6 xl:px-8" style={{ zIndex: 2 }}>
        <div className="max-w-[1400px] mx-auto px-4 xl:px-0 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#555] mb-4 md:mb-0">&copy; 2024 Smol Mart. All rights reserved.</p>
          <div className="flex space-x-4">
            <Button variant="outline" className="border-2 border-[#333] text-[#333] hover:bg-[#333] hover:text-white transition-all duration-300 transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              Twitter
            </Button>
            <Button variant="outline" className="border-2 border-[#333] text-[#333] hover:bg-[#333] hover:text-white transition-all duration-300 transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              Discord
            </Button>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}

