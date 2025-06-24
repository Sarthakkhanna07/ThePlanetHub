"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient"; // Ensure this path is correct

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
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
    });

    // Listen to login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setLoggedIn(!!session);
    });

    return () => listener?.subscription.unsubscribe();
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

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

      {/* Right: Login or Logout */}
      <div>
        {loggedIn ? (
          <button
            onClick={handleLogout}
            className="text-white font-semibold px-4 py-2 border border-gray-600 rounded-md hover:bg-white hover:text-black transition-all duration-200"
          >
            Logout
          </button>
        ) : (
          <Link href="/login" legacyBehavior>
            <a className="text-white font-semibold px-4 py-2 border border-gray-600 rounded-md hover:bg-white hover:text-black transition-all duration-200">
              Login
            </a>
          </Link>
        )}
      </div>
    </nav>
  );
}
