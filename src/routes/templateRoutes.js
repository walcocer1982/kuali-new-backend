const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

router.get('/', templateController.getAllTemplates);
router.get('/product/:productId', templateController.getTemplatesByProduct);
router.get('/type/:type', templateController.getTemplatesByType);
router.get('/:id', templateController.getTemplateById);
router.get('/:id/steps', templateController.getTemplateSteps);
router.post('/', templateController.createTemplate);
router.put('/:id', templateController.updateTemplate);
router.put('/:id/steps', templateController.updateTemplateSteps);
router.delete('/:id', templateController.deleteTemplate);

module.exports = router; 