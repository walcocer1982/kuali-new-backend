import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';

const router = Router();
const leadController = new LeadController();

router.get('/search', leadController.searchByPhone);

export default router; 