'use client'

import { useState } from 'react'
import ImagePlaceholder from './ImagePlaceholder'
import { Product } from '@/lib/supabase'

interface ProductCardProps {
  product: Product
  onProductClick: (product: Product) => void
  className?: string
}

export default function ProductCard({ 
  product, 
  onProductClick, 
  className = '' 
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isTouched, setIsTouched] = useState(false)

  return (
    <div
      className={`
        bg-white rounded-xl shadow-md hover:shadow-xl 
        transition-all duration-300 overflow-hidden 
        border border-gray-200 hover:border-blue-300
        transform hover:-translate-y-1
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => setTimeout(() => setIsTouched(false), 150)}
    >
      {/* 商品画像 */}
      <div className="aspect-[4/3] relative overflow-hidden">
        <ImagePlaceholder
          src={product.image_url || '/images/placeholder.svg'}
          alt={product.name}
          width={300}
          height={225}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* ホバー時のオーバーレイ */}
        {(isHovered || isTouched) && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 rounded-full p-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* 商品情報 */}
      <div className="p-4">
        {/* ブランド */}
        <div className="mb-2">
          <span className="inline-block px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
            {product.brand}
          </span>
        </div>
        
        {/* 商品名 */}
        <h3 className="text-base font-semibold text-gray-900 mb-1.5 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        {/* 商品説明 */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-1 leading-relaxed">
          {product.description}
        </p>

        {/* CTAボタン */}
        <button
          onClick={() => onProductClick(product)}
          className="
            w-full bg-gradient-to-r from-blue-600 to-blue-700 
            text-white py-2 px-3 rounded-lg text-sm font-medium 
            hover:from-blue-700 hover:to-blue-800 
            transition-all duration-200 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transform hover:scale-105 active:scale-95
            shadow-md hover:shadow-lg
          "
        >
          <span className="flex items-center justify-center">
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            商品を詳しく見る
          </span>
        </button>
      </div>
    </div>
  )
}

