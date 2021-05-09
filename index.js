const axios = require("axios")
const cheerio = require("cheerio")
const fs = require("fs")

const loadHTML = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
      },
    })

    return response.data
  } catch (error) {
    console.error("Load HTML Error => ", error.stack)
  }
}

const scrapDailyCrudeOilPrice = async () => {
  try {
    const html = await loadHTML("https://www.cbn.gov.ng/rates/DailyCrude.asp")

    const $ = cheerio.load(html)

    const fileStream = fs.createWriteStream("./result.json")

    fileStream.write("[")

    $("#ContentTextinner > #othertables > tbody > tr").each((i, tr) => {
      const date = $(tr).children("td:nth-child(1)").text().trim()
      const price = $(tr).children("td:nth-child(2)").text().trim()

      fileStream.write(JSON.stringify({ date, price }, null, 2))

      if (i !== $("#ContentTextinner > #othertables > tbody > tr").length - 1) {
        fileStream.write(", \n")
      }
    })

    fileStream.write("]")

    fileStream.end()

    console.log("Scraping done!")
  } catch (error) {
    console.error("Scrap Top Cryptocurrencies => ", error)
  }
}

module.exports = scrapDailyCrudeOilPrice()
