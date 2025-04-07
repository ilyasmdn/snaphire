"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {

  const [theme, setTheme] = useState("dark")

  const toggleTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark", newTheme === "dark");
  };
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    setTheme(storedTheme);
    document.body.classList.toggle("dark", storedTheme === "dark");
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className="sticky top-0 px-4 md:px-12 py-2 bg-background flex justify-between items-center shadow-md">
      <Link href="/" className="flex items-center text-2xl font-bold text-text">
        <Image src="/snaphire.png" alt="SnapHire Logo" width={50} height={50} />
        SnapHire
      </Link>
      <ul className="flex items-center gap-8">
        <li>
          <Link href="/" className="nav-link">
            Home
          </Link>
        </li>
        <li>
          <Link href="/" className="nav-link">
            How it Works
          </Link>
        </li>
        <li>
          <Link href="/" className="nav-link">
            Pricing
          </Link>
        </li>
      </ul>
      <div className="flex items-center gap-10">
      <Button 
      variant="outline"
      size="icon"
      className="rounded-full hover:bg-text/30 "
      onClick={toggleTheme}>
        {theme == "light" ?<Moon /> : <Sun />}
      </Button>
      <Button asChild className="inline-flex">
        <Link href="/sign-in">Start Free Trial</Link>
      </Button>
      </div>
    </nav>
  );
};

export default Navbar;
