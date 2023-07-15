const express = require('express')
const router = express.Router();
const playerController = require('../controller/playerController')

router.get('/allplayer' ,playerController.allPlayer)

module.exports = router