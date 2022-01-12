const express = require('express')
const router = express.Router()
const searchController = require('../controllers/searchController')

router.get('/', (req, res) => {
  res.render('index')
})

router.post('/search', searchController.location)

module.exports = router