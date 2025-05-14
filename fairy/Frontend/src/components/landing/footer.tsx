import Image from "next/image";

export default function Footer() {
  return (
    <div 
      className="bg-[#0a0a0a] relative h-[400px]"
      style={{clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)"}}
    >
      <div className="relative h-[calc(100vh+400px)] -top-[100vh]">
        <div className="h-[400px] sticky top-[calc(100vh-400px)]">
          <FooterContent />
        </div>
      </div>
    </div>
  )
}

const FooterContent = () => {
  return (
    <div className="mx-auto container text-white py-8 px-12 h-full w-full flex flex-col justify-between">
      {/* Nav Links */}
      <section className="flex shrink-0 gap-20">
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 uppercase text-muted-foreground">About</h3>
          <ul className="space-y-2">
            <li>Home</li>
            <li>Projects</li>
            <li>Our Mission</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 uppercase text-muted-foreground">Education</h3>
          <ul className="space-y-2">
            <li>News</li>
            <li>Learn</li>
            <li>Certification</li>
            <li>Publications</li>
          </ul>
        </div>
      </section>
      {/* Logo & Copyright */}
      <section className="flex justify-between items-center">
        <div className="flex items-center h-full max-h-32 space-x-6">
          <Image
              className="invert h-full w-fit"
              src="/logo-transparent.svg"
              alt="rectuitMe logo"
              width={335}
              height={243}
              priority
            />
          <h1 className="font-bold text-8xl tracking-tighter select-none">recruit.me</h1>
        </div>
        <p className="text-muted-foreground">© Copyright</p>
      </section>
    </div>
  );
}