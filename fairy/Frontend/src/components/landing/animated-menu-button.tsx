"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const variants =  {
  open: {
    height: 650,
    width: 480,
    top: "-25px",
    right: "-25px",
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1]},
    
  },
  closed: {
    height: 40,
    width: 100, 
    top: "0px",
    right: "0px",
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1]},
  }
}
const links = [
  {
    title: "Projects",
    href: "/",
  },
  {
    title: "Agency",
    href: "/",
  },
  {
    title: "Expertise",
    href: "/",
  },
  {
    title: "Careers",
    href: "/",
  },
  {
    title: "Contact",
    href: "/",
  },
];
const perspective = {
  initial: {
    opacity: 0,
    rotateX: 90,
    translateY: 80,
    translateX: -20,
  },
  enter: (i: number) => ({
    opacity: 1,
    rotateX: 0,
    translateY: 0,
    translateX: 0,
    transition: {
      duration: 0.65,
      delay: 0.5 + (i * 0.1),
      ease: [0.215, 0.61, 0.355, 1],
      // opacity: { duration: 0.35 },
    },
  }),
  exit: {
    opacity: 0,
    transition: { duration: 0.5, type: "linear", ease: [0.76, 0, 0.24, 1]},
  },
}
const footerLinks = [
  {
    title: "Facebook",
    href: "/",
  },
  {
    title: "LinkedIn",
    href: "/",
  },
  {
    title: "Instagram",
    href: "/",
  },
  {
    title: "X (Twitter)",
    href: "/",
  },
]
const slideIn = {
  initial: {
    opacity: 0,
    y: 20
},
  enter: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5,
      delay: 0.75 + (i * 0.1), 
      ease: [0.215, 0.61, 0.355, 1]
    }
  }),
  exit: {
    opacity: 0,
    transition: { duration: 0.5, type: "tween", ease: "easeInOut"}
  }
}

export default function AnimatedMenuButton() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="fixed right-10 top-10 z-50">
      <motion.div
        className="relative h-[650px] w-[480px] rounded-[25px] backdrop-blur-md bg-white/75 dark:bg-black/75 shadow-md"
        variants={variants}
        animate={isActive ? "open" : "closed"}
        initial="closed"
      >
        <AnimatePresence>
          {isActive && <Nav />}
        </AnimatePresence>
      </motion.div>
      <div
        onClick={() => setIsActive(!isActive)}
        className="h-[40px] w-[100px] rounded-full cursor-pointer absolute top-0 right-0 overflow-hidden"
      >
        <motion.div
          className="h-full w-full relative"
          animate={{ top: isActive ? "-100%" : "0" }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1]}}
        >
          <div className="select-none uppercase w-full h-full bg-black/1 backdrop-blur-xl shadow-md flex items-center justify-center">
            <p>Menu</p>
          </div>
          <div className="select-none uppercase w-full h-full flex items-center justify-center absolute top-full bg-black text-white">
            <p>Close</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const Nav = () => {
  return (
    <div className="h-full pt-[100px] pb-[50px] px-[40px] flex flex-col justify-between"> {/* nav */}
      <div className="flex flex-col gap-2.5"> {/* body */}
        {links.map(({ title, href }, index) => (
          <div key={`n_${title}`} className="perspective-[120px] perspective-origin-bottom">
            <motion.div
              className="text-5xl"
              custom={index}
              variants={perspective}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <Link
                href={href}
                className="hover:opacity-50 transition-opacity duration-300"
              >
                {title}
              </Link>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap"> {/* footer */}
        {footerLinks.map(({ title, href }, index) => (
          <motion.div
            className="w-1/2 mt-[5px]"
            key={`f_${title}`}
            custom={index}
            variants={slideIn}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            <Link
              href={href}
              className="hover:opacity-50 transition-opacity duration-300"
            >
              {title}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}