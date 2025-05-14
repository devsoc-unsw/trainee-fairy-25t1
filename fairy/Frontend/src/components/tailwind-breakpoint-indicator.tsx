export default function TailwindBreakpointIndicator() {

  return (
    <div className="fixed bottom-15 right-4 z-50">
      <div className="flex items-center justify-center rounded-full bg-black/75 text-white text-sm font-bold shadow-lg w-10 h-10">
        <span className="sm:hidden">XS</span>
        <span className="hidden sm:inline md:hidden">SM</span>
        <span className="hidden md:inline lg:hidden">MD</span>
        <span className="hidden lg:inline xl:hidden">LG</span>
        <span className="hidden xl:inline 2xl:hidden">XL</span>
        <span className="hidden 2xl:inline">2XL</span>
      </div>
    </div>
  )
}

