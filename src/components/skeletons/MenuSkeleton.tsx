// Dosya Yolu: src/components/skeletons/MenuSkeleton.tsx

const SkeletonFilterButton = () => (
    <div className="h-[46px] w-24 bg-gray-200 rounded-full"></div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
    <div className="w-full h-56 bg-gray-300"></div>
    <div className="p-6">
      <div className="flex justify-between items-start gap-4">
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
      </div>
      <div className="mt-4 h-4 bg-gray-300 rounded w-full"></div>
      <div className="mt-2 h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  </div>
);

export default function MenuSkeleton() {
  return (
    <div className="container mx-auto">
      <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-12 animate-pulse"></div>
      
      {/* Filtre İskeleti */}
      <div className="flex justify-center mb-12">
        <div className="flex flex-wrap justify-center items-center p-1.5 rounded-full shadow-md gap-2">
            <SkeletonFilterButton />
            <SkeletonFilterButton />
            <SkeletonFilterButton />
            <SkeletonFilterButton />
        </div>
      </div>

      {/* Ürün Kartları İskeleti */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}