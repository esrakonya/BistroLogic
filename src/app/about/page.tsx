// Dosya Yolu: src/app/about/page.tsx
import { getSiteContent } from "@/lib/data";
import Image from "next/image";

export default async function AboutPage() {
  const allContent = await getSiteContent();
  
  // Database'den gelen veriyi alıyoruz
  const aboutText = allContent.find(c => c.key === 'about_us_text')?.value;

  return (
    <main className="min-h-screen bg-neutral-50 pb-20">
      {/* --- HERO BANNER --- */}
      <div className="relative h-[45vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src="/images/hero-3.webp" 
          alt="Servely Vision"
          fill
          className="object-cover"
          priority
        />
        {/* Modern Karartma Katmanı */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 flex flex-col items-center justify-center text-center px-4">
            <span className="text-white/80 uppercase tracking-[0.4em] text-xs md:text-sm mb-3 block animate-pulse">
              Elevating the Experience
            </span>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-white tracking-tighter">
              Servely
            </h1>
        </div>
      </div>

      {/* --- CONTENT CARD --- */}
      <div className="max-w-5xl mx-auto -mt-20 relative z-10 px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-20 border border-neutral-100">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sol Taraf: Küçük Başlık */}
            <div className="lg:col-span-4">
                <h2 className="text-3xl font-serif font-bold text-neutral-900 leading-tight">
                    Beyond Simple Management.
                </h2>
                <div className="h-1 w-12 bg-neutral-900 mt-6"></div>
            </div>

            {/* Sağ Taraf: Metin İçeriği */}
            <div className="lg:col-span-8">
                <article className="prose prose-neutral lg:prose-xl max-w-none text-neutral-600 leading-relaxed font-light">
                    {aboutText ? (
                    // Supabase'den gelen veri (HTML destekli)
                    <div dangerouslySetInnerHTML={{ __html: aboutText }} />
                    ) : (
                    // Veritabanı boşsa gösterilecek profesyonel İngilizce metin
                    <div className="space-y-6">
                        <p>
                            Welcome to <strong>Servely</strong>, where culinary passion meets cutting-edge technology. 
                            We believe that managing a restaurant should be as delightful as the food you serve.
                        </p>
                        <p>
                            Our platform is designed for the visionaries of the food industry—those who demand 
                            perfection in every detail, from category management to the final customer presentation. 
                            With Servely, your business isn't just managed; it's optimized for the future.
                        </p>
                    </div>
                    )}
                </article>

                {/* İstatistikler / Değerler */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-neutral-100 pt-10">
                    <div>
                        <span className="block text-2xl font-bold text-neutral-900">01</span>
                        <span className="text-xs uppercase tracking-widest text-neutral-400">Quality First</span>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold text-neutral-900">02</span>
                        <span className="text-xs uppercase tracking-widest text-neutral-400">Smart Logic</span>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold text-neutral-900">03</span>
                        <span className="text-xs uppercase tracking-widest text-neutral-400">Global Design</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}