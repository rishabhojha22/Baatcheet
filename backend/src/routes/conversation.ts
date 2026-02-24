import express from 'express';
import { analyzeConversation } from '../services/conversationAnalysis';

const router = express.Router();

router.post('/analyze-conversation', async (req, res) => {
  try {
    const { transcript, context } = req.body;

    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ 
        error: 'Transcript is required and must be a string' 
      });
    }

    if (transcript.length < 10) {
      return res.status(400).json({ 
        error: 'Transcript is too short for meaningful analysis' 
      });
    }

    // Analyze the conversation
    const analysis = await analyzeConversation(transcript);

    res.json(analysis);
  } catch (error) {
    console.error('Conversation analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze conversation. Please try again.' 
    });
  }
});

export default router;
