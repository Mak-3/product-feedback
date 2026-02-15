import { Router } from 'express';
import { 
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  voteFeedback
} from '../controllers/feedback.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', optionalAuth, getAllFeedback);
router.get('/:id', optionalAuth, getFeedbackById);
router.post('/', optionalAuth, createFeedback);
router.post('/:id/vote', optionalAuth, voteFeedback);

// Protected routes
router.patch('/:id', authenticate, updateFeedback);
router.delete('/:id', authenticate, deleteFeedback);

export default router;
