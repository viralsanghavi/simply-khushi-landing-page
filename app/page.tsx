"use client"

import { useState, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Sparkles, Phone, Mail, Instagram, MessageCircle } from "lucide-react"
import { SpinWheel } from "@/components/spin-wheel"

export default function Home() {
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSpinWheelOpen(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const fadeIn = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0.2 : 0.8, ease: [0.22, 1, 0.36, 1] },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <SpinWheel isOpen={isSpinWheelOpen} onClose={() => setIsSpinWheelOpen(false)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="mx-auto max-w-4xl px-6 py-20 lg:py-32">
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="text-center space-y-8">
            <motion.div variants={fadeIn} className="flex justify-center">
              <img
                src="/images/gift-simplykhushi.png"
                alt="SimplyKhushi"
                className="h-32 w-32 sm:h-40 sm:w-40 object-contain"
              />
            </motion.div>

            <motion.div variants={fadeIn}>
              <p className="text-xl text-muted-foreground font-light tracking-wide text-balance">
                Gifts that curate joys and meaningful connections
              </p>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={fadeIn} className="space-y-6 pt-4">
              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.15] tracking-wide text-foreground text-balance">
                Thoughtful gifts
                <span className="block mt-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  delivered with love
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty font-light">
                Wellness products, corporate gifting, curated hampers, personalised products designed to bring{" "}
                <span className="text-foreground font-medium">#Simplykhushi</span> everyday
              </p>
            </motion.div>

            {/* Decorative element */}
            <motion.div variants={fadeIn} className="flex items-center justify-center gap-2 py-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
              <Sparkles className="h-5 w-5 text-primary" strokeWidth={1.5} />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Collections Section - subtle background tone shift */}
      <section className="mx-auto max-w-6xl px-6 py-24 bg-white">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.8 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl tracking-wide text-foreground">Collections</h2>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            Discover our thoughtfully curated offerings
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 1, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[
            {
              title: "In-house Wellness Products",
              description:
                "Journals, diaries, self-love kits, and wellness products, all thoughtfully created and curated by a certified counsellor, focused on best self-care practices and emotional well-being.",
              img: "/images/wellness-gifting.jpg",
              color: "wellness",
            },
            {
              title: "Corporate Gifting",
              description:
                "Corporate gifting of all kinds, ranging from simple corporate diaries to fully curated gift solutions tailored to the needs, culture, and values of the company.",
              img: "/images/corporate-gifting.jpg",
              color: "primary",
            },
            {
              title: "Personalised Products",
              description:
                "Personalised frames, desk standees, and custom keepsakes that work as meaningful individual gifts and can also be adapted seamlessly for corporate environments.",
              img: "/images/personalized-gifting.jpg",
              color: "secondary",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: prefersReducedMotion ? 0.2 : 0.8,
                delay: prefersReducedMotion ? 0 : index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="h-64 overflow-hidden bg-muted/30">
                <img
                  src={item.img || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-medium text-foreground tracking-wide">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* A little note from SimplyKhushi - subtle yellow tint background */}
      <section className="mx-auto max-w-4xl px-6 py-32 bg-primary/[0.03]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 1, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-12 text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.8 }}
            className="font-display text-3xl sm:text-4xl tracking-wide text-foreground"
          >
            A little note from SimplyKhushi{" "}
            <span className="inline-block text-primary" role="img" aria-label="yellow heart">
              💛
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.8, delay: 0.1 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <p className="text-lg sm:text-xl text-foreground leading-relaxed font-light">
              At SimplyKhushi, we believe joy doesn't have to be grand.
            </p>
            <p className="text-lg sm:text-xl text-foreground leading-relaxed font-light">
              It lives in small gestures, thoughtful details, and moments that feel personal.
            </p>
            <p className="text-lg sm:text-xl text-foreground leading-relaxed font-light">
              Every product we create is guided by this belief — to help people feel seen, valued, and connected, in the
              simplest way.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.8, delay: 0.3 }}
            className="text-base sm:text-lg text-muted-foreground font-light italic pt-4"
          >
            We're glad this little spark of joy brought you here.
          </motion.p>
        </motion.div>
      </section>

      {/* Brand Story & Connect Section - white background */}
      <section className="mx-auto max-w-5xl px-6 py-32 bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 1, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-16"
        >
          {/* Social sharing message */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.8, delay: 0.1 }}
            className="text-center space-y-4 max-w-3xl mx-auto"
          >
            <p className="text-lg text-muted-foreground leading-relaxed font-light">
              We create every product with that spirit in mind.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed font-light">
              We are glad this little sparkle of joy reached you too.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed font-light pt-2">
              Share your unboxing moments & tag <span className="text-foreground font-normal">@gift_simplykhushi</span>.
              We would love to feature your <span className="text-foreground font-normal">#simplykhushi</span>
            </p>
          </motion.div>

          {/* Let's stay connected */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.8, delay: 0.4 }}
            className="space-y-10"
          >
            <h3 className="text-2xl sm:text-3xl text-center text-foreground font-light tracking-wide">
              Let's stay connected
            </h3>

            {/* Contact Information */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              <a
                href="https://wa.me/919326544572"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-6 rounded-2xl bg-background border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-light mb-1">WhatsApp</p>
                  <p className="text-base font-medium text-foreground">9326544572</p>
                </div>
              </a>

              <a
                href="mailto:gift.simplykhushi@gmail.com"
                className="group flex items-center gap-4 p-6 rounded-2xl bg-background border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-light mb-1">Email</p>
                  <p className="text-sm font-medium text-foreground break-all">gift.simplykhushi@gmail.com</p>
                </div>
              </a>

              <a
                href="https://instagram.com/gift_simplykhushi"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-6 rounded-2xl bg-background border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Instagram className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-light mb-1">Instagram</p>
                  <p className="text-base font-medium text-foreground">@gift_simplykhushi</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* SimplyKhushi Club */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.8, delay: 0.6 }}
            className="text-center space-y-6 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl sm:text-3xl font-display text-foreground tracking-wide">
              Join the SimplyKhushi Club
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed font-light">
              A space for happy updates, new launches, exclusive offers, and a friendly circle to share, connect, and
              celebrate little moments together.
            </p>
            <a
              href="https://wa.me/919326544572"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-foreground font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
              Join WhatsApp Community
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center gap-6 text-center">
            <img src="/images/gift-simplykhushi.png" alt="SimplyKhushi" className="h-16 w-16 object-contain" />
            <p className="text-sm text-muted-foreground font-light">
              © 2026 SimplyKhushi. Spreading joy, one gift at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
