"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import Matter from "matter-js"

interface PhysicsBackgroundProps {
  parentRef?: (engine: Matter.Engine) => void
  // Optional selector to specify which elements should interact with physics
  interactiveSelector?: string
  debug?: boolean
  width?: number | string
  height?: number | string
  initialBodyCount?: number
  wallThickness?: number
}

interface DomBodyMapping {
  domElement: Element
  physicsBody: Matter.Body
  id: string
  initialPosition: { x: number; y: number }
}

export default function PhysicsBackground({
  parentRef,
  interactiveSelector = '[data-physics="interactive"]',
  debug = false,
  width = "100%",
  height = "100%",
  initialBodyCount = 10,
  wallThickness = 1000,
}: PhysicsBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const runnerRef = useRef<Matter.Runner | null>(null)
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null)
  const domBodyMappingsRef = useRef<DomBodyMapping[]>([])
  const initializedRef = useRef<boolean>(false)
  const [isReady, setIsReady] = useState(false)

  // Function to generate a unique ID for each DOM element
  const generateUniqueId = useCallback(() => {
    return `physics-body-${Math.random().toString(36).substring(2, 11)}`
  }, [])

  // Function to get element position relative to the physics container
  const getRelativePosition = useCallback((element: Element) => {
    if (!containerRef.current) return { x: 0, y: 0, width: 0, height: 0 }

    const containerRect = containerRef.current.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    return {
      x: elementRect.left - containerRect.left,
      y: elementRect.top - containerRect.top,
      width: elementRect.width,
      height: elementRect.height,
    }
  }, [])

  // Function to create a physics body for a DOM element
  const createBodyForElement = useCallback(
    (element: Element, engine: Matter.Engine): DomBodyMapping | null => {
      if (!element || !containerRef.current) return null

      const { Bodies } = Matter
      const elementRect = element.getBoundingClientRect()

      // Calculate position relative to the physics container
      const relativeRect = getRelativePosition(element)

      // Skip elements that are not visible or too small
      if (
        relativeRect.width < 5 ||
        relativeRect.height < 5 ||
        elementRect.right < 0 ||
        elementRect.bottom < 0 ||
        elementRect.left > window.innerWidth ||
        elementRect.top > window.innerHeight
      ) {
        return null
      }

      // Get custom properties from data attributes if available
      const isStatic = element.getAttribute("data-physics-static") !== "false"
      const chamferRadius = Number.parseInt(element.getAttribute("data-physics-chamfer") || "0")
      const opacity = Number.parseFloat(element.getAttribute("data-physics-opacity") || "0.0")
      const isDebugMode = element.getAttribute("data-physics-debug") === "true"

      // Create the physics body with position relative to the container
      const centerX = relativeRect.x + relativeRect.width / 2
      const centerY = relativeRect.y + relativeRect.height / 2

      const body = Bodies.rectangle(centerX, centerY, relativeRect.width, relativeRect.height, {
        isStatic, // Ensure this is set correctly
        render: {
          fillStyle: isDebugMode ? "rgba(0, 255, 0, 0.5)" : `rgba(200, 200, 200, ${opacity})`,
          strokeStyle: isDebugMode ? "green" : `rgba(200, 200, 200, ${opacity + 0.3})`,
          lineWidth: isDebugMode ? 1 : 0,
        },
        chamfer: { radius: chamferRadius },
        label: element.tagName.toLowerCase() + "-" + generateUniqueId(),
      })

      // Add the body to the world
      Matter.Composite.add(engine.world, body)

      if (debug) {
        console.log(`Created physics body for element:`, {
          element: element.tagName,
          position: { x: centerX, y: centerY },
          dimensions: { width: relativeRect.width, height: relativeRect.height },
          isStatic,
        })
      }

      // Return the mapping with initial position
      return {
        domElement: element,
        physicsBody: body,
        id: generateUniqueId(),
        initialPosition: { x: centerX, y: centerY },
      }
    },
    [generateUniqueId, getRelativePosition],
  )

  // Function to create random bodies
  const createRandomBodies = useCallback((engine: Matter.Engine, count: number) => {
    if (!containerRef.current) return []

    const { Bodies, Composite } = Matter
    const containerWidth = containerRef.current.clientWidth
    const containerHeight = containerRef.current.clientHeight

    const bodies = []

    for (let i = 0; i < count; i++) {
      const x = Math.random() * containerWidth
      const y = Math.random() * (containerHeight / 2)
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

      bodies.push(body)
    }

    Composite.add(engine.world, bodies)
    return bodies
  }, [])

  // Function to initialize DOM elements with physics bodies
  const initializeDomElements = useCallback(
    (engine: Matter.Engine): Promise<boolean> => {
      return new Promise((resolve) => {
        if (!engine || !containerRef.current) {
          resolve(false)
          return
        }

        // Reset initialization state if needed
        if (initializedRef.current) {
          // Clear existing mappings
          const { Composite } = Matter
          domBodyMappingsRef.current.forEach((mapping) => {
            Composite.remove(engine.world, mapping.physicsBody)
          })
          domBodyMappingsRef.current = []
          initializedRef.current = false
        }

        // Use requestAnimationFrame to ensure DOM is fully rendered
        requestAnimationFrame(() => {
          // Get all interactive DOM elements
          const interactiveElements = document.querySelectorAll(interactiveSelector)

          if (debug) {
            console.log(`Found ${interactiveElements.length} interactive elements`)
          }

          // Create bodies for all interactive elements
          const mappings: DomBodyMapping[] = []

          interactiveElements.forEach((element) => {
            const mapping = createBodyForElement(element, engine)
            if (mapping) {
              mappings.push(mapping)
            }
          })

          // Store the mappings
          domBodyMappingsRef.current = mappings

          // Mark as initialized
          initializedRef.current = true

          if (debug) {
            console.log(`Created ${mappings.length} physics bodies for interactive elements`)
          }

          resolve(true)
        })
      })
    },
    [createBodyForElement, interactiveSelector],
  )

  // Function to update positions of DOM-mapped physics bodies
  const updateDomElementPositions = useCallback(() => {
    if (!engineRef.current || !containerRef.current) return

    const { Body, Bodies } = Matter

    domBodyMappingsRef.current.forEach((mapping) => {
      if (mapping.domElement && mapping.physicsBody) {
        const relativeRect = getRelativePosition(mapping.domElement)
        const centerX = relativeRect.x + relativeRect.width / 2
        const centerY = relativeRect.y + relativeRect.height / 2

        // Only update static bodies (interactive elements that shouldn't move)
        if (mapping.physicsBody.isStatic) {
          Body.setPosition(mapping.physicsBody, {
            x: centerX,
            y: centerY,
          })

          // Update size if needed
          const currentWidth = mapping.physicsBody.bounds.max.x - mapping.physicsBody.bounds.min.x
          const currentHeight = mapping.physicsBody.bounds.max.y - mapping.physicsBody.bounds.min.y

          if (Math.abs(currentWidth - relativeRect.width) > 2 || Math.abs(currentHeight - relativeRect.height) > 2) {
            Body.setVertices(
              mapping.physicsBody,
              Bodies.rectangle(centerX, centerY, relativeRect.width, relativeRect.height).vertices,
            )
          }
        }
      }
    })
  }, [getRelativePosition])

  // Function to handle cursor changes when hovering over draggable bodies
  const setupCursorFeedback = useCallback(() => {
    if (!renderRef.current || !mouseConstraintRef.current || !engineRef.current) return

    const canvas = renderRef.current.canvas
    const mouseConstraint = mouseConstraintRef.current
    const engine = engineRef.current

    // Track if we're currently dragging a body
    let isDragging = false
    // Change cursor on hover over non-static bodies
    canvas.addEventListener("mousemove", (event) => {
      // Skip cursor updates during active drag
      if (isDragging) return

      const mouse = mouseConstraint.mouse
      const bodies = Matter.Query.point(engine.world.bodies || [], {
        x: mouse.position.x || 0,
        y: mouse.position.y || 0,
      })

      // Check if we're hovering over any non-static bodies
      const hoveringDraggable = bodies.some((body) => !body.isStatic)

      if (hoveringDraggable) {
        canvas.style.cursor = "grab"
      } else {
        canvas.style.cursor = "default"
      }
    })

    // Use Matter.js events for more reliable drag detection
    Matter.Events.on(mouseConstraint, "startdrag", () => {
      isDragging = true;
      const mouse = mouseConstraint.mouse;
      const bodies = Matter.Query.point(engine.world.bodies || [], {
        x: mouse.position.x || 0,
        y: mouse.position.y || 0,
      });

      // Check if we're hovering over any non-static bodies
      const hoveringDraggable = bodies.some((body) => !body.isStatic);

      hoveringDraggable ? canvas.style.cursor = "grabbing" : canvas.style.cursor = "default";
    })

    Matter.Events.on(mouseConstraint, "enddrag", () => {
      isDragging = false;
      canvas.style.cursor = "default";
    })
  }, [])

  // Initialize the physics engine and setup
  const initializePhysics = useCallback(async () => {
    if (!containerRef.current) return

    // Initialize Matter.js modules
    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter

    // Create engine
    const engine = Engine.create({
      enableSleeping: true,
      gravity: {
        x: 0,
        y: 1,
        scale: 0.001,
      },
    })
    engineRef.current = engine

    // Get container dimensions from the container element
    const containerWidth = containerRef.current.clientWidth
    const containerHeight = containerRef.current.clientHeight

    // Create renderer
    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: containerWidth,
        height: containerHeight,
        background: "transparent",
        pixelRatio: window.devicePixelRatio,
        wireframes: debug,
        showDebug: debug,
        showVelocity: debug,
        showAngleIndicator: debug,
        showSleeping: debug,
      },
    })
    renderRef.current = render

    /* -------------------------------- WALLS ------------------------------- */
    // Create walls to keep objects inside the canvas
    const wallOptions = {
      isStatic: true,
      render: { fillStyle: "hsl(0, 0%, 0%)" }, // Make walls invisible
    }
    const walls = [
      // Bottom wall
      Bodies.rectangle(
        containerWidth / 2,
        containerHeight + wallThickness / 2,
        containerWidth,
        wallThickness,
        wallOptions,
      ),
      // Left wall
      Bodies.rectangle(-wallThickness / 2, containerHeight / 2, wallThickness, containerHeight, wallOptions),
      // Right wall
      Bodies.rectangle(
        containerWidth + wallThickness / 2,
        containerHeight / 2,
        wallThickness,
        containerHeight,
        wallOptions,
      ),
      // Top wall
      Bodies.rectangle(containerWidth / 2, -wallThickness / 2, containerWidth, wallThickness, wallOptions),
    ]

    // Add walls to the world
    Composite.add(engine.world, walls)

    /* ----------------------------- MOUSE DRAG ----------------------------- */
    // Create mouse and mouse constraint
    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: debug,
        },
      },
    })

    // Enable scrolling while interacting with the canvas
    // @ts-ignore - mousewheel exists at runtime but not in types
    mouse.element.removeEventListener("wheel", mouse.mousewheel)

    mouseConstraintRef.current = mouseConstraint

    // Add mouse constraint to world
    Composite.add(engine.world, mouseConstraint)

    // Keep the mouse in sync with rendering
    render.mouse = mouse

    // Scale mouse position based on pixel ratio
    mouse.pixelRatio = window.devicePixelRatio

    // Run the renderer
    Render.run(render)

    // Create runner but don't start it yet
    const runner = Runner.create()
    runnerRef.current = runner

    // IMPORTANT: Initialize DOM elements FIRST
    const domElementsInitialized = await initializeDomElements(engine)

    if (debug) {
      console.log(`DOM elements initialized: ${domElementsInitialized}`)
      console.log(`Total bodies in world: ${Composite.allBodies(engine.world).length}`)
    }

    // THEN create random bodies AFTER DOM elements are initialized
    createRandomBodies(engine, initialBodyCount)

    // NOW start the runner
    Runner.run(runner, engine)

    // Notify parent component that engine is ready
    if (parentRef) {
      parentRef(engine)
    }

    // Set ready state
    setIsReady(true)

    // Setup cursor feedback for draggable bodies
    setupCursorFeedback()

    return {
      engine,
      render,
      runner,
      mouse,
    } as const
  }, [initializeDomElements, createRandomBodies, parentRef, initialBodyCount, setupCursorFeedback])

  useEffect(() => {
    let cleanup: {
      engine?: Matter.Engine
      render?: Matter.Render
      runner?: Matter.Runner
      mouse?: Matter.Mouse
    } = {}

    // Initialize physics engine and setup
    initializePhysics().then((setup) => {
      if (setup) {
        cleanup = setup
      }
    })

    return () => {
      // Cleanup function
      const { Runner, Engine } = Matter

      if (cleanup.runner) Runner.stop(cleanup.runner as Matter.Runner)
      if (cleanup.render) Matter.Render.stop(cleanup.render)
      if (cleanup.engine) Engine.clear(cleanup.engine)

      if (cleanup.render && cleanup.render.canvas) {
        cleanup.render.canvas.remove()
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [initializePhysics])

  // Handle window resize
  useEffect(() => {
    if (!isReady) return

    const { Body, Render, Bodies, Composite, Sleeping } = Matter
    const animationFrameId: number | null = null

    // Function to update the physics world dimensions and object positions
    const updatePhysicsWorld = (newWidth: number, newHeight: number) => {
      if (!renderRef.current || !engineRef.current) return

      const oldWidth = renderRef.current.options.width || 0
      const oldHeight = renderRef.current.options.height || 0

      // Calculate scaling factors for proportional positioning
      const scaleX = newWidth / oldWidth
      const scaleY = newHeight / oldHeight

      // Update renderer dimensions
      renderRef.current.options.width = newWidth
      renderRef.current.options.height = newHeight
      renderRef.current.canvas.width = newWidth
      renderRef.current.canvas.height = newHeight

      // Get all bodies from the engine world
      const bodies = Composite.allBodies(engineRef.current.world)

      // Get walls from the engine world (static bodies that aren't DOM elements)
      const walls = bodies.filter(
        (body) => body.isStatic && !domBodyMappingsRef.current.some((mapping) => mapping.physicsBody.id === body.id),
      ) as Matter.Body[]

      // Update wall positions and sizes
      if (walls.length >= 4) {
        // Bottom wall
        Body.setPosition(walls[0], {
          x: newWidth / 2,
          y: newHeight + wallThickness / 2,
        })
        Body.setVertices(
          walls[0],
          Bodies.rectangle(newWidth / 2, newHeight + wallThickness / 2, newWidth + wallThickness * 2, wallThickness)
            .vertices,
        )

        // Left wall
        Body.setPosition(walls[1], {
          x: -wallThickness / 2,
          y: newHeight / 2,
        })
        Body.setVertices(
          walls[1],
          Bodies.rectangle(-wallThickness / 2, newHeight / 2, wallThickness, newHeight + wallThickness * 2).vertices,
        )

        // Right wall
        Body.setPosition(walls[2], {
          x: newWidth + wallThickness / 2,
          y: newHeight / 2,
        })
        Body.setVertices(
          walls[2],
          Bodies.rectangle(newWidth + wallThickness / 2, newHeight / 2, wallThickness, newHeight + wallThickness * 2)
            .vertices,
        )

        // Top wall
        Body.setPosition(walls[3], {
          x: newWidth / 2,
          y: -wallThickness / 2,
        })
        Body.setVertices(
          walls[3],
          Bodies.rectangle(newWidth / 2, -wallThickness / 2, newWidth + wallThickness * 2, wallThickness).vertices,
        )
      }

      // Update positions of DOM-mapped physics bodies
      updateDomElementPositions()

      // Scale positions of non-static, non-DOM bodies proportionally
      bodies.forEach((body) => {
        if (
          !body.isStatic &&
          !walls.includes(body) &&
          !domBodyMappingsRef.current.some((mapping) => mapping.physicsBody.id === body.id)
        ) {
          // Scale position proportionally to maintain relative positioning
          Body.setPosition(body, {
            x: body.position.x * scaleX,
            y: body.position.y * scaleY,
          })

          // Wake up the body to ensure it responds to the new position
          Sleeping.set(body, false)
        }
      })

      // Update pixel ratio
      Render.setPixelRatio(renderRef.current, window.devicePixelRatio)

      // Update mouse pixel ratio
      if (renderRef.current.mouse) {
        renderRef.current.mouse.pixelRatio = window.devicePixelRatio
      }

      if (debug) {
        console.log(`Resized physics world: ${oldWidth}x${oldHeight} -> ${newWidth}x${newHeight}`)
      }
    }

    // Also listen for window resize events as a fallback
    const handleWindowResize = () => {
      if (!containerRef.current) return
      updatePhysicsWorld(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleWindowResize)

    return () => {
      // Clean up
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [isReady, updateDomElementPositions])

  // Handle DOM mutations
  useEffect(() => {
    if (!isReady || !engineRef.current) return

    const engine = engineRef.current

    // Set up MutationObserver to watch for DOM changes
    const observerCallback = (mutations: MutationRecord[]) => {
      let shouldReinitialize = false

      for (const mutation of mutations) {
        // Check if nodes were added or removed
        if (mutation.type === "childList" && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
          // Check if any of the added/removed nodes have the interactive selector
          const hasInteractiveNode = Array.from(mutation.addedNodes).some(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE &&
              ((node as Element).matches?.(interactiveSelector) ||
                (node as Element).querySelector?.(interactiveSelector)),
          )

          if (hasInteractiveNode) {
            shouldReinitialize = true
            break
          }

          // Also check if any removed nodes were interactive
          const removedInteractive = Array.from(mutation.removedNodes).some(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE &&
              domBodyMappingsRef.current.some((mapping) => mapping.domElement === node),
          )

          if (removedInteractive) {
            shouldReinitialize = true
            break
          }
        }
      }

      if (shouldReinitialize) {
        // Reinitialize all interactive elements
        initializeDomElements(engine)
      }
    }

    const observer = new MutationObserver(observerCallback)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [isReady, interactiveSelector, initializeDomElements])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{
        width: width,
        height: height,
        pointerEvents: "auto", // Enable pointer events for dragging
        touchAction: "pan-y", // Allow vertical touch scrolling
      }}
    />
  )
}
