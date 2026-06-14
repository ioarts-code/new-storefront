function Frame() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <img 
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1051327-TAKDPK5fkufJGrn8AokBhu2Mh1iPnR.png"
        alt="File icon"
        className="absolute block inset-0 size-full brightness-0 invert"
      />
    </div>
  );
}

function VisitDeviantArt() {
  return (
    <a
      className="content-stretch flex items-center hover:bg-green-300 hover:text-black justify-center p-[3px] relative rounded-[6px] shrink-0 size-[48px]"
      href="https://www.deviantart.com/ioartseu/"
      target="_blank"
      rel="noreferrer"
      data-name="Visit DeviantArt"
    >
      <div
        aria-hidden="true"
        className="absolute border-3 border-solid border-white inset-0 pointer-events-none rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
      />
      <Frame />
    </a>
  );
}

function PinterestIcon() {
  return (
    <div className="relative shrink-0" data-name="PinterestIcon">
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 fill-white"
        aria-hidden="true"
        role="img"
      >
        <path d="M12 0C5.372 0 0 5.372 0 12c0 5.176 3.321 9.57 7.97 11.152-.11-.95-.21-2.421.04-3.463.23-.997 1.495-6.731 1.495-6.731s-.378-.76-.378-1.888c0-1.768 1.026-3.088 2.306-3.088 1.088 0 1.613.816 1.613 1.795 0 1.096-.703 2.735-1.059 4.255-.302 1.27.64 2.303 1.896 2.303 2.275 0 3.807-2.393 3.807-5.858 0-3.06-2.2-5.203-5.342-5.203-3.64 0-5.783 2.733-5.783 5.56 0 1.097.42 2.278.945 2.919.104.124.12.184.086.364-.095.402-.314 1.269-.357 1.444-.055.234-.184.284-.426.171-1.585-.738-2.562-3.048-2.562-4.91C2.22 6.83 5.122 3.156 10.592 3.156c4.39 0 7.796 3.135 7.796 7.323 0 4.369-2.748 7.89-6.566 7.89-1.281 0-2.486-.665-2.896-1.451 0 0-.615 2.326-.74 2.81-.269 1.085-.998 2.173-1.607 3.015C8.844 23.838 10.408 24 12 24c6.628 0 12-5.372 12-12S18.628 0 12 0z" />
      </svg>
    </div>
  );
}

function ShopOnPinterest() {
  return (
    <a
      className="content-stretch flex items-center hover:bg-red-300 hover:text-black justify-center p-[3px] relative rounded-[6px] shrink-0 size-[48px]"
      href="https://se.pinterest.com/brevduva999/"
      target="_blank"
      rel="noreferrer"
      data-name="Pinterest"
    >
      <div aria-hidden="true" className="absolute border-3 border-solid border-white inset-0 pointer-events-none rounded-[6px]" />
      <PinterestIcon />
    </a>
  );
}

function DivAbsolute() {
  return (
    <div className="absolute content-stretch cursor-pointer flex gap-[8px] items-start right-[44px] top-[31px]" data-name="div.absolute">
      <VisitDeviantArt />
      <ShopOnPinterest />
    </div>
  );
}

function A() {
  return (
    <a
      href="mailto:brevduva999@proton.me"
      className="flex items-center shrink-0 hover:opacity-75 transition-opacity font-['Inter:Regular',sans-serif] font-normal text-[14.6px] text-white tracking-[-0.24px] leading-[19.2px]"
      data-name="a"
    >
      Contact
    </a>
  );
}

function A1() {
  return (
    <a
      href="/terms-of-sale"
      className="content-stretch flex flex-col items-start relative self-stretch shrink-0 hover:opacity-75 transition-opacity"
      data-name="a"
    >
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[15.1px] text-white tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[19.2px]">Terms of Sale</p>
      </div>
    </a>
  );
}

function A2() {
  return (
    <a
      href="/privacy-policy"
      className="content-stretch flex flex-col items-start relative self-stretch shrink-0 hover:opacity-75 transition-opacity"
      data-name="a"
    >
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[15px] text-white tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[19.2px]">Privacy Policy</p>
      </div>
    </a>
  );
}

function A3() {
  return (
    <a
      href="/copyright-attribution"
      className="content-stretch flex flex-col items-start relative self-stretch shrink-0 hover:opacity-75 transition-opacity"
      data-name="a"
    >
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[15px] text-white tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[19.2px]">Copyright & Attribution</p>
      </div>
    </a>
  );
}

function DivAbsolute1() {
  return (
    <div className="absolute content-stretch flex mobile:flex-wrap mobile:gap-y-2 tablet:gap-[16px] h-auto mobile:h-auto tablet:h-[20px] items-start left-[44px] mobile:top-[380px] tablet:top-[490px] mobile:w-[calc(100%-88px)] mobile:flex-col tablet:flex-row" data-name="div.absolute">
      <A />
      <A1 />
      <A2 />
      <A3 />
    </div>
  );
}

function DivAbsolute2() {
  return (
    <div className="absolute content-stretch flex flex-col items-end right-[44px] mobile:right-[32px] mobile:bottom-[24px] tablet:top-[480px] mobile:w-auto" data-name="div.absolute">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14.8px] text-white tracking-[-0.24px] text-right mobile:rotate-90 mobile:origin-bottom-right">
        <p className="leading-[19.2px]">2026© — All rights reserved</p>
      </div>
    </div>
  );
}

function FooterWFull() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] h-[532px] min-h-[532px] relative rounded-[12px] shrink-0 w-full" data-name="footer.w-full">
      <div aria-hidden="true" className="absolute border-3 border-solid border-white inset-0 pointer-events-none rounded-[12px]" />
      <div className="-translate-y-1/2 absolute bg-clip-text bg-gradient-to-r flex flex-col font-['Inter:Bold',sans-serif] font-bold from-black h-[349px] justify-center leading-[0] left-[44px] not-italic mobile:text-[64px] tablet:text-[180px] desktop:text-[288px] text-[transparent] to-[#5c5c5c] top-[218.5px] mobile:w-auto tablet:w-[500px] desktop:w-[1079.975px]">
        <p className="leading-[normal]">IOARTS</p>
      </div>
      <DivAbsolute />
      <DivAbsolute1 />
      <DivAbsolute2 />
    </div>
  );
}

export default function Footer() {
  return (
    <div className="bg-[#0f0f0f] content-stretch flex flex-col items-start p-[24px] relative size-full" data-name="div">
      <FooterWFull />
    </div>
  );
}
