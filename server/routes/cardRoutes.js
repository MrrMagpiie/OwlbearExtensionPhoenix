import express from 'express';
import controller from '../controllers/cardController.js';

const router = express.Router();

// Route: GET /api/cards/:id
router.get('/:id', async (req, res) => {
  const result = await controller.getCardById(req.params.id,req);

  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  res.json(result);
});
router.post('/', async (req, res) => {
  try {
    const cardData = req.body;
    const newCard = await controller.createCard(cardData);
    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
