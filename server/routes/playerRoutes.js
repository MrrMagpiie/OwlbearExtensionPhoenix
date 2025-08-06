import express from 'express';
import controller from '../controllers/playerController.js';

const router = express.Router();

// Route: GET /api/players/:id
router.get('/:id', async (req, res) => {
  const result = await controller.getPlayerById(req.params.id);

  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  res.json(result);
});
router.post('/', async (req, res) => {
  try {
    const playerData = req.body;
    const newplayer = await controller.createPlayer(playerData);
    res.status(201).json(newplayer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;