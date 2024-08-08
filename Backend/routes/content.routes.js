const express = require('express');
const router = express.Router();
const contentCtrl = require('../controllers/content.controller.js');
const verifyToken = require('../middlewares/auth');

router.post('/', verifyToken, contentCtrl.saveContent);
router.get('/', contentCtrl.getContent);

module.exports = router;