import Link from 'next/link';
import { BackToHomeButton } from '@/components/back-to-home-button';

export const metadata = {
  title: 'Copyright & Attribution | IOARTS',
  description: 'Copyright information and artist attributions for IOARTS products and artwork.',
};

export default function CopyrightAttributionPage() {
  return (
    <main className="min-h-screen bg-[#0F0F0F]">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="mb-16">
          <BackToHomeButton className="mb-8" />
          <h1 className="font-['Inter:Bold',sans-serif] font-bold text-5xl md:text-7xl text-white uppercase tracking-tight mb-4">
            Copyright & Attribution
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Respecting artists, creators, and intellectual property rights
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Copyright Notice Section */}
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Copyright Notice</h2>
            <div className="bg-white/5 border border-gray-700 rounded-lg p-6 space-y-4 text-gray-300">
              <p>
Copyright & Attribution Information

Last updated: January 2026
About This SiteI am an independent fan artist and individual creator, NOT a company or organization. This site is a personal creative project showcasing fan-inspired vector designs and artwork based on themes I’m passionate about. I operate solely as a private individual creator.
Fan Works & Original InterpretationsMany of the designs on this site are inspired by themes from video games, music, films, and other media that I am a fan of. When creating vector designs based on these themes, I always aim to develop my own original interpretation rather than copying existing artwork. This means:
I create unique vector designs that capture the spirit and aesthetic of themes I admireMy designs are original artistic expressions inspired by, not reproductions of, existing worksI put creative effort into reimagining these themes through my own artistic lensEach piece represents my personal interpretation and artistic contribution
Attribution & OwnershipI acknowledge and respect the original creators and intellectual property holders of the themes and franchises that inspire my work. When my designs are based on specific media or brands, I recognize the original creators and owners:
Video Games: Designs inspired by video game themes are fan creations and are not affiliated with or endorsed by the game publishers or developersMusic: Music-themed designs respect the original artists and composers while offering my creative interpretationFilms: Film-inspired artwork is fan-created and is not affiliated with film studios, production companies, or copyright holdersOther Media: All fan-inspired designs credit the original intellectual property owners
I Am a Fan & CustomerI want to be clear: I am a devoted fan and customer of the original products and themes I draw inspiration from. My work celebrates and honors these themes rather than diminishing them. I support the original creators through purchasing their products and sharing my passion for their work. My designs are a tribute to the themes and franchises I love, created by someone who genuinely cares about the original content.
Independent Creator StatusI am not representing myself as, and am not affiliated with, any official company, organization, or brand related to the themes in my work. I operate as an independent artist creating original fan interpretations for personal creative expression and small-scale sales. I do not claim ownership of the intellectual properties that inspire my designs.
Fair Use & Creative ExpressionMy designs represent fan art and creative expression based on themes from media I admire. I create original vector interpretations that transform these themes into new artistic works. While I respect all copyrights and trademarks, I believe that fan creators like myself contribute to the cultural appreciation and celebration of the media we love.
Respect for Intellectual PropertyI fully respect the intellectual property rights of all original creators and copyright holders. If you are an intellectual property holder and have concerns about my work, please contact me directly. I am open to dialogue and will work to resolve any issues respectfully and appropriately.
Contact & QuestionsIf you have questions about my work, attribution practices, or concerns about intellectual property, please reach out using the contact information on this website. I’m committed to operating transparently and respectfully as an independent creator.
              </p>
            </div>
          </section>

          {/* Artist Attribution Section */}
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Artist Attribution</h2>
            <div className="bg-white/5 border border-gray-700 rounded-lg p-6 space-y-4 text-gray-300">
              <p>
                IOARTS is proud to showcase original artwork and creative designs. All featured artists are properly credited for their contributions. We believe in supporting and recognizing the talented creators behind every product.
              </p>
              <p>
                Each product page includes artist information and credits. We encourage customers to learn about the artists whose work they support through their purchases.
              </p>
            </div>
          </section>

          {/* Third-Party Assets Section */}
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Third-Party Assets & Attribution</h2>
            <div className="bg-white/5 border border-gray-700 rounded-lg p-6 space-y-4 text-gray-300">
              <p>
                This website uses resources and assets from third-party creators and providers. We are committed to properly attributing and respecting all intellectual property:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>All icons and UI elements are sourced from reputable design libraries</li>
                <li>Fonts are licensed for web use through official font providers</li>
                <li>Any third-party artwork is used with proper licensing and attribution</li>
                <li>Photography and imagery are either original or properly licensed</li>
              </ul>
            </div>
          </section>

          {/* Fan Art & Unofficial Content Section */}
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Fan Art & Unofficial Content</h2>
            <div className="bg-white/5 border border-gray-700 rounded-lg p-6 space-y-4 text-gray-300">
              <p>
                IOARTS creates unofficial fan merchandise and artwork inspired by popular games, movies, and media. All fan art is created with respect for the original intellectual property holders.
              </p>
              <p>
                We operate under the understanding that fan creators contribute to vibrant communities around beloved franchises. Our merchandise is produced in limited quantities for passionate fans and collectors.
              </p>
              <p>
                If you are the copyright holder of any content featured on IOARTS and have concerns about its use, please contact us immediately at <span className="font-semibold">support@ioarts.ink</span> to discuss the matter.
              </p>
            </div>
          </section>

          {/* Digital Content & Downloads Section */}
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Digital Content & Downloads</h2>
            <div className="bg-white/5 border border-gray-700 rounded-lg p-6 space-y-4 text-gray-300">
              <p>
                Digital files provided for download (including artwork, wallpapers, and design files) are licensed for personal use only. These files may not be:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Redistributed, shared, or resold</li>
                <li>Modified and presented as original work</li>
                <li>Used for commercial purposes without explicit permission</li>
                <li>Included in derivative products or services</li>
              </ul>
            </div>
          </section>

          {/* Licensing Information Section */}
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Licensing Information</h2>
            <div className="bg-white/5 border border-gray-700 rounded-lg p-6 space-y-4 text-gray-300">
              <p>
                For inquiries regarding licensing, commercial use, or permission to reproduce any IOARTS content, please reach out to us at <span className="font-semibold">licensing@ioarts.ink</span>.
              </p>
              <p>
                We are open to partnerships, collaborations, and licensing opportunities with businesses and creators who share our values.
              </p>
            </div>
          </section>

          {/* DMCA Section */}
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">DMCA & Takedown Notices</h2>
            <div className="bg-white/5 border border-gray-700 rounded-lg p-6 space-y-4 text-gray-300">
              <p>
                If you believe your copyright has been infringed upon by content on this website, please send a detailed DMCA notice to our designated agent at <span className="font-semibold">copyright@ioarts.ink</span>.
              </p>
              <p>
                Include the following information in your notice:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Your contact information and proof of copyright ownership</li>
                <li>Description of the infringing material</li>
                <li>URL or location of the infringing content</li>
                <li>Your statement under penalty of perjury</li>
                <li>Your signature (electronic or physical)</li>
              </ul>
            </div>
          </section>

          {/* Attribution Standards Section */}
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Our Attribution Standards</h2>
            <div className="bg-white/5 border border-gray-700 rounded-lg p-6 space-y-4 text-gray-300">
              <p>
                IOARTS follows these principles for all content and attributions:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Always credit original creators and artists</li>
                <li>Clearly indicate when content is fan-created or unofficial</li>
                <li>Provide direct links to artist portfolios when possible</li>
                <li>Respect all intellectual property rights and licenses</li>
                <li>Remove content promptly if requested by copyright holders</li>
                <li>Maintain transparent communication with creators and rights holders</li>
              </ul>
            </div>
          </section>

          {/* Contact Section */}
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Questions or Concerns?</h2>
            <div className="bg-white/5 border border-gray-700 rounded-lg p-6 space-y-4 text-gray-300">
              <p>
                If you have any questions about copyright, attribution, or intellectual property matters, we&apos;re here to help. Contact us at:
              </p>
              <div className="space-y-2">
                <p><span className="text-white font-semibold">General Inquiries:</span> support@ioarts.ink</p>
                <p><span className="text-white font-semibold">Copyright Issues:</span> copyright@ioarts.ink</p>
                <p><span className="text-white font-semibold">Licensing:</span> licensing@ioarts.ink</p>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <div className="text-center text-gray-500 text-sm pt-8 border-t border-gray-800">
            <p>Last updated: January 2025</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-6 mt-16 pt-12 border-t border-gray-800">
          <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-of-sale" className="text-gray-400 hover:text-white transition-colors">
            Terms of Sale
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
