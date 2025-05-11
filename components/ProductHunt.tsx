"use client";

import { useEffect, useState } from "react";

const ProductHunt = () => {
  const [theme, setTheme] = useState("neutral");

  useEffect(() => {
    // Check for dark mode on component mount
    const isDarkMode =
      document.documentElement.classList.contains("dark") ||
      document.body.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    setTheme(isDarkMode ? "dark" : "neutral");

    // Set up listener for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark =
            document.documentElement.classList.contains("dark") ||
            document.body.classList.contains("dark");
          setTheme(isDark ? "dark" : "neutral");
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    observer.observe(document.body, { attributes: true });

    // Clean up
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-6">
      <a
        href="https://www.producthunt.com/posts/snaphire?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-snaphire"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=963837&theme=${theme}&t=1746942250991`}
          alt="SnapHire - Prepare for job interviews with AI-powered mock interviews. | Product Hunt"
          style={{ width: "250px", height: "54px" }}
          width="250"
          height="54"
        />
      </a>
    </div>
  );
};

export default ProductHunt;
