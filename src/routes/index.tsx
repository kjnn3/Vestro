import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  const [symbols, setSymbols] = useState<string[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NABIL')
  const [priceData, setPriceData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3001/api/symbols')
      .then(res => res.json())
      .then(data => setSymbols(data))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    if (selectedSymbol) {
      setLoading(true)
      fetch(`http://localhost:3001/api/price/${selectedSymbol}`)
        .then(res => res.json())
        .then(data => {
            // Data is DESC, need ASC for chart
            setPriceData(data.reverse())
            setLoading(false)
        })
        .catch(err => {
            console.error(err)
            setLoading(false)
        })
    }
  }, [selectedSymbol])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">NEPSE Quant Terminal Web</h1>

      <div className="flex gap-4">
        <div className="w-1/4">
            <h2 className="text-xl font-semibold mb-2">Symbols</h2>
            <div className="h-96 overflow-y-auto border rounded p-2">
                {symbols.map(sym => (
                    <div
                        key={sym}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedSymbol === sym ? 'bg-blue-100 font-bold' : ''}`}
                        onClick={() => setSelectedSymbol(sym)}
                    >
                        {sym}
                    </div>
                ))}
            </div>
        </div>
        <div className="w-3/4">
            <h2 className="text-xl font-semibold mb-2">{selectedSymbol} - Price History</h2>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="h-96 border rounded p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={priceData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={['auto', 'auto']} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}
