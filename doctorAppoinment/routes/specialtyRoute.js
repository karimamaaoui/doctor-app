const express = require('express');
const router = express.Router();
const SpecialtyController = require('../controllers/specialtyController');

router.post("/Addspecialty", SpecialtyController.AddSpecialty);
router.get("/Getspecialty/:id", SpecialtyController.GetSpecialty);
router.get("/GetAllspecialties", SpecialtyController.GetAllSpecialtys);
router.delete("/Deletespecialty/:id", SpecialtyController.DeleteSpecialty);
router.put("/Updatespecialty/:id", SpecialtyController.UpdateSpecialty);

module.exports = router;
