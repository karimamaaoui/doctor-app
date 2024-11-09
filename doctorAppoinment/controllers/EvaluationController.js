const express = require('express');
const Evaluation = require('../models/Evaluation');

module.exports.AddEvaluation = async (req, res) => {
  try {
    let evaluationInstance = new Evaluation({ ...req.body });
    await evaluationInstance.save();
    return res.status(201).json({ message: 'Evaluation added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while adding the evaluation' });
  }
};

module.exports.GetEvaluation = async (req, res) => {
  try {
    const id = req.params.id;
    let evaluation = await Evaluation.findById(id);
    if (evaluation) {
      return res.json(evaluation);
    } else {
      return res.status(400).json({ message: 'Evaluation not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.GetEvaluationByEvaluationId = async (req, res) => {
  try {
    const id = req.params.id;
    let evaluation = await Evaluation.findById(id);
    if (evaluation) {
      return res.json(evaluation);
    } else {
      return res.status(400).json({ message: 'Evaluation not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.GetAllEvaluations = async (req, res) => {
  try {
    let evaluations = await Evaluation.find({});
    if (evaluations.length > 0) {
      return res.json(evaluations);
    } else {
      return res.status(400).json({ message: 'No specialties were found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.DeleteEvaluation = async (req, res) => {
  try {
    const id = req.params.id;
    let evaluation = await Evaluation.findByIdAndDelete(id);
    if (evaluation) {
      return res.status(200).json({ message: 'Evaluation deleted successfully' });
    } else {
      return res.status(400).json({ message: 'Evaluation not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.UpdateEvaluation = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const updatedEvaluation = await Evaluation.findByIdAndUpdate(id, updatedData, { new: true });

    if (updatedEvaluation) {
      return res.json(updatedEvaluation);
    } else {
      return res.status(400).json({ message: 'Evaluation not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};