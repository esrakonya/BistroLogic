// Dosya Yolu: src/components/Navbar.tsx
'use client'; 

import Link from 'next/link';
import { useState, useEffect, Fragment } from 'react';
import { Bars3Icon, XMarkIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Sayfa kaydırıldığında Navbar'ın arka planını değiştiren efekt
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-neutral-100 py-3 shadow-sm' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          
          {/* --- BRANDING / LOGO --- */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="group flex items-center gap-2.5 transition-all"
              onClick={() => setIsOpen(false)}
            >
              <div className={`p-1.5 rounded-lg transition-all duration-300 ${isScrolled ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900 shadow-xl'}`}>
                <Squares2X2Icon className="h-6 w-6 stroke-2" />
              </div>
              <span className={`text-2xl font-serif font-bold tracking-tighter transition-colors duration-300 ${isScrolled ? 'text-neutral-900' : 'text-white drop-shadow-md'}`}>
                Servely
              </span>
            </Link>
          </div>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`
                      px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative group
                      ${isScrolled ? 'text-neutral-500 hover:text-neutral-900' : 'text-white/80 hover:text-white'}
                    `}
                  >
                    {link.name}
                    {/* Active Indicator Line */}
                    {isActive && (
                        <div className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full ${isScrolled ? 'bg-neutral-900' : 'bg-white'}`} />
                    )}
                  </Link>
                );
              })}
            </div>
            
            {/* CTA Button: Admin Shortcut */}
            <Link 
              href="/admin" 
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                isScrolled 
                ? 'bg-neutral-900 text-white shadow-lg shadow-neutral-200' 
                : 'bg-white text-neutral-900 shadow-2xl'
              } hover:scale-105 active:scale-95`}
            >
              Management
            </Link>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-xl transition-colors ${isScrolled ? 'text-neutral-900 bg-neutral-100' : 'text-white bg-white/20'}`}
            >
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 -translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-4"
      >
        <div className="absolute top-full left-0 w-full bg-white border-b border-neutral-100 shadow-2xl md:hidden overflow-hidden rounded-b-[2rem]">
            <div className="px-6 py-10 flex flex-col gap-6 text-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="text-2xl font-serif font-bold text-neutral-900 hover:text-neutral-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-[1px] w-12 bg-neutral-100 mx-auto my-2" />
              <Link 
                href="/admin" 
                className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400"
                onClick={() => setIsOpen(false)}
              >
                Admin Access
              </Link>
            </div>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;