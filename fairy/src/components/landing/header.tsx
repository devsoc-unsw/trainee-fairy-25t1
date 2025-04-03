import { AnimatedLink } from "@/components/ui/animated-link";

export default function Header() {
  return (
    <header className="fixed top-10 inset-x-0 h-14 w-128 mx-auto z-50 backdrop-blur-md bg-white/75 dark:bg-black/75 rounded-full px-6 py-3 flex items-center justify-between shadow-md">
      <span className="font-bold text-2xl tracking-tighter select-none">recruit.me</span>
      <div className="flex items-center space-x-2">
        <AnimatedLink
          href="#"
          text="Sign up"
          textClassName="font-semibold select-none"
          className="rounded-full px-4"
          staggerChildren={0.01}
          duration={0.25}
        />
        <AnimatedLink
          href="#"
          text="Log in"
          textClassName="font-semibold select-none text-primary-foreground"
          className="bg-primary hover:bg-primary/90 rounded-full px-4"
          staggerChildren={0.01}
          duration={0.25}
        />
      </div>
    </header>
  );
}