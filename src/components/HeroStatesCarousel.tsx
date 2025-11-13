'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { State } from '@/lib/supabase'

interface HeroStatesCarouselItem {
  state: State
  backgroundImageUrl: string
}

interface HeroStatesCarouselProps {
  items: HeroStatesCarouselItem[]
}

export default function HeroStatesCarousel({ items }: HeroStatesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 各スライド用の背景色を生成
  const getBackgroundColor = (index: number) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ]
    return colors[index % colors.length]
  }

  // スライドが切り替わるたびに、次のスライドをスケジュール
  useEffect(() => {
    if (items.length === 0 || isPaused) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }

    // 既存のタイムアウトをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // スライド間隔（4〜6秒のランダム）
    const slideInterval = 4000 + Math.random() * 2000

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
    }, slideInterval)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [currentIndex, items.length, isPaused])

  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  const handleFocus = () => {
    setIsPaused(true)
  }

  const handleBlur = () => {
    setIsPaused(false)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div
      className="relative w-full h-48 md:h-56 lg:h-64 overflow-hidden bg-transparent"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {items.map((item, index) => {
        const isVisible = index === currentIndex
        
        return (
        <Link
          key={item.state.id}
          href={`/suggestion/${item.state.id}?mode=effects`}
          className={`
            absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out
            ${isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0'}
          `}
          tabIndex={isVisible ? 0 : -1}
        >
          {/* 背景色 */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              background: getBackgroundColor(index),
              zIndex: 0,
            }}
          />

          {/* 効果名 */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center px-4"
              style={{
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)',
              }}
            >
              {item.state.name}
            </h2>
          </div>
        </Link>
        )
      })}

      {/* インジケーター（オプション） */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentIndex(index)
              }}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${index === currentIndex ? 'bg-white w-8' : 'bg-white bg-opacity-50'}
              `}
              aria-label={`スライド ${index + 1} に移動`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

