import Fastify from 'fastify'
import cors from '@fastify/cors'
import sqlite3 from 'sqlite3'
import path from 'path'
import fs from 'fs'

const fastify = Fastify({
  logger: true
})

fastify.register(cors, {
  origin: true
})

// Search for DB in a few plausible locations relative to the server
const possiblePaths = [
  path.join(__dirname, '../../../../nqt/data/nepse_market_data.db'),
  path.join(process.cwd(), '../data/nepse_market_data.db'),
  '/tmp/nqt/data/nepse_market_data.db'
]

let dbPath = possiblePaths.find(p => fs.existsSync(p)) || '/tmp/nqt/data/nepse_market_data.db';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database at ' + dbPath, err.message)
  } else {
    console.log('Connected to the SQLite database at ' + dbPath)
  }
})

fastify.get('/api/symbols', (request, reply) => {
    db.all('SELECT DISTINCT symbol FROM stock_prices ORDER BY symbol ASC', [], (err, rows) => {
        if (err) {
            reply.status(500).send({ error: err.message })
            return
        }
        reply.send(rows.map((row: any) => row.symbol))
    })
})

fastify.get('/api/price/:symbol', (request, reply) => {
    const { symbol } = request.params as { symbol: string }
    db.all('SELECT * FROM stock_prices WHERE symbol = ? ORDER BY date DESC LIMIT 100', [symbol], (err, rows) => {
        if (err) {
            reply.status(500).send({ error: err.message })
            return
        }
        reply.send(rows)
    })
})

fastify.get('/api/market_quotes', (request, reply) => {
    // There is no market_quotes table in this snapshot, so let's mock it using stock_prices' latest day
    db.all(`
        SELECT symbol, close as lastTradedPrice, open as openPrice, high as highPrice, low as lowPrice, volume as totalTradeQuantity
        FROM stock_prices
        WHERE date = (SELECT MAX(date) FROM stock_prices)
        ORDER BY symbol ASC
        LIMIT 500
    `, [], (err, rows) => {
        if (err) {
            reply.status(500).send({ error: err.message })
            return
        }
        reply.send(rows)
    })
})

fastify.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`Server listening on ${address}`)
})
