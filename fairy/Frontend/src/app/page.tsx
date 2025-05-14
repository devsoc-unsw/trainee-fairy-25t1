"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Matter from "matter-js"

// Layout
import Header from "@/components/landing/header"
import Footer from "@/components/landing/footer"
import PhysicsBackground from "@/components/landing/physics-background"
import StickySection from "@/components/landing/sticky-section"
import GridBackground from "@/components/landing/grid-background"

// Components
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"
import ColourfulText from "@/components/ui/colourful-text"
import AnimatedMenuButton from "@/components/landing/animated-menu-button"

const ScrollIndicator = () => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 5V19M12 19L5 12M12 19L19 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const engineRef = useRef<Matter.Engine | null>(null)
  const parentRef = (engine: Matter.Engine) => engineRef.current = engine;
  const [debug, setDebug] = useState(false);

  const createRandomObject = () => {
    if (!engineRef.current) return;
  
    const { Composite } = Matter
    const x = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1
    const y = 50
    const body = createRandomBody(x, y)
    Composite.add(engineRef.current.world, body)
    return body
  }

  const createRandomBody = (x: number, y: number) => {
    const { Bodies } = Matter
    const radius = 15 + Math.random() * 30
    const rand = Math.random()
    let body

    const renderStyle = {
      fillStyle: `hsl(${Math.random() * 360}, 80%, 60%)`,
    }

    if (rand < 0.33) {
      body = Bodies.circle(x, y, radius, {
        restitution: 0.8,
        friction: 0.005,
        render: renderStyle,
      })
    } else if (rand < 0.66) {
      body = Bodies.rectangle(x, y, radius * 2, radius * 1.5, {
        restitution: 0.6,
        friction: 0.01,
        render: renderStyle,
      })
    } else {
      const sides = Math.floor(3 + Math.random() * 5)
      body = Bodies.polygon(x, y, sides, radius, {
        restitution: 0.7,
        friction: 0.02,
        render: renderStyle,
      })
    }

    return body
  }

  const shakeObjects = () => {
    if (!engineRef.current) return

    const { Body, Composite } = Matter
    const bodies = Composite.allBodies(engineRef.current.world)

    bodies.filter((body) => !body.isStatic).forEach((body) => {
      // Create an upward force with a small random horizontal component
      const forceMagnitude = 0.1 + Math.random() * 0.05
      const horizontalRandomness = (Math.random() - 0.5) * 0.04 // Small random horizontal force

      // Apply force - negative y for upward direction
      Body.applyForce(body, body.position, {
        x: horizontalRandomness,
        y: -forceMagnitude,
      })
    })
  }

  // Shake objects when scroll to top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) return;
      shakeObjects();
    }

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const DebugMenu = () => {
    return (
      <div className="fixed top-4 left-4 flex flex-col items-center space-y-2 bg-red-500/20 p-3 rounded-xl">
        <Button
          size="lg"
          variant="outline"
          className="mt-12 h-12 text-lg font-semibold pointer-events-auto hover:cursor-pointer"
          onClick={createRandomObject}
        >
          Spawn
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-12 text-lg font-semibold pointer-events-auto hover:cursor-pointer"
          onClick={shakeObjects}
        >
          Shake
        </Button>
        <div
          className="flex items-center space-x-2 h-12 bg-background border rounded-md px-3 pointer-events-auto"
        >
          <Switch
            id="showDebug"
            checked={debug}
            onCheckedChange={() => setDebug(!debug)}
          />
          <Label htmlFor="showDebug" className="text-lg font-semibold">Debug</Label>
        </div>
        <ModeToggle />
        <Button asChild>
          <Link href="#about">about</Link>
        </Button>
        <Button asChild>
          <Link href="#mission">mission</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <AnimatedMenuButton />
      <main className="bg-foreground">
        {/* HERO SECTION */}
        <div className="relative bg-background h-screen rounded-b-4xl overflow-hidden">
          <GridBackground />
          <PhysicsBackground  
            parentRef={parentRef} 
            initialBodyCount={100}
            debug={debug}
          />

          <div className="relative z-10 h-full flex flex-col justify-center items-center pointer-events-none space-y-16">
            <h1
              className="text-4xl lg:text-7xl font-bold tracking-tight text-foreground text-center select-none"
              data-physics="interactive"
            >
              Society recruitment <br /> made <ColourfulText text="simple" />
              <span
                className="pointer-events-auto select-none hover:text-purple-500 hover:cursor-pointer"
                onClick={createRandomObject}
              >.</span>
            </h1>
          </div>

          <DebugMenu />
          <ScrollIndicator />
        </div>

        <StickySection
          id="about"
          height="800px"
          backgroundColour="bg-foreground"
          pageColour="bg-background"
        >
          <section className="text-background flex flex-col justify-between h-full space-y-3">
            <div className="h-full">
              
            </div>
            <h2 className="font-bold text-8xl tracking-tighter select-none">about</h2>
          </section>
        </StickySection>
        <StickySection
          id="mission"
          height="800px"
          backgroundColour="bg-background"
          pageColour="bg-[#0a0a0a]"
        >
          <section className="flex flex-col justify-between h-full space-y-3">
            <div className="h-full">
              
            </div>
            <h2 className="font-bold text-8xl tracking-tighter select-none">mission</h2>
          </section>
        </StickySection>
      </main>
      <Footer />
    </>
  )
}
