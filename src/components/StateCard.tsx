'use client'

import { useState } from 'react'
import ImagePlaceholder from './ImagePlaceholder'
import { State } from '@/lib/supabase'

interface StateCardProps {
  state: State
  onStateSelect: (stateId: number, stateName: string) => void
  className?: string
}

export default function StateCard({ 
  state, 
  onStateSelect, 
  className = '' 
}: StateCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={() => onStateSelect(state.id, state.name)}
      className={`
        group bg-white rounded-xl shadow-md hover:shadow-xl 
        transition-all duration-300 p-6 text-left 
        border border-gray-200 hover:border-blue-300 
        transform hover:-translate-y-2 hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4">
        {/* 状態画像 */}
        <div className="shrink-0">
          <div className="relative">
            <ImagePlaceholder
              src={state.image_url || '/images/placeholder.svg'}
              alt={state.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
            />
            
            {/* ホバー時のアイコン */}
            {isHovered && (
              <div className="absolute inset-0 bg-blue-600 bg-opacity-80 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* 状態情報 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
            {state.name}
          </h3>
          {state.description && (
            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
              {state.description}
            </p>
          )}
        </div>

        {/* 矢印アイコン */}
        <div className="shrink-0">
          <svg 
            className={`
              w-5 h-5 text-gray-400 group-hover:text-blue-600 
              transition-all duration-300 transform group-hover:translate-x-1
            `} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  )
}

