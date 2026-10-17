import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "SnapHire's Privacy Policy - How we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "May 7, 2025";

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="space-y-8">
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">1. Introduction</h2>
          <p className="text-muted-foreground">
            Welcome to SnapHire ("we," "our," or "us"). We respect your privacy
            and are committed to protecting your personal data. This privacy
            policy explains how we collect, use, and share information about you
            when you use our website and services.
          </p>
          <p className="text-muted-foreground">
            Please read this privacy policy carefully. By using our services,
            you acknowledge that you have read and understood this policy.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">2. Information We Collect</h2>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">2.1 Personal Information</h3>
            <p className="text-muted-foreground">
              We may collect the following types of personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Contact information (such as name, email address)</li>
              <li>Account credentials (such as username and password)</li>
              <li>Professional information (such as job title, industry)</li>
              <li>
                Payment information (processed through secure third-party
                payment processors)
              </li>
              <li>Content of your interview responses and practice sessions</li>
            </ul>

            <h3 className="text-xl font-semibold">2.2 Usage Data</h3>
            <p className="text-muted-foreground">
              We automatically collect certain information when you visit, use,
              or navigate our platform, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                Device and connection information (IP address, browser type,
                device type)
              </li>
              <li>Usage information (pages viewed, time spent, clicks)</li>
              <li>
                Performance data (such as your interview scores and feedback)
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">3. How We Use Your Information</h2>
          <p className="text-muted-foreground">
            We use your personal information for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>To provide and improve our services</li>
            <li>To personalize your experience on our platform</li>
            <li>To process payments and manage your account</li>
            <li>To communicate with you about our services</li>
            <li>To provide customer support</li>
            <li>To analyze usage patterns and improve our platform</li>
            <li>To protect our services and prevent fraud</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">4. Data Sharing and Disclosure</h2>
          <p className="text-muted-foreground">We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Service providers who help us operate our business</li>
            <li>Payment processors to complete transactions</li>
            <li>Analytics providers to help us understand usage</li>
            <li>Legal authorities when required by law</li>
          </ul>
          <p className="text-muted-foreground">
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">5. Data Security</h2>
          <p className="text-muted-foreground">
            We implement appropriate technical and organizational measures to
            protect your personal information. However, no method of
            transmission over the Internet or electronic storage is 100% secure,
            and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">6. Your Rights</h2>
          <p className="text-muted-foreground">
            Depending on your location, you may have the following rights:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Access and receive a copy of your personal data</li>
            <li>Rectify inaccurate personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict processing of your personal data</li>
            <li>Data portability</li>
          </ul>
          <p className="text-muted-foreground">
            To exercise these rights, please contact us using the information
            provided in the "Contact Us" section.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            7. Cookies and Tracking Technologies
          </h2>
          <p className="text-muted-foreground">
            We use cookies and similar tracking technologies to collect and use
            personal information about you, including to serve interest-based
            advertising. For more information about cookies and how you can
            disable them, please see our Cookie Policy.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">8. Children's Privacy</h2>
          <p className="text-muted-foreground">
            Our services are not directed to children under 16. We do not
            knowingly collect personal information from children under 16. If
            you are a parent or guardian and you are aware that your child has
            provided us with personal information, please contact us.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            9. Changes to This Privacy Policy
          </h2>
          <p className="text-muted-foreground">
            We may update this privacy policy from time to time. The updated
            version will be indicated by an updated "Last updated" date and will
            be effective as soon as it is accessible. We encourage you to review
            this privacy policy frequently to be informed of how we are
            protecting your information.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">10. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have questions or comments about this policy, you may email
            us at privacy@snaphire.com or by post to:
          </p>
          <address className="text-muted-foreground not-italic">
            SnapHire
            <br />
            123 Interview Lane
            <br />
            San Francisco, CA 94105
            <br />
            United States
          </address>
        </section>
      </div>
    </div>
  );
}
