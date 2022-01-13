const geoip = require('geoip-lite')
const xlsx = require('xlsx')

const searchController = {
  location: async (req, res) => {
    //將使用者輸入資料整理成lib可用格式
    const ip = req.body.ip.split(",\r\n")
    const ipLocation = []
    let dataVol = ip.length
    let invalidVol = 0
    for (let i = 0; i < ip.length; i++) {
      const result = await geoip.lookup(ip[i])
      if (result === null) {
        invalidVol++
      } else {
        result.IP = ip[i]
        ipLocation.push(result)
      }
    }
    let successVol = dataVol - invalidVol
    //網頁顯示結果
    res.render('result', { dataVol, invalidVol, successVol, ipLocation })
    //建立excel
    let searchResult = xlsx.utils.json_to_sheet(ipLocation)
    let workBook = {
      SheetNames: ['searchResult'],
      Sheets: {
        'searchResult': searchResult,
      }
    }
    return xlsx.writeFile(workBook, "../result.xlsx")
  }

}

module.exports = searchController