import express from 'express';
import controller from '../controllers/playerController.js';

const router = express.Router();

// Route: GET /api/players/:id
router.get('/:id', async (req, res) => {
  try{
    const result = await controller.getPlayerById(req.params.id);
    return res.status(200).json(result);
  }catch{
     return res.status(404).json({ error: err.message});
  }
});
router.post('/', async (req, res) => {
  try {
    const playerData = req.body;
    const newplayer = await controller.createPlayer(playerData);
    return res.status(201).json(newplayer);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router.put('/:id',async (req, res)=>{
  try{
    const owlID = req.params.id
    const update = req.body;
    const updatedPlayer = await controller.updatePlayer(owlID,update)
    return res.status(201).json(updatedPlayer)
  }catch{
    return res.status(500).json({error: err.message})
  }
})
router.put('/:id/deck',async (req,res)=>{
  try{
    const owlID = req.params.id;
    const update = req.body;
    const updatedDeck= await controller.updatePlayerDeck(owlID,update);
    return res.status(200).json(updatedDeck);
    }catch (err){
      return res.status(500).json({error: err.message})
    }
})
export default router;