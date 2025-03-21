const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const getCoords = require('./coords')

const dataDir = path.join(__dirname, 'data')
const filePath = path.join(dataDir, 'data.json')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
}

const corsOptions = {
  origin: 'http://localhost:5173'
}

console.log('Origen:', corsOptions.origin)

app.use(bodyParser.json())
app.use(cors(corsOptions))
/*
async function getBtc () {
  try {
    const browser = await puppeteer.launch({ headless: false })

    const page = await browser.newPage()
    await page.goto('https://es.tradingview.com/symbols/BTCUSD/?exchange=CRYPTO')

    // await page.waitForSelector('span[contains(text(), "BTCUSD"), class="name-ekEcdsLD"]', { visible: true })

    // await page.waitForSelector('a > div > span.name-ekEcdsLD:contains("BTCUSD")', { visible: true })
    // await page.click('a > div > span.name-ekEcdsLD:contains("BTCUSD")')

    await page.waitForSelector('div[class="desktopFullChartButton-nORFfEfo"]', { visible: true })
    await page.click('div[class="desktopFullChartButton-nORFfEfo"]')

    await page.waitForSelector('button[aria-label="Lista de seguimiento, detalles y noticias"]', { visible: true })
    await page.click('button[aria-label="Lista de seguimiento, detalles y noticias"]')

    await page.waitForSelector('canvas[data-name="pane-canvas"]')

    const canvasElement = await page.$('canvas[data-name="pane-canvas"]')
    const { x, y } = await canvasElement.boundingBox()

    const coords = getCoords(x, y)

    for (const coord of coords) {
      await page.mouse.move(coord.x, coord.y)

      const elements = await page.$$('.valueValue-l31H9iuA')
      const valueElement = elements[4]
      const value = await valueElement.evaluate(el => el.textContent)
      console.log('Valor encontrado:', value)
    }
    await browser.close()
  } catch (error) {
    console.log(error)
  }
}
getBtc()
*/
app.get('/api/getData', async (req, res) => {
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'No hay datos almacenados' })
    }
    const data = fs.readFileSync(filePath, 'utf-8')
    res.json(JSON.parse(data))
  } catch (error) {
    console.error('Error leyendo archivo JSON: ', error)
    res.status(500).json({ error: 'Error loading data.json' })
  }
})

app.post('/api/startScrap', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: false })

    const page = await browser.newPage()
    await page.goto('https://es.tradingview.com/symbols/BTCUSD/?exchange=CRYPTO')

    // await page.waitForSelector('span[contains(text(), "BTCUSD"), class="name-ekEcdsLD"]', { visible: true })

    // await page.waitForSelector('a > div > span.name-ekEcdsLD:contains("BTCUSD")', { visible: true })
    // await page.click('a > div > span.name-ekEcdsLD:contains("BTCUSD")')

    await page.waitForSelector('div[class="desktopFullChartButton-nORFfEfo"]', { visible: true })
    await page.click('div[class="desktopFullChartButton-nORFfEfo"]')

    await page.waitForSelector('button[aria-label="Lista de seguimiento, detalles y noticias"]', { visible: true })
    await page.click('button[aria-label="Lista de seguimiento, detalles y noticias"]')

    await page.waitForSelector('canvas[data-name="pane-canvas"]')

    const canvasElement = await page.$('canvas[data-name="pane-canvas"]')
    const { x, y } = await canvasElement.boundingBox()

    const coords = getCoords(x, y)

    const candles = []
    const now = Math.floor(Date.now() / 1000) // Tiempo actual en segundos
    const daysAgo = 5 * 24 * 60 * 60 // 5 días en segundos
    let startTime = now - daysAgo

    for (const coord of coords) {
      await page.mouse.move(coord.x, coord.y)

      const elements = await page.$$('.valueValue-l31H9iuA')
      const candle = {
        time: startTime,
        open: parseFloat(await elements[1].evaluate(el => el.textContent)),
        high: parseFloat(await elements[2].evaluate(el => el.textContent)),
        low: parseFloat(await elements[3].evaluate(el => el.textContent)),
        close: parseFloat(await elements[4].evaluate(el => el.textContent))
      }

      candles.push(candle)
      startTime += 24 * 60 * 60
    }

    fs.writeFileSync(filePath, JSON.stringify(candles, null, 2))
    console.log('Datos guardados en data/data.json')
    res.json({ message: 'Datos actualizados', data: candles })

    await browser.close()
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error en el scraping' })
  }
})

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
