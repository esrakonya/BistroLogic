// Dosya Yolu: src/components/skeletons/MenuSkeleton.tsx

const SkeletonFilterButton = () => (
  <div className="h-10 w-28 bg-neutral-200 rounded-full animate-pulse"></div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden animate-pulse">
    {/* Image Area */}
    <div className="w-full h-56 md:h-64 bg-neutral-200"></div>
    
    {/* Content Area */}
    <div className="p-8 space-y-6">
      <div className="space-y-3">
        {/* Title Placeholder */}
        <div className="h-7 bg-neutral-200 rounded-lg w-3/4"></div>
        {/* Description Lines */}
        <div className="space-y-2">
          <div className="h-3 bg-neutral-100 rounded w-full"></div>
          <div className="h-3 bg-neutral-100 rounded w-5/6"></div>
        </div>
      </div>
      
      {/* Footer Placeholder */}
      <div className="pt-5 border-t border-neutral-50 flex justify-between items-center">
        <div className="h-3 bg-neutral-100 rounded w-12"></div>
        <div className="h-6 bg-neutral-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

export default function MenuSkeleton() {
  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-700">
        
        {/* --- HEADER SKELETON --- */}
        <div className="flex flex-col items-center space-y-6 mb-16 md:mb-24">
          <div className="h-10 w-10 bg-neutral-200 rounded-xl animate-pulse"></div>
          <div className="space-y-4 flex flex-col items-center w-full">
            <div className="h-3 bg-neutral-200 rounded-full w-32 tracking-[0.4em]"></div>
            <div className="h-12 md:h-16 bg-neutral-300 rounded-2xl w-3/4 md:w-1/2"></div>
            <div className="h-4 bg-neutral-200 rounded-full w-full max-w-xl"></div>
          </div>
        </div>
        
        {/* --- CATEGORY NAV SKELETON --- */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/50 backdrop-blur-sm p-2 rounded-full border border-neutral-100 flex flex-wrap justify-center items-center gap-2">
              <SkeletonFilterButton />
              <SkeletonFilterButton />
              <SkeletonFilterButton />
              <SkeletonFilterButton />
          </div>
        </div>

        {/* --- PRODUCT GRID SKELETON --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}