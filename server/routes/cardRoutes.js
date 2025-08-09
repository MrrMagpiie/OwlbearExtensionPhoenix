import express from 'express';
import controller from '../controllers/cardController.js';

const router = express.Router();

// Route: GET /api/cards/:id
router.get('/:id', async (req, res) => {
  try{
  const result = await controller.getCardById(req.params.id);
  return res.status(200).json(result);
  }catch(err){
    return res.status(404).json({ error: err.message });
  }
  
});
router.post('/', async (req, res) => {
  try {
    const cardData = req.body;
    const newCard = await controller.createCard(cardData);
   return res.status(201).json(newCard);
  } catch (err) {
   return res.status(500).json({ error: err.message });
  }
});

export default router;
