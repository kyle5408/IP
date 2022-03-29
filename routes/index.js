const express = require('express')
const router = express.Router()
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/data/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage })
const searchController = require('../controllers/searchController')
const mysqlController = require('../controllers/mysqlController')

router.get('/', (req, res) => {
  res.render('index')
})

router.post('/search', searchController.search)
router.post('/searchDB', mysqlController.search)
router.post('/upload', upload.single('uploaded_file'), searchController.upload) 

module.exports = router