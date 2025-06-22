"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useRouter } from "next/router";

const navLinks = [
  { name: "Central hub", href: "/central" },
  { name: "Planetary issues", href: "/planetary-issues" },
  { name: "Starboard", href: "/starboard" },
  { name: "Launch Pad", href: "/launchpad" },
  { name: "My Space", href: "/myspace" },
];

export default function Navbar() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        backdropFilter: scrolled ? "blur(12px)" : "blur(4px)",
        background: scrolled
          ? "rgba(0,0,0,0.7)"
          : "rgba(0,0,0,0.4)",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [scrolled]);

  return (
    <nav
      ref={navRef}
      className="w-full fixed top-0 left-0 z-20 flex justify-center px-12 py-5 transition-all"
      style={{
        backdropFilter: "blur(4px)",
        background: "rgba(0,0,0,0.4)",
      }}
    >
      <div className="max-w-7xl mx-10 px-32 w-full">
        <ul className="flex items-center space-x-22">
          {/* Logo as first item */}
          <li>
            <Link href="/">
              <Image src="/planet.png" alt="Planet Logo" width={40} height={40} />
            </Link>
          </li>
          {/* Navbar items */}
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.href} legacyBehavior>
                <a
                  className={`text-white font-bold hover:text-yellow-300 transition-colors duration-200 px-2 rounded-lg
                    ${router.pathname === link.href ? 'bg-blue-950' : ''}`}
                >
                  {link.name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
