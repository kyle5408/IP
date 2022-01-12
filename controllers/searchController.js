const geoip = require('geoip-lite')

const searchController = {
  location: async (req, res) => {
    const ip = req.body.ip.split(',')
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
    res.render('result', { dataVol, invalidVol, ipLocation })
  }

}

module.exports = searchController