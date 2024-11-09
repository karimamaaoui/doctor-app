const express = require('express');
const Specialty = require('../models/Specialty');

module.exports.AddSpecialty = async (req, res) => {
  try {
    let specialtyInstance = new Specialty({ ...req.body });
    await specialtyInstance.save();
    return res.status(201).json({ message: 'Specialty added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while adding the specialty' });
  }
};

module.exports.GetSpecialty = async (req, res) => {
  try {
    const id = req.params.id;
    let specialty = await Specialty.findById(id);
    if (specialty) {
      return res.json(specialty);
    } else {
      return res.status(400).json({ message: 'Specialty not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.GetSpecialtyBySpecialtyId = async (req, res) => {
  try {
    const id = req.params.id;
    let specialty = await Specialty.findById(id);
    if (specialty) {
      return res.json(specialty);
    } else {
      return res.status(400).json({ message: 'Specialty not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.GetAllSpecialtys = async (req, res) => {
  try {
    let specialtys = await Specialty.find({});
    if (specialtys.length > 0) {
      return res.json(specialtys);
    } else {
      return res.status(400).json({ message: 'No specialties were found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.DeleteSpecialty = async (req, res) => {
  try {
    const id = req.params.id;
    let specialty = await Specialty.findByIdAndDelete(id);
    if (specialty) {
      return res.status(200).json({ message: 'Specialty deleted successfully' });
    } else {
      return res.status(400).json({ message: 'Specialty not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.UpdateSpecialty = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const updatedSpecialty = await Specialty.findByIdAndUpdate(id, updatedData, { new: true });

    if (updatedSpecialty) {
      return res.json(updatedSpecialty);
    } else {
      return res.status(400).json({ message: 'Specialty not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};