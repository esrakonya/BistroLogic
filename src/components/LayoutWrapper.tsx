//File path: src/components/LayoutWrapper.tsx
'use client';

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutWrapperProps {
    children: React.ReactNode;
    navbar: React.ReactNode;
    footer: React.ReactNode;
}

export default function LayoutWrapper({ children, navbar, footer }: LayoutWrapperProps) {
    const pathname = usePathname();

    const isHiddenPage = pathname?.startsWith('/admin') || pathname === '/login';

    return (
        <>  
            {!isHiddenPage && navbar}
            <main className="flex-grow">
                {children}
            </main>
            {!isHiddenPage && footer}
        </>
    );
}