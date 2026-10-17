import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "SnapHire's Terms of Service - Rules and guidelines for using our platform.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "May 7, 2025";

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="space-y-8">
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-3 text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">1. Agreement to Terms</h2>
          <p className="text-muted-foreground">
            Welcome to SnapHire. These Terms of Service ("Terms") govern your
            access to and use of the SnapHire website, mobile applications, and
            services (collectively, the "Services").
          </p>
          <p className="text-muted-foreground">
            By accessing or using our Services, you agree to be bound by these
            Terms. If you disagree with any part of the Terms, then you may not
            access the Services.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">2. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify these Terms at any time. If we make
            changes, we will provide notice of such changes, such as by sending
            an email notification, providing notice through the Services, or
            updating the "Last Updated" date at the beginning of these Terms.
          </p>
          <p className="text-muted-foreground">
            By continuing to access or use our Services after any revisions
            become effective, you agree to be bound by the revised terms. If you
            do not agree to the new terms, you are no longer authorized to use
            the Services.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">3. Account Registration</h2>
          <p className="text-muted-foreground">
            To use certain features of our Services, you may be required to
            create an account and provide certain information about yourself.
            You agree to provide accurate, current, and complete information
            during the registration process and to update such information to
            keep it accurate, current, and complete.
          </p>
          <p className="text-muted-foreground">
            You are responsible for safeguarding your password and for all
            activities that occur under your account. We encourage you to use a
            strong password unique to your SnapHire account.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">4. Subscription and Payments</h2>
          <div className="space-y-4">
            <h3 className="font-display text-xl font-semibold">4.1 Subscription Terms</h3>
            <p className="text-muted-foreground">
              Some aspects of the Services may be available on a subscription
              basis. By selecting a subscription, you agree to pay the
              subscription fees according to the terms presented at the time of
              purchase.
            </p>

            <h3 className="text-xl font-semibold">4.2 Recurring Billing</h3>
            <p className="text-muted-foreground">
              By purchasing a subscription, you authorize us to charge your
              payment method on a recurring basis. Subscriptions are
              automatically renewed unless you cancel before the renewal date.
            </p>

            <h3 className="text-xl font-semibold">4.3 Cancellation</h3>
            <p className="text-muted-foreground">
              You can cancel your subscription at any time through your account
              settings. If you cancel, you may continue to use your subscription
              until the end of your current billing period, but you will not
              receive a refund for any fees already paid.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            5. Intellectual Property Rights
          </h2>
          <p className="text-muted-foreground">
            The Services and their entire contents, features, and functionality
            (including but not limited to all information, software, text,
            displays, images, video, and audio, and the design, selection, and
            arrangement thereof), are owned by SnapHire, its licensors, or other
            providers of such material and are protected by United States and
            international copyright, trademark, patent, trade secret, and other
            intellectual property or proprietary rights laws.
          </p>
          <p className="text-muted-foreground">
            You must not reproduce, distribute, modify, create derivative works
            of, publicly display, publicly perform, republish, download, store,
            or transmit any of the material on our Services, except as follows:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              Your computer may temporarily store copies of such materials
              incidental to your accessing and viewing those materials.
            </li>
            <li>
              You may store files that are automatically cached by your web
              browser for display enhancement purposes.
            </li>
            <li>
              You may print or download one copy of a reasonable number of pages
              of the Services for your own personal, non-commercial use and not
              for further reproduction, publication, or distribution.
            </li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">6. User Content</h2>
          <p className="text-muted-foreground">
            Our Services may allow you to create, upload, post, send, receive,
            and store content. By providing content on or through our Services,
            you grant SnapHire a worldwide, non-exclusive, royalty-free license
            (with the right to sublicense) to use, copy, reproduce, process,
            adapt, modify, publish, transmit, display, and distribute such
            content in any and all media or distribution methods now known or
            later developed.
          </p>
          <p className="text-muted-foreground">
            You represent and warrant that you own or have the necessary rights
            to grant us the license described above, and that your content does
            not violate the law or the rights of any third party.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">7. Prohibited Uses</h2>
          <p className="text-muted-foreground">
            You may use the Services only for lawful purposes and in accordance
            with these Terms. You agree not to use the Services:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              In any way that violates any applicable federal, state, local, or
              international law or regulation.
            </li>
            <li>
              For the purpose of exploiting, harming, or attempting to exploit
              or harm minors in any way.
            </li>
            <li>
              To transmit any material that is defamatory, obscene, indecent,
              abusive, offensive, harassing, violent, hateful, inflammatory, or
              otherwise objectionable.
            </li>
            <li>
              To engage in any conduct that restricts or inhibits anyone's use
              or enjoyment of the Services.
            </li>
            <li>
              To attempt to gain unauthorized access to, interfere with, damage,
              or disrupt any parts of the Services.
            </li>
            <li>
              To use the Services for any commercial purpose or the benefit of
              any third party.
            </li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">8. Disclaimer of Warranties</h2>
          <p className="text-muted-foreground">
            THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS,
            WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
            SNAPHIRE DISCLAIMS ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT,
            AND TITLE.
          </p>
          <p className="text-muted-foreground">
            SNAPHIRE DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED,
            TIMELY, SECURE, OR ERROR-FREE, OR THAT ANY DEFECTS IN THE SERVICES
            WILL BE CORRECTED.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">9. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            IN NO EVENT WILL SNAPHIRE, ITS AFFILIATES, OR THEIR LICENSORS,
            SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE
            LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT
            OF OR IN CONNECTION WITH YOUR USE OF THE SERVICES, INCLUDING ANY
            DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE
            DAMAGES.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">10. Termination</h2>
          <p className="text-muted-foreground">
            We may terminate or suspend your account and access to the Services
            immediately, without prior notice or liability, for any reason
            whatsoever, including without limitation if you breach the Terms.
          </p>
          <p className="text-muted-foreground">
            Upon termination, your right to use the Services will immediately
            cease. All provisions of the Terms which by their nature should
            survive termination shall survive termination, including, without
            limitation, ownership provisions, warranty disclaimers, indemnity,
            and limitations of liability.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">11. Governing Law</h2>
          <p className="text-muted-foreground">
            These Terms shall be governed and construed in accordance with the
            laws of the State of California, United States, without regard to
            its conflict of law provisions.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">12. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms, please contact us at:
          </p>
          <address className="text-muted-foreground not-italic">
            SnapHire
            <br />
            123 Interview Lane
            <br />
            San Francisco, CA 94105
            <br />
            United States
            <br />
            Email: legal@snaphire.com
          </address>
        </section>
      </div>
    </div>
  );
}
