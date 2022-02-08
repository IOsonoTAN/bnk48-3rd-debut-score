import puppeteer from 'puppeteer'
import BigNumber from 'bignumber.js'
import userAgent from 'user-agents'

const members = [
  "Earn",
  "Earth",
  "Eve",
  "Fame",
  "Grace",
  "Hoop",
  "Jaokhem",
  "Kaofrang",
  "Mean",
  "Monet",
  "Paeyah",
  "Pampam",
  "Pancake",
  "Peak",
  "Pim",
  "Popper",
  "Yayee",
  "Yoghurt"
];

const getVote = (index) => {
  return `body > div.layout-container > main > section > div.card > div.card-body > div:nth-child(11) > span > div:nth-child(${2+(3*(index+1))})`;
}

export default async function handler(req, res) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(userAgent.toString())
  await page.goto('https://scan.tokenx.finance/address/0x1c7157A8043b04258516858Ad9bD9952E0D5ec8B/read-contract');
  await page.waitForSelector(getVote(1))

  const ranked = []
  const fractor = new BigNumber("1000000000000000000");

  for (let index = 0; index < members.length; index++) {
    const amount = await page.$(getVote(index))
    let value = await page.evaluate(el => el.textContent, amount)
    value = value.replace("(uint256) :", "");
    value = new BigNumber(value)
    ranked.push({
      name: members[index],
      score: value.dividedBy(fractor).toFixed(10)
    })
  }

  ranked.sort((a, b) => b.score - a.score)

  await browser.close()

  return res.status(200).json({
    updatedAt: new Date(),
    ranked
  })
}
