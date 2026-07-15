const express = require('express')
const router = express.Router()
const { exportPdf } = require('../controllers/exportController')

router.post('/pdf', exportPdf)

module.exports = router