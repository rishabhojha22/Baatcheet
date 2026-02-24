import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Protected route example
router.get('/profile', authenticateToken, (req: AuthRequest, res) => {
  res.json({
    message: 'Access granted to protected route',
    user: req.user
  });
});

export default router;
