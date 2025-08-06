import express from 'express';
import controller from '../controllers/deckController.js';

const router = express.Router();

// Route: GET /api/decks/:id
router.get('/:id', async (req, res) => {
  const result = await controller.getDeckById(req.params.id);

  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  res.json(result);
});
router.post('/', async (req, res) => {
  try {
    const deckData = req.body;
    const newdeck = await controller.createDeck(deckData);
    res.status(201).json(newdeck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
