import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getEntries, 
  getEntryById, 
  analyzeEntry, 
  createEntry, 
  updateEntry, 
  deleteEntry ,
  extractTriggers

} from '../controllers/entriesController.js';

const router = express.Router();

router.route('/')
  .get(protect, getEntries)
  .post(protect, createEntry);

router.route('/analyze')
  .post(protect, analyzeEntry);

router.route('/:id')
  .get(protect, getEntryById)
  .put(protect, updateEntry)
  .delete(protect, deleteEntry);
router.post('/triggers', protect, extractTriggers);
export default router;