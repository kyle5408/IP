const geoip = require('geoip-lite')
const xlsx = require('xlsx')

const searchController = {
  search: async (req, res) => {
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
    let summaryJson = [{
      '輸入IP數': dataVol,
      '有效IP數': successVol,
      '無效IP數': invalidVol
    }]
    let summary = xlsx.utils.json_to_sheet(summaryJson)
    let searchResult = xlsx.utils.json_to_sheet(ipLocation)
    let workBook = {
      SheetNames: ['summary', 'searchResult'],
      Sheets: {
        'summary': summary,
        'searchResult': searchResult
      }
    }
    return xlsx.writeFile(workBook, "../result.xlsx")
  },

  upload: async (req, res) => {
    const workbook = xlsx.readFile('./public/data/uploads/' + req.file.filename)
    const sheetNames = workbook.SheetNames
    const worksheet = workbook.Sheets[sheetNames[0]]
    const ipLocation = []
    let dataVol = Number(worksheet['!ref'].substring(4))
    let invalidVol = 0
    for (let i = 0; i < dataVol; i++) {
      let temIP = worksheet[`A${i}`]
      if (!temIP) {
        invalidVol++
      } else {
        const result = await geoip.lookup(temIP.v)
        if (result === null) {
          invalidVol++
        } else {
          result.IP = worksheet[`A${i}`].v
          ipLocation.push(result)
        }
      }
    }
    let successVol = dataVol - invalidVol
    //網頁顯示結果
    res.render('result', { dataVol, invalidVol, successVol, ipLocation })
    //建立excel
    let summaryJson = [{
      '輸入IP數': dataVol,
      '有效IP數': successVol,
      '無效IP數': invalidVol
    }]
    let summary = xlsx.utils.json_to_sheet(summaryJson)
    let searchResult = xlsx.utils.json_to_sheet(ipLocation)
    let workBook = {
      SheetNames: ['summary', 'searchResult'],
      Sheets: {
        'summary': summary,
        'searchResult': searchResult
      }
    }
    return xlsx.writeFile(workBook, "../result.xlsx")
  }

}

module.exports = searchController