const express = require('express');
const { createEvent, getAllEvents, getEventById, getCountEvents, deleteEventById, updateEventById, getClosestEvent, getAllEventsForScanner } = require('../controller/Event.controller');
const { verifyAdminToken } = require('../middleware/verifyAdminToken');
const { verifyScannerToken } = require('../middleware/verifyScannerToken');
const router = express.Router();

router.get('/closestEvent', getClosestEvent);
router.get('/all/:page/:filter', getAllEvents);
router.get('/count/:filter', getCountEvents);
router.get('/getEventsForScanner', verifyScannerToken, getAllEventsForScanner);
router.get('/:id', verifyAdminToken, getEventById);

router.post('/', verifyAdminToken, createEvent);

router.put('/update/:id', verifyAdminToken, updateEventById);

router.delete('/delete/:id', verifyAdminToken, deleteEventById);

module.exports = router;