import express from 'express';
import controller from '../controllers/deckController.js';

const router = express.Router();

// Route: GET /api/decks/:id
router.get('/:id', async (req, res) => {
  try{
    const result = await controller.getDeckById(req.params.id);
    return res.status(200).json(result)
  }catch{
    return res.status(404).json({ error: result.error })
  }
});
router.post('/', async (req, res) => {
  try {
    const deckData = req.body;
    const newdeck = await controller.createDeck(deckData);
    return res.status(201).json(newdeck);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
