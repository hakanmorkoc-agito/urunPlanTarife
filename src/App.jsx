import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ProductTariffDefinitions from './pages/ProductTariffDefinitions'
import PlanDefinition from './pages/PlanDefinition'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/urun-tarife-tanimlari" element={<ProductTariffDefinitions />} />
          <Route path="/plan-tanimi/:id?" element={<PlanDefinition />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

