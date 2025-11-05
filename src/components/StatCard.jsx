import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const StatCard = ({ title, data, total, totalLabel, chartType = 'donut', isLoading = false }) => {
  const COLORS = data.map(d => d.color || '#6b7280')
  const hasData = data.some(item => item.value > 0)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <span className="text-sm text-gray-400">Yükleniyor...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {hasData ? (
            <ResponsiveContainer width="100%" height={200}>
              {chartType === 'column' ? (
                <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} height={50} angle={-15} textAnchor="end" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-bar-${index}`} fill={COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="flex h-48 items-center justify-center">
              <span className="text-sm text-gray-400">Seçilen kriterlere göre veri bulunamadı</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Toplam:</span>
          <span className="text-lg font-bold text-gray-900">
            {total} {totalLabel}
          </span>
        </div>
      </div>
    </div>
  )
}

export default StatCard

