import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { getCompany } from '../data/companies.js'
import { METHODOLOGIES, DEFAULT_METHODOLOGY } from '../data/methodologies.js'

const StoreContext = createContext(null)
const LS_KEY = 'HalalVests-state-v1'

const load = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {} } catch { return {} }
}

// Demo portfolio preloaded so the app is immediately demonstrable.
const demoState = {
  watchlist: ['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'ADBE'],
  recent: ['NVDA', 'AAPL', 'MSFT'],
  methodology: DEFAULT_METHODOLOGY,
  portfolios: [
    {
      id: 'demo',
      name: 'My Halal Growth Portfolio',
      cash: 2000,
      holdings: [
        { ticker: 'AAPL', shares: 10, costBasis: 190 },
        { ticker: 'NVDA', shares: 8, costBasis: 120 },
        { ticker: 'MSFT', shares: 5, costBasis: 420 },
        { ticker: 'GOOGL', shares: 6, costBasis: 175 },
        { ticker: 'ADBE', shares: 3, costBasis: 380 },
      ],
    },
  ],
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = load()
    return { ...demoState, ...saved, portfolios: saved.portfolios || demoState.portfolios }
  })

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)) } catch { /* storage unavailable */ }
  }, [state])

  const update = useCallback((patch) => setState(s => ({ ...s, ...patch })), [])

  const toggleWatchlist = useCallback((ticker) => {
    setState(s => ({
      ...s,
      watchlist: s.watchlist.includes(ticker)
        ? s.watchlist.filter(t => t !== ticker)
        : [...s.watchlist, ticker],
    }))
  }, [])

  const pushRecent = useCallback((ticker) => {
    setState(s => ({ ...s, recent: [ticker, ...s.recent.filter(t => t !== ticker)].slice(0, 6) }))
  }, [])

  const methodology = METHODOLOGIES[state.methodology] || METHODOLOGIES[DEFAULT_METHODOLOGY]

  const value = useMemo(() => ({
    ...state, update, toggleWatchlist, pushRecent, methodology,
    getCompany,
    createPortfolio: (name) => {
      const id = `p-${Date.now()}`
      setState(s => ({ ...s, portfolios: [...s.portfolios, { id, name: name || 'New Portfolio', cash: 0, holdings: [] }] }))
      return id
    },
    deletePortfolio: (id) => setState(s => ({ ...s, portfolios: s.portfolios.filter(p => p.id !== id) })),
    updatePortfolio: (id, patch) => setState(s => ({
      ...s, portfolios: s.portfolios.map(p => p.id === id ? { ...p, ...patch } : p),
    })),
    addHolding: (id, ticker, shares) => setState(s => ({
      ...s,
      portfolios: s.portfolios.map(p => p.id === id
        ? { ...p, holdings: [...p.holdings.filter(h => h.ticker !== ticker), { ticker, shares, costBasis: getCompany(ticker)?.price }] }
        : p),
    })),
    removeHolding: (id, ticker) => setState(s => ({
      ...s, portfolios: s.portfolios.map(p => p.id === id
        ? { ...p, holdings: p.holdings.filter(h => h.ticker !== ticker) } : p),
    })),
    setShares: (id, ticker, shares) => setState(s => ({
      ...s, portfolios: s.portfolios.map(p => p.id === id
        ? { ...p, holdings: p.holdings.map(h => h.ticker === ticker ? { ...h, shares } : h) } : p),
    })),
  }), [state, update, toggleWatchlist, pushRecent, methodology])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
