const express = require('express');
const router = express.Router();
const templateInteractionController = require('../controllers/templateInteractionController');

router.get('/', templateInteractionController.getAllTemplateInteractions);
router.get('/product/:productId', templateInteractionController.getTemplateInteractionsByProduct);
router.get('/:id', templateInteractionController.getTemplateInteractionById);
router.post('/', templateInteractionController.createTemplateInteraction);
router.put('/:id', templateInteractionController.updateTemplateInteraction);
router.delete('/:id', templateInteractionController.deleteTemplateInteraction);

module.exports = router; 