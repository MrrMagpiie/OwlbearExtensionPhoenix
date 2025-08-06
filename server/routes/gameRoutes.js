import express from 'express';
import controller from '../controllers/gameController.js';

const router = express.Router();

// Route: GET /api/games/:id
router.get('/:id', async (req, res) => {
  const result = await controller.getGameById(req.params.id);

  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  res.json(result);
});
router.post('/', async (req, res) => {
  try {
    const gameData = req.body;
    const newgame = await controller.upsertGame(gameData);
    res.status(201).json(newgame);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;