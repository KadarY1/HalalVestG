import { StoreProvider } from './context/store.jsx'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/Layout.jsx'
import { useRoute, matchPath, useScrollTopOnRoute } from './lib/router.jsx'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Screener from './pages/Screener.jsx'
import Research from './pages/Research.jsx'
import Portfolio from './pages/Portfolio.jsx'
import PortfolioDetail from './pages/PortfolioDetail.jsx'
import Zakat from './pages/Zakat.jsx'
import ZakatResults from './pages/ZakatResults.jsx'
import Purification from './pages/Purification.jsx'
import { Learn, LearnArticle } from './pages/Learn.jsx'
import Methodology from './pages/Methodology.jsx'
import Settings from './pages/Settings.jsx'
import { Card, Link } from './components/ui.jsx'

function NotFound() {
  return (
    <Card className="p-10 text-center">
      <h1 className="text-xl font-bold">Page not found</h1>
      <Link to="/dashboard" className="mt-2 inline-block text-sm font-bold text-brand-700">← Back to dashboard</Link>
    </Card>
  )
}

const ROUTES = [
  ['/', () => <Landing />],
  ['/dashboard', () => <Dashboard />],
  ['/screener', () => <Screener />],
  ['/research/:ticker', (p) => <Research ticker={p.ticker} />],
  ['/portfolio', () => <Portfolio />],
  ['/portfolio/:id', (p) => <PortfolioDetail id={p.id} />],
  ['/zakat', () => <Zakat />],
  ['/zakat/results', () => <ZakatResults />],
  ['/purification', () => <Purification />],
  ['/learn', () => <Learn />],
  ['/learn/:slug', (p) => <LearnArticle slug={p.slug} />],
  ['/methodology', () => <Methodology />],
  ['/settings', () => <Settings />],
]

function Router() {
  const route = useRoute()
  useScrollTopOnRoute(route)
  for (const [pattern, render] of ROUTES) {
    const params = matchPath(pattern, route)
    if (params) return render(params)
  }
  return <NotFound />
}

export default function App() {
  return (
    <StoreProvider>
      <Layout>
        <Router />
      </Layout>
            export default function App() {
          return (
          <StoreProvider>
            <Layout>
              <Router />
            </Layout>
            <Analytics />
    </StoreProvider>
  )
}
    </StoreProvider>
  )
}
