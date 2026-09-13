// Minimal hash-based router — zero dependencies, deep-linkable routes.
import { useState, useEffect, useCallback, createContext, useContext } from 'react'

const getHash = () => {
  const h = window.location.hash.replace(/^#/, '')
  return h || '/'
}

export function useRoute() {
  const [path, setPath] = useState(getHash)
  useEffect(() => {
    const onChange = () => setPath(getHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return path
}

export const navigate = (to) => { window.location.hash = to }

export function Link({ to, children, className = '', onClick, ...props }) {
  return (
    <a href={`#${to}`} className={className} onClick={onClick} {...props}>{children}</a>
  )
}

// Simple path matching: '/research/NVDA' against pattern '/research/:ticker'
export function matchPath(pattern, path) {
  const pParts = pattern.split('/').filter(Boolean)
  const aParts = path.split('/').filter(Boolean)
  if (pParts.length !== aParts.length) return null
  const params = {}
  for (let i = 0; i < pParts.length; i++) {
    if (pParts[i].startsWith(':')) params[pParts[i].slice(1)] = decodeURIComponent(aParts[i])
    else if (pParts[i] !== aParts[i]) return null
  }
  return params
}

export function useScrollTopOnRoute(path) {
  useEffect(() => { window.scrollTo(0, 0) }, [path])
}
