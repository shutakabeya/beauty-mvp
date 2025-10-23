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
