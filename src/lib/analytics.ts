// Google Analytics 4 イベント送信
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

// GA4イベント送信関数
export const sendGAEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

// 特定のイベント送信関数
export const trackViewHome = () => {
  sendGAEvent('view_home')
}

export const trackSwitchMode = (mode: 'effects' | 'categories') => {
  sendGAEvent('switch_mode', {
    mode: mode
  })
}

export const trackSelectCategoryTab = (categoryName: string, position: number) => {
  sendGAEvent('select_category_tab', {
    category_name: categoryName,
    position: position
  })
}

export const trackViewEffectList = (mode: 'effects' | 'category', categoryName?: string) => {
  sendGAEvent('view_effect_list', {
    mode: mode,
    category_name: categoryName
  })
}

export const trackSelectEffect = (effectId: number, effectName: string, mode: 'effects' | 'category', categoryName?: string, rank?: number) => {
  sendGAEvent('select_effect', {
    effect_id: effectId,
    effect_name: effectName,
    mode: mode,
    category_name: categoryName,
    rank: rank
  })
}

export const trackSelectState = (stateName: string) => {
  sendGAEvent('select_state', {
    state_name: stateName
  })
}

export const trackViewSuggestion = (stateName: string) => {
  sendGAEvent('view_suggestion', {
    state_name: stateName
  })
}

export const trackClickAffiliate = (stateName: string, productName: string, productId: number) => {
  sendGAEvent('click_affiliate', {
    state_name: stateName,
    product_name: productName,
    product_id: productId
  })
}
