'use client'

interface SkeletonLoaderProps {
  type?: 'card' | 'text' | 'image' | 'button'
  className?: string
  count?: number
}

export default function SkeletonLoader({ 
  type = 'card', 
  className = '',
  count = 1 
}: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        )
      
      case 'text':
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        )
      
      case 'image':
        return (
          <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
        )
      
      case 'button':
        return (
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        )
      
      default:
        return null
    }
  }

  if (count === 1) {
    return <div className={className}>{renderSkeleton()}</div>
  }

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  )
}

