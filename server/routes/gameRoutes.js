import express from 'express';
import controller from '../controllers/gameController.js';

const router = express.Router();

// Route: GET /api/games/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await controller.getGameById(req.params.id);
    return res.status(200).json(result);
  } catch {
     return res.status(404).json({ error: err.message });
  }
  
});
router.post('/', async (req, res) => {
  try {
    const newgame = await controller.createGame();
    return res.status(201).json(newgame);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router.put('/:id', async (req,res) =>{
  try {
    const filter = req.params.id;
    const update = req.body;
    const updatedGame = await controller.updateGame(filter,update);
    return res.status(201).json(updatedGame);
  } catch (err) {
    return res.status(500).json({error: err.message})
  }
});
router.put('/:id/player',async (req,res) =>{
  try {
    const gameID = req.params.id;
    const playerID = req.body.playerID
    const updatedGame = await controller.updatePlayersList(gameID,playerID)
    return res.status(200).json(updatedGame);
  }catch(err){
    return res.status(500).json({error: err.message})
  }
})
export default router;