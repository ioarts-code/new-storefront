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
      className="content-stretch flex items-center justify-center p-[3px] relative rounded-[6px] shrink-0 size-[48px]"
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

function SpanFontBold() {
  return (
    <div className="relative shrink-0" data-name="span.font-bold">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-left text-white whitespace-nowrap">
          <p className="leading-[36px]">E</p>
        </div>
      </div>
    </div>
  );
}

function ShopOnEtsy() {
  return (
    <a
      className="content-stretch flex items-center justify-center p-[3px] relative rounded-[6px] shrink-0 size-[48px]"
      href="https://www.etsy.com/shop/ioartseu"
      target="_blank"
      rel="noreferrer"
      data-name="Shop on Etsy"
    >
      <div aria-hidden="true" className="absolute border-3 border-solid border-white inset-0 pointer-events-none rounded-[6px]" />
      <SpanFontBold />
    </a>
  );
}

function DivAbsolute() {
  return (
    <div className="absolute content-stretch cursor-pointer flex gap-[8px] items-start right-[44px] top-[31px]" data-name="div.absolute">
      <VisitDeviantArt />
      <ShopOnEtsy />
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
    <div className="absolute content-stretch flex flex-col items-end right-[44px] mobile:right-[32px] mobile:bottom-[16px] tablet:top-[498px] mobile:w-auto" data-name="div.absolute">
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
