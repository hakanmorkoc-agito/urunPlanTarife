import { useState, useMemo } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { DashboardViewContext } from '../context/DashboardViewContext'

const Layout = ({ children }) => {
  const [chartType, setChartType] = useState('donut')
  const dashboardViewValue = useMemo(() => ({ chartType, setChartType }), [chartType])

  return (
    <DashboardViewContext.Provider value={dashboardViewValue}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-white">
            {children}
          </main>
        </div>
      </div>
    </DashboardViewContext.Provider>
  )
}

export default Layout

