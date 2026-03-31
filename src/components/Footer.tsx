// Dosya Yolu: /src/components/Footer.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { Squares2X2Icon } from '@heroicons/react/24/outline';

const SocialLink = ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black transition-all duration-500 shadow-xl"
  >
    <Icon className="h-5 w-5" />
  </a>
);

const getContentValue = (contents: any[], key: string) => {
  return contents?.find(c => c.key === key)?.value || '';
};

export default async function Footer() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any });

  const { data: contents, error } = await supabase.from('site_content').select('key, value');
  
  if (error) {
    console.error("[Footer Error]:", error);
    return null; // Sessiz hata yönetimi profesyonel bir yaklaşımdır
  }
  
  const safeContents = contents || [];
  const slogan = getContentValue(safeContents, 'footer_slogan');
  const phoneNumber = getContentValue(safeContents, 'phone_number');
  const address = getContentValue(safeContents, 'address_text');
  const instagramUrl = getContentValue(safeContents, 'social_instagram');

  return (
    <footer className="bg-neutral-950 text-white font-sans pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 pb-16 border-b border-white/5">
          
          {/* Column 1: Identity (Col 5) */}
          <div className="md:col-span-5 space-y-8">
            <Link href="/" className="group flex items-center gap-3 w-fit">
              <div className="bg-white p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                <Squares2X2Icon className="h-6 w-6 text-black stroke-2" />
              </div>
              <span className="text-white font-serif font-bold text-3xl tracking-tighter">
                Servely
              </span>
            </Link>
            <p className="text-neutral-500 text-lg font-light leading-relaxed max-w-sm">
              {slogan || "Experience the art of modern dining management through our scalable gourmet ecosystem."}
            </p>
          </div>

          {/* Column 2: Explore (Col 2) */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Explore</h3>
            <ul className="flex flex-col space-y-4">
              <li><Link href="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/menu" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Menu</Link></li>
              <li><Link href="/about" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Reach Us (Col 3) */}
          <div className="md:col-span-3 space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Reach Us</h3>
            <div className="flex flex-col space-y-4 text-sm font-light text-neutral-400">
              {phoneNumber && (
                <a href={`tel:${phoneNumber}`} className="hover:text-white transition-colors underline underline-offset-8 decoration-neutral-800 hover:decoration-white">
                  {phoneNumber}
                </a>
              )}
              {address && <p className="leading-relaxed">{address}</p>}
            </div>
          </div>
          
          {/* Column 4: Connect (Col 2) */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Connect</h3>
            <div className="flex gap-4">
              {instagramUrl && <SocialLink href={instagramUrl} icon={FaInstagram} />}
              {/* Fallback social placeholders if needed */}
              <SocialLink href="#" icon={FaTwitter} />
            </div>
          </div>

        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-600">
            &copy; {new Date().getFullYear()} Servely Platform. Crafted for Excellence.
          </p>
          
          <div className="flex items-center gap-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 cursor-help hover:text-neutral-400 transition-colors">Privacy Policy</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 cursor-help hover:text-neutral-400 transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}