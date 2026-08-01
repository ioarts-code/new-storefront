export default function TopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full h-6 bg-[#74D5FF]">
      <div className="flex items-center justify-end px-8 h-full">
        <a
          href="https://buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-inter font-bold text-xs text-black hover:opacity-80 transition-opacity"
        >
          buy me coffee
        </a>
      </div>
    </div>
  )
}
