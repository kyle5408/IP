const geoip = require('geoip-lite')

const searchController = {
  location: (req, res) => {
    const ip = req.body.ip.split(',')
    const ipLocation = []
    for (let i = 0; i < ip.length; i++) {
      const result = geoip.lookup(ip[i])
      result.IP= ip[i]
      ipLocation.push(result)
    }
    res.render('result', { ipLocation })
  }

}

module.exports = searchController