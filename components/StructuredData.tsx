"use client";

import { Organization, WebSite, WithContext } from "schema-dts";
import React from "react";

export function StructuredData() {
  const organizationSchema: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SnapHire",
    url: "https://snaphire.com",
    logo: "https://snaphire.com/snaphire.png",
    description:
      "AI-powered interview practice platform that helps job seekers prepare for interviews.",
    sameAs: [
      "https://twitter.com/snaphire",
      "https://linkedin.com/company/snaphire",
      "https://github.com/snaphire",
    ],
  };

  const websiteSchema: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SnapHire",
    url: "https://snaphire.com",
    description:
      "AI-powered interview practice platform that helps job seekers prepare for interviews.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://snaphire.com/search?q={search_term_string}",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
