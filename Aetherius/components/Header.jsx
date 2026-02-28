'use client'; 

// To make sure that this script is renedered on client side and not on server side for responsive design

import React, { useState } from 'react';
import Link from 'next/link'; 

//SVG Icons for smaller devices
const MenuIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export default function Header() {
  //Toggle menu is only applicable for mobile devices where hamburger menu is used
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white text-black w-full sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl md:text-3x1 font-bold md:ml-10">
              Aetherius
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
               <Link key={link.label} href={link.href} className="hover:text-gray-600 transition-colors duration-300">
                {link.label}
               </Link>
            ))}
            <Link href="/get-started">
                <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300">
                    Get Started
                </button>
            </Link>
          </nav>
          {/* The toggle menu is hidden for devices have medium or higher screen width*/}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col items-center space-y-4 py-4">
             {navLinks.map((link) => (
               <Link key={link.label} href={link.href} className="hover:text-gray-600 transition-colors duration-300" onClick={toggleMenu}>
                {link.label}
               </Link>
            ))}
            <Link href="/get-started">
                <button className="bg-black text-white w-full px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300">
                    Get Started
                </button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};