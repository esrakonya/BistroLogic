// Dosya Yolu: src/components/Navbar.tsx

'use client'; 

import Link from 'next/link';
import { useState, useEffect, Fragment } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { Transition } from '@headlessui/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Sayfa zıplamasını (Layout Shift) önlemek için bir placeholder döndürüyoruz.
    return <div className="h-20 bg-brand-red" />;
  }

  return (
    <nav className="bg-brand-red sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-white font-poppins font-bold text-2xl tracking-wider"
              onClick={() => { if (isOpen) setIsOpen(false); }}
            >
              EFSANE<span className="text-brand-yellow">PİDE</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link href="/" className="text-white hover:text-brand-yellow px-3 py-2 rounded-md font-semibold transition-colors duration-300">Ana Sayfa</Link>
              <Link href="/menu" className="text-white hover:text-brand-yellow px-3 py-2 rounded-md font-semibold transition-colors duration-300">Menü</Link>
              <Link href="/about" className="text-white hover:text-brand-yellow px-3 py-2 rounded-md font-semibold transition-colors duration-300">Hakkımızda</Link>
              <Link href="/contact" className="text-white hover:text-brand-yellow px-3 py-2 rounded-md font-semibold transition-colors duration-300">İletişim</Link>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-brand-yellow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-red focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Ana menüyü aç</span>
              {isOpen ? (
                <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
              <Link href="/" className="text-white hover:bg-red-700 hover:text-brand-yellow block px-3 py-4 rounded-md text-xl font-poppins" onClick={() => setIsOpen(false)}>Ana Sayfa</Link>
              <Link href="/menu" className="text-white hover:bg-red-700 hover:text-brand-yellow block px-3 py-4 rounded-md text-xl font-poppins" onClick={() => setIsOpen(false)}>Menü</Link>
              <Link href="/about" className="text-white hover:bg-red-700 hover:text-brand-yellow block px-3 py-4 rounded-md text-xl font-poppins" onClick={() => setIsOpen(false)}>Hakkımızda</Link>
              <Link href="/contact" className="text-white hover:bg-red-700 hover:text-brand-yellow block px-3 py-4 rounded-md text-xl font-poppins" onClick={() => setIsOpen(false)}>İletişim</Link>
            </div>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;