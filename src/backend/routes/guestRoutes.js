const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');

// Routing API
router.get('/', guestController.getAllGuests);
router.post('/', guestController.createGuest);
router.delete('/:id', guestController.deleteGuest);

module.exports = router;
