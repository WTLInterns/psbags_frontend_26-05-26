'use client';

export const HeroSkeleton = () => (
  <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] bg-gray-200 rounded-2xl animate-pulse mb-8 sm:mb-12">
    <div className="absolute bottom-6 left-6 space-y-4">
      <div className="h-4 bg-gray-300 rounded w-32"></div>
      <div className="h-8 bg-gray-300 rounded w-96 max-w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-64 max-w-full"></div>
      <div className="h-10 bg-gray-300 rounded-full w-32"></div>
    </div>
  </div>
);

export const GridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
    {[...Array(count)].map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-gray-200 aspect-video rounded-xl mb-4"></div>
        <div className="space-y-3 p-4">
          <div className="bg-gray-200 h-6 rounded w-3/4"></div>
          <div className="bg-gray-200 h-4 rounded w-full"></div>
          <div className="bg-gray-200 h-4 rounded w-5/6"></div>
          <div className="flex justify-between items-center pt-2">
            <div className="bg-gray-200 h-4 rounded w-24"></div>
            <div className="bg-gray-200 h-4 rounded w-16"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const BlogPostSkeleton = () => (
  <div className="animate-pulse space-y-6">
    {/* Breadcrumb */}
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    
    {/* Badge */}
    <div className="h-6 bg-gray-200 rounded w-20"></div>
    
    {/* Title */}
    <div className="space-y-2">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
    </div>
    
    {/* Meta info */}
    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    
    {/* Video thumbnail */}
    <div className="aspect-video bg-gray-200 rounded-lg"></div>
    
    {/* Content */}
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
    
    {/* Footer */}
    <div className="flex justify-between items-center pt-8 border-t border-gray-200">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
      <div className="h-10 bg-gray-200 rounded-full w-32"></div>
    </div>
  </div>
);

const BlogLoadingSkeletons = {
  HeroSkeleton,
  GridSkeleton,
  BlogPostSkeleton,
};

export default BlogLoadingSkeletons;