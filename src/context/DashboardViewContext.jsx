import { createContext, useContext } from 'react'

export const DashboardViewContext = createContext({
  chartType: 'donut',
  setChartType: () => {}
})

export const useDashboardView = () => useContext(DashboardViewContext)

