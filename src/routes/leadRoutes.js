const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { validateUUID } = require('../middleware/validation');

router.get('/', leadController.getAllLeads);
router.get('/search', leadController.searchByPhone);
router.get('/:id/interactions', validateUUID('id'), leadController.getInteractions);
router.post('/', leadController.createLead);
router.put('/:id', validateUUID('id'), leadController.updateLead);
router.delete('/:id', validateUUID('id'), leadController.deleteLead);

module.exports = router; 