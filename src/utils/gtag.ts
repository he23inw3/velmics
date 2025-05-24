export const GA_ID = import.meta.env.VITE_GTAG_ID

export const initGtag = () => {
    if (!GA_ID) return

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(script)

    let dataLayer = (window as any).dataLayer
    dataLayer = dataLayer || []

    let gtag = (window as any).gtag
    gtag = function(...args: any[]) {
        dataLayer.push(args)
    }

    gtag('js', new Date())
    gtag('config', GA_ID, {
        page_path: window.location.pathname,
    })
}

export const sendPageView = (url: string) => {
    const gtag = (window as any).gtag
    if (gtag)  {
        gtag('config', GA_ID, {
            page_path: url
        })
    }
}

export const sendEvent = (
  action: string,
  category?: string,
  label?: string,
  value?: number
) => {
    const gtag = (window as any).gtag
    if (!gtag) return
    gtag('event', action, {
        event_category: category,
        event_label: label,
        value,
    })
}