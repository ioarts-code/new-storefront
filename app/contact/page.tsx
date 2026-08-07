import Link from 'next/link';
import { BackToHomeButton } from '@/components/back-to-home-button';

export const metadata = {
  title: 'Contact | IOARTS',
  description: 'Contact IOARTS for general support, copyright, and licensing inquiries.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0F0F0F]">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <div className="mb-16">
          <BackToHomeButton className="mb-8" />
          <h1 className="font-bold text-5xl md:text-7xl text-white uppercase tracking-tight mb-4">
            Contact
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Reach out for support, rights inquiries, and collaborations.
          </p>
        </div>

        <div className="space-y-12">
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">General Support</h2>
            <div className="bg-white/5 border border-gray-700 rounded-lg p-6 space-y-4 text-gray-300">
              <p>
                For order help, product questions, or website support, email us at:
              </p>
              <p>
                <span className="text-white font-semibold">support@ioarts.ink</span>
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Copyright & Legal</h2>
            <div className="bg-white/5 border border-gray-700 rounded-lg p-6 space-y-4 text-gray-300">
              <p>
                For copyright concerns, takedown requests, or legal matters, contact:
              </p>
              <p>
                <span className="text-white font-semibold">copyright@ioarts.ink</span>
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Licensing & Partnerships</h2>
            <div className="bg-white/5 border border-gray-700 rounded-lg p-6 space-y-4 text-gray-300">
              <p>
                For licensing and collaboration opportunities, email:
              </p>
              <p>
                <span className="text-white font-semibold">licensing@ioarts.ink</span>
              </p>
            </div>
          </section>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-16 pt-12 border-t border-gray-800">
          <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-of-sale" className="text-gray-400 hover:text-white transition-colors">
            Terms of Sale
          </Link>
          <Link href="/copyright-attribution" className="text-gray-400 hover:text-white transition-colors">
            Copyright & Attribution
          </Link>
        </div>
      </div>
    </main>
  );
}
