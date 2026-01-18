export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="relative h-[70vh] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <div className="h-4 w-32 bg-gray-300 rounded-full mx-auto" />
            <div className="h-12 w-96 max-w-full bg-gray-300 rounded-lg mx-auto" />
            <div className="h-6 w-80 max-w-full bg-gray-300 rounded-lg mx-auto" />
            <div className="h-12 w-40 bg-gray-300 rounded-lg mx-auto mt-8" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <div className="h-8 w-64 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-4 w-96 max-w-full bg-gray-200 rounded-lg mx-auto animate-pulse" />
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-8 shadow-sm animate-pulse"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-6" />
                <div className="h-6 w-3/4 bg-gray-200 rounded-lg mb-4" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded" />
                  <div className="h-4 w-4/6 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="py-16 px-4 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-blue-100 rounded-lg mx-auto mb-12 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-8 text-center animate-pulse"
              >
                <div className="h-12 w-24 bg-gray-200 rounded-lg mx-auto mb-4" />
                <div className="h-5 w-32 bg-gray-200 rounded-lg mx-auto mb-2" />
                <div className="h-4 w-40 bg-gray-200 rounded-lg mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
