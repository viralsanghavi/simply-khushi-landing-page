"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Sparkles } from "lucide-react"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface SpinWheelProps {
  isOpen: boolean
  onClose: () => void
}

export function SpinWheel({ isOpen, onClose }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false)
  const [hasSpun, setHasSpun] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [wonPrize, setWonPrize] = useState("")
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", note: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const wheelRef = useRef<HTMLDivElement>(null)

  const prizes = [
    "Follow us & get 10% off",
    "Fridge magnet + 10% off",
    "Flat 10% off",
    "Write a note for a stranger & get 10% off",
  ]

  const colors = ["#FFC83D", "#F4B6C2", "#BFD7EA", "#A8C3A0"]

  const spinWheel = () => {
    if (spinning || hasSpun) return

    setSpinning(true)

    // Deterministic prize selection before animation
    const selectedIndex = Math.floor(Math.random() * prizes.length)
    const degreePerSlice = 360 / prizes.length
    const targetDegree = 360 - (selectedIndex * degreePerSlice + degreePerSlice / 2)
    const spinRevolutions = 5
    const totalRotation = spinRevolutions * 360 + targetDegree

    setWonPrize(prizes[selectedIndex])
    setRotation(totalRotation)

    // Announce to screen readers
    setTimeout(() => {
      const announcement = document.createElement("div")
      announcement.setAttribute("role", "status")
      announcement.setAttribute("aria-live", "polite")
      announcement.className = "sr-only"
      announcement.textContent = `You won: ${prizes[selectedIndex]}`
      document.body.appendChild(announcement)
      setTimeout(() => document.body.removeChild(announcement), 1000)
    }, 3000)

    setTimeout(() => {
      setSpinning(false)
      setHasSpun(true)
      setTimeout(() => setShowForm(true), 800)
    }, 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    const spinData = {
      prize: wonPrize,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      note: formData.note.trim(),
      timestamp: new Date().toISOString(),
      hasCompleted: true,
    }

    try {
      const writePromise = addDoc(collection(db, "spin_entries"), {
        ...spinData,
        createdAt: serverTimestamp(),
      })
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore write timed out")), 8000),
      )

      await Promise.race([writePromise, timeoutPromise])
      localStorage.setItem("simplykhushi_spin", JSON.stringify(spinData))
      setShowSuccess(true)
    } catch (error) {
      console.error("Spin form submission failed", error)
      setSubmitError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Enter" && !hasSpun && !spinning) {
        spinWheel()
      }
    }
    window.addEventListener("keypress", handleKeyPress)
    return () => window.removeEventListener("keypress", handleKeyPress)
  }, [isOpen, hasSpun, spinning])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {showSuccess && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 32 }).map((_, index) => (
                <span
                  key={index}
                  className="absolute top-0 h-3 w-2 rounded-sm opacity-90 animate-[confetti-fall_3.5s_linear_infinite]"
                  style={{
                    left: `${(index * 100) / 32}%`,
                    backgroundColor: ["#FFC83D", "#F4B6C2", "#BFD7EA", "#A8C3A0"][index % 4],
                    animationDelay: `${(index % 8) * 0.2}s`,
                    animationDuration: `${3 + (index % 5) * 0.4}s`,
                    transform: `rotate(${index * 15}deg)`,
                  }}
                />
              ))}
            </div>
          )}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 0 : 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.98, y: prefersReducedMotion ? 0 : 8 }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-20 flex items-center justify-center"
            >
              <div className="mx-auto w-full max-w-sm rounded-3xl border border-border/60 bg-background px-8 py-7 text-center shadow-2xl">
                <p className="font-display text-2xl tracking-wide text-foreground">Show this at the counter and claim your offer</p>
                <Button
                  onClick={onClose}
                  size="lg"
                  className="mt-6 w-full h-12 text-base font-normal bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-foreground shadow-lg hover:shadow-xl transition-all"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 0 : 20 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg bg-background rounded-3xl border border-border/50 shadow-2xl overflow-hidden"
            aria-hidden={showSuccess}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <div className="p-10 space-y-8">
              <AnimatePresence mode="wait">
                {!showForm ? (
                  <motion.div
                    key="wheel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.1 : 0.4 }}
                    className="space-y-8"
                  >
                    {/* Header */}
                    <div className="text-center space-y-3">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: prefersReducedMotion ? 0 : 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 mb-2"
                      >
                        <Sparkles className="h-8 w-8 text-primary" strokeWidth={1.5} />
                      </motion.div>
                      <h2 className="font-display text-4xl tracking-[0.02em] leading-tight text-foreground">
                        {!hasSpun ? "Spin & Win" : "You Won!"}
                      </h2>
                      <p className="text-muted-foreground font-light text-balance leading-relaxed">
                        {!hasSpun ? "Spin to reveal your exclusive offer" : `You've won: ${wonPrize}`}
                      </p>
                    </div>

                    {/* Wheel */}
                    <div className="relative mx-auto w-72 h-72 flex items-center justify-center">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-2xl opacity-50" />

                      {/* Pointer */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                        <motion.div
                          animate={spinning ? { y: [0, 3, 0] } : {}}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.3 }}
                          className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[20px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg"
                        />
                      </div>

                      {/* Wheel SVG */}
                      <div ref={wheelRef} className="relative w-full h-full">
                        <motion.svg
                          className="w-full h-full drop-shadow-2xl"
                          viewBox="0 0 100 100"
                          aria-label="Prize wheel"
                          style={{
                            transformOrigin: "50% 50%",
                            transformBox: "fill-box",
                          }}
                          animate={{ rotate: rotation }}
                          transition={
                            spinning
                              ? { duration: 3, ease: [0.17, 0.67, 0.3, 0.99] }
                              : { duration: 0 }
                          }
                        >
                          {/* Outer ring */}
                          <circle cx="50" cy="50" r="49" fill="white" stroke="#E5E7EB" strokeWidth="0.5" />

                          {prizes.map((prize, index) => {
                            const angle = (360 / prizes.length) * index - 90
                            const nextAngle = (360 / prizes.length) * (index + 1) - 90
                            const startX = 50 + 48 * Math.cos((angle * Math.PI) / 180)
                            const startY = 50 + 48 * Math.sin((angle * Math.PI) / 180)
                            const endX = 50 + 48 * Math.cos((nextAngle * Math.PI) / 180)
                            const endY = 50 + 48 * Math.sin((nextAngle * Math.PI) / 180)
                            const textAngle = angle + 360 / prizes.length / 2

                            return (
                              <g key={index}>
                                <path
                                  d={`M 50 50 L ${startX} ${startY} A 48 48 0 0 1 ${endX} ${endY} Z`}
                                  fill={colors[index]}
                                  stroke="white"
                                  strokeWidth="0.3"
                                  opacity="0.9"
                                />
                                <text
                                  x="50"
                                  y="50"
                                  fill="#2B2B2B"
                                  fontSize="3"
                                  fontWeight="400"
                                  textAnchor="middle"
                                  transform={`rotate(${textAngle} 50 50) translate(0 -30)`}
                                >
                                  {prize.split(" ").map((word, i) => (
                                    <tspan key={i} x="50" dy={i === 0 ? 0 : 3.5}>
                                      {word}
                                    </tspan>
                                  ))}
                                </text>
                              </g>
                            )
                          })}

                          {/* Center button */}
                          <circle cx="50" cy="50" r="12" fill="url(#centerGradient)" filter="url(#shadow)" />
                          <defs>
                            <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#FFC83D" />
                              <stop offset="100%" stopColor="#F4B6C2" />
                            </linearGradient>
                            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
                            </filter>
                          </defs>
                          <text x="50" y="52" fill="white" fontSize="5" fontWeight="600" textAnchor="middle">
                            SPIN
                          </text>
                        </motion.svg>
                      </div>
                    </div>

                    {/* Spin Button */}
                    {!hasSpun && (
                      <motion.div
                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: prefersReducedMotion ? 0 : 0.3 }}
                      >
                        <Button
                          onClick={spinWheel}
                          disabled={spinning}
                          size="lg"
                          className="w-full h-14 text-base font-normal bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-foreground shadow-lg hover:shadow-xl transition-all focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          {spinning ? "Spinning..." : "Spin the Wheel"}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-3 font-light">
                          One spin per visitor
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
                    transition={{ duration: prefersReducedMotion ? 0.1 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6"
                  >
                    {/* Prize reveal */}
                    <div className="text-center space-y-4">
                      <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 px-6 py-4 border border-primary/20"
                      >
                        <Sparkles className="h-6 w-6 text-primary" strokeWidth={1.5} />
                        <span className="font-display text-2xl tracking-wide text-foreground">{wonPrize}</span>
                      </motion.div>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed">
                        Enter your details to claim your exclusive offer
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <motion.div
                        initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: prefersReducedMotion ? 0 : 0.1 }}
                        className="space-y-2"
                      >
                        <label htmlFor="name" className="text-sm font-normal text-foreground">
                          Name
                        </label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="h-12 rounded-xl border-border focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: prefersReducedMotion ? 0 : 0.2 }}
                        className="space-y-2"
                      >
                        <label htmlFor="email" className="text-sm font-normal text-foreground">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="h-12 rounded-xl border-border focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: prefersReducedMotion ? 0 : 0.3 }}
                        className="space-y-2"
                      >
                        <label htmlFor="phone" className="text-sm font-normal text-foreground">
                          Phone
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 xxxxx xxxxx"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          className="h-12 rounded-xl border-border focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: prefersReducedMotion ? 0 : 0.35 }}
                        className="space-y-2"
                      >
                        <label htmlFor="note" className="text-sm font-normal text-foreground">
                          Note
                        </label>
                        <Textarea
                          id="note"
                          placeholder="Add a note for us"
                          value={formData.note}
                          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                          className="min-h-24 rounded-xl border-border focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: prefersReducedMotion ? 0 : 0.4 }}
                      >
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          size="lg"
                          className="w-full h-14 text-base font-normal bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-foreground shadow-lg hover:shadow-xl transition-all"
                        >
                          {isSubmitting ? "Claiming..." : "Claim My Offer"}
                        </Button>
                        {submitError && (
                          <p className="mt-3 text-sm text-destructive" role="alert">
                            {submitError}
                          </p>
                        )}
                      </motion.div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          {showSuccess && (
            <style jsx global>{`
              @keyframes confetti-fall {
                0% {
                  transform: translateY(-10%) rotate(0deg);
                }
                100% {
                  transform: translateY(120vh) rotate(360deg);
                }
              }
            `}</style>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
