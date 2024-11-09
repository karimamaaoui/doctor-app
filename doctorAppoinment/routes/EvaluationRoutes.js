const express = require('express');
const router = express.Router();
const EvaluationController = require('../controllers/EvaluationController');

router.post("/AddEvaluation", EvaluationController.AddEvaluation);
router.get("/GetEvaluation/:id", EvaluationController.GetEvaluation);
router.get("/GetAllevaluations", EvaluationController.GetAllEvaluations);
router.delete("/DeleteEvaluation/:id", EvaluationController.DeleteEvaluation);
router.put("/UpdateEvaluation/:id", EvaluationController.UpdateEvaluation);

module.exports = router;
