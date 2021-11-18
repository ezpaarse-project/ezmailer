const express = require('express');
const router = require('express').Router();

const { index, send } = require('./actions');

router.get('/', index);

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post('/', send);

module.exports = router;
