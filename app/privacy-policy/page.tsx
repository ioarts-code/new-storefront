import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | IOARTS',
  description: 'Privacy policy for IOARTS digital art merchandise store. Learn how we handle your personal data.',
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#0F0F0F]">
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 text-sm transition-colors"
          >
            ← Back to Home
          </Link>
          <h1 className="font-['Inter:Bold',sans-serif] font-bold text-4xl md:text-6xl lg:text-[80px] text-white uppercase tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-400 mt-4">Last updated: January 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              IOARTS ("we", "our", or "us") operates the IOARTS website and digital art merchandise store. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
                <p className="text-gray-300 leading-relaxed">
                  When you make a purchase or interact with our Services, we collect personal information including:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mt-3 ml-2">
                  <li>Name and email address</li>
                  <li>Billing and shipping address</li>
                  <li>Phone number (if provided)</li>
                  <li>Payment information (processed securely through approved payment providers)</li>
                  <li>Order history and preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Automatically Collected Information</h3>
                <p className="text-gray-300 leading-relaxed">
                  When you visit our website, we automatically collect certain information:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mt-3 ml-2">
                  <li>Device information (type, operating system, browser)</li>
                  <li>IP address and location data</li>
                  <li>Pages visited and time spent on the website</li>
                  <li>Referring website information</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed">We use the information we collect for the following purposes:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-2">
              <li>Processing and fulfilling your orders</li>
              <li>Sending order confirmations and updates</li>
              <li>Providing customer support</li>
              <li>Sending marketing communications (with your consent)</li>
              <li>Improving our website and services</li>
              <li>Detecting and preventing fraud</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          {/* Payment Processing */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Payment Processing</h2>
            <p className="text-gray-300 leading-relaxed">
              We use secure third-party payment providers. We do not store your credit card information on our servers. All payment data is encrypted and processed according to applicable PCI DSS compliance standards.
            </p>
          </section>

          {/* Data Sharing */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Data Sharing</h2>
            <p className="text-gray-300 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-2">
              <li>Service providers who assist with order fulfillment and shipping</li>
              <li>Payment processors (when checkout is enabled)</li>
              <li>Content management systems (Hygraph)</li>
              <li>Analytics providers (Vercel Analytics)</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Cookies */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Cookies and Tracking</h2>
            <p className="text-gray-300 leading-relaxed">
              Our website uses cookies and similar tracking technologies to enhance your experience. These may include:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-3 ml-2">
              <li>Session cookies (deleted when you close your browser)</li>
              <li>Persistent cookies (stored on your device)</li>
              <li>Third-party analytics cookies</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-3">
              You can control cookies through your browser settings. Disabling cookies may affect website functionality.
            </p>
          </section>

          {/* Your Rights */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Your Rights</h2>
            <p className="text-gray-300 leading-relaxed">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-3 ml-2">
              <li>Right to access your personal information</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to request deletion of your data</li>
              <li>Right to opt-out of marketing communications</li>
              <li>Right to data portability</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              To exercise any of these rights, please contact us at privacy@ioarts.ink
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Our Services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will take steps to delete such information and terminate the child's account.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Third-Party Links</h2>
            <p className="text-gray-300 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing personal information.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Changes to This Privacy Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by updating the "Last updated" date at the top of this page. Your continued use of our Services constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact Us */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-white/5 border border-gray-700 rounded-lg">
              <p className="text-white font-semibold">IOARTS</p>
              <p className="text-gray-300">Email: privacy@ioarts.ink</p>
              <p className="text-gray-300">Website: ioarts.ink</p>
            </div>
          </section>
        </div>

        {/* Footer Link */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
