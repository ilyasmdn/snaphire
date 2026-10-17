import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const linkGroups = [
    {
      title: "Product",
      links: [
        { href: "/pricing", label: "Pricing" },
        { href: "/features", label: "Features" },
        { href: "/dashboard", label: "Dashboard" },
      ],
    },
    {
      title: "Resources",
      links: [
        { href: "/resources", label: "Learning Resources" },
        { href: "/contact", label: "Help Center" },
        { href: "/contact", label: "Contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
      ],
    },
  ];

  const socials = [
    { href: "https://twitter.com/snaphire", label: "Twitter", Icon: Twitter },
    {
      href: "https://linkedin.com/company/snaphire",
      label: "LinkedIn",
      Icon: Linkedin,
    },
    { href: "https://github.com/snaphire", label: "GitHub", Icon: Github },
  ];

  return (
    <footer className="w-full border-t border-border/60 bg-card/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center overflow-hidden rounded-xl ring-1 ring-border">
                <Image
                  src="/snaphire.png"
                  alt="SnapHire Logo"
                  width={36}
                  height={36}
                  className="size-9 object-cover"
                />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                SnapHire
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Transforming interview preparation with AI-powered practice and
              personalized feedback.
            </p>
            <div className="flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-display text-sm font-semibold text-foreground">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>© {currentYear} SnapHire. All rights reserved.</p>
          <p>Built for people who want to land the offer.</p>
        </div>
      </div>
    </footer>
  );
}
