import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/market')({
  component: Market,
})

function Market() {
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:3001/api/market_quotes')
      .then(res => res.json())
      .then(data => {
          setQuotes(data)
          setLoading(false)
      })
      .catch(err => {
          console.error(err)
          setLoading(false)
      })
  }, [])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Market Quotes</h1>
      {loading ? (
          <div>Loading...</div>
      ) : (
          <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-100">
                      <tr>
                          <th className="py-2 px-4 border-b">Symbol</th>
                          <th className="py-2 px-4 border-b">Last Traded Price</th>
                          <th className="py-2 px-4 border-b">Open</th>
                          <th className="py-2 px-4 border-b">High</th>
                          <th className="py-2 px-4 border-b">Low</th>
                          <th className="py-2 px-4 border-b">Volume</th>
                      </tr>
                  </thead>
                  <tbody>
                      {quotes.map((quote, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 text-center">
                              <td className="py-2 px-4 border-b font-semibold">{quote.symbol}</td>
                              <td className="py-2 px-4 border-b">{quote.lastTradedPrice}</td>
                              <td className="py-2 px-4 border-b">{quote.openPrice}</td>
                              <td className="py-2 px-4 border-b">{quote.highPrice}</td>
                              <td className="py-2 px-4 border-b">{quote.lowPrice}</td>
                              <td className="py-2 px-4 border-b">{quote.totalTradeQuantity}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}
    </div>
  )
}
