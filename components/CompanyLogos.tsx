import React from "react";

/**
 * Component that displays logos of companies where SnapHire users have landed jobs
 */
export default function CompanyLogos() {
  // Companies where users have landed jobs
  const companies = [
    { name: "Meta", logo: "/companies/meta.svg" },
    { name: "Google", logo: "/companies/google.svg" },
    { name: "Netflix", logo: "/companies/netflix.svg" },
    { name: "Microsoft", logo: "/companies/microsoft.svg" },
    { name: "Amazon", logo: "/companies/amazon.svg" },
    { name: "Apple", logo: "/companies/apple.svg" },
  ];

  return (
    <div className="w-full py-6 mt-2">
      <p className="text-center text-sm text-text/50 mb-6">
        Our users have landed roles at
      </p>{" "}
      <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
        {companies.map((company) => (
          <div
            key={company.name}
            className="flex items-center grayscale hover:grayscale-0 transition-all duration-200"
          >
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="h-7 md:h-8"
              title={company.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
