// Dosya Yolu: src/app/contact/page.tsx
import { getSiteContent } from "@/lib/data";
import { PhoneIcon, MapPinIcon, ClockIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default async function ContactPage() {
  const allContent = await getSiteContent();
  
  // Veriyi anahtarlarıyla eşleştiriyoruz
  const content = allContent.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <main className="min-h-screen bg-neutral-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* --- HEADER SECTION --- */}
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <span className="text-neutral-400 uppercase tracking-[0.4em] text-xs font-bold block">
            Get In Touch
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-neutral-900 tracking-tight">
            Contact Us
          </h1>
          <p className="mt-6 text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto font-light leading-relaxed">
            Have a question or looking to make a large reservation? We are here to help you experience the best of Servely.
          </p>
        </div>

        {/* --- MAIN CARD SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white rounded-[2.5rem] shadow-2xl shadow-neutral-200/50 overflow-hidden border border-neutral-100">
          
          {/* Left Side: Contact Details */}
          <div className="lg:col-span-5 p-8 md:p-16 bg-neutral-900 text-white flex flex-col justify-between">
            <div className="space-y-12">
              <h2 className="text-3xl font-serif font-bold italic">Information</h2>
              
              <div className="space-y-10">
                {/* Address */}
                <div className="flex items-start gap-6 group">
                  <div className="bg-white/10 p-3 rounded-2xl group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <MapPinIcon className="h-6 w-6 stroke-2" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Our Location</h3>
                    <p className="text-lg mt-1 font-light text-white/90">
                      {content.address_text || "123 Gourmet Ave, Culinary District"}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-6 group">
                  <div className="bg-white/10 p-3 rounded-2xl group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <PhoneIcon className="h-6 w-6 stroke-2" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Phone</h3>
                    <a 
                      href={`tel:${content.phone_number?.replace(/\s/g, '')}`} 
                      className="text-lg mt-1 font-light text-white/90 hover:text-white transition-colors block"
                    >
                      {content.phone_number || "+1 (234) 567 89 00"}
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-6 group">
                  <div className="bg-white/10 p-3 rounded-2xl group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <ClockIcon className="h-6 w-6 stroke-2" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Working Hours</h3>
                    <p className="text-lg mt-1 font-light text-white/90 leading-snug">
                      {content.working_days || "Mon - Sat"}: {content.working_hours || "10:00 - 22:00"}
                      <span className="block text-sm text-neutral-500 mt-1 italic">{content.closed_day_note || "Sunday Closed"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social / Branding Hint */}
            <div className="mt-16 pt-8 border-t border-white/10">
                <p className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">
                  Follow the Experience @Servely
                </p>
            </div>
          </div>

          {/* Right Side: Map Integration */}
          <div className="lg:col-span-7 h-[400px] lg:h-auto bg-neutral-100 relative">
            {content.map_embed_code ? (
              <div 
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 contrast-125"
                dangerouslySetInnerHTML={{ __html: content.map_embed_code }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                <MapPinIcon className="h-12 w-12 text-neutral-300 mb-4" />
                <p className="text-neutral-400 font-medium italic">Interactive map will be synchronized soon.</p>
              </div>
            )}
            
            {/* Map Overlay Badge */}
            <div className="absolute bottom-6 right-6 bg-white px-4 py-2 rounded-full shadow-xl border border-neutral-100 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-800">Live Location</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}