import puppeteer from 'puppeteer'
import userAgent from 'user-agents'

export default async function handler(req, res) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setUserAgent(userAgent.toString())
  await page.goto('https://scan.tokenx.finance/address/0x1c7157A8043b04258516858Ad9bD9952E0D5ec8B/read-contract')
  await page.content()
  await page.waitForSelector('div.d-flex.py-2.border-bottom:nth-child(11) > span > div')

  const rawData = await page.evaluate(() =>
    Array.from(document.querySelectorAll('div.d-flex.py-2.border-bottom:nth-child(11) > span > div'),
    element => element.textContent
  ))
  await browser.close()

  const lists = rawData.slice(3)
  const fractor = 1000000000000000000

  const members = lists.filter(list => list.includes('string')).map(name => name.split(':')[1].trim())
  const votes = lists.filter(list => list.includes('uint256')).map(name => name.split(':')[1].trim() / fractor)

  const ranked = members.map((name, index) => {
    return {
      name: name,
      vote: votes[index].toFixed(10)
    }
  })

  ranked.sort((a, b) => b.vote - a.vote)

  return res.status(200).json({
    updatedAt: new Date(),
    ranked
  })
}
