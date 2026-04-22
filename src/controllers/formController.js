// controllers/formController.js
import formModel from '../models/form.js';

export const createForm = async (req, res) => {
  try {
    const form = await formModel.createForm(req.body);
    res.json(form);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getForm = async (req, res) => {
  try {
    const form = await formModel.getFormById(parseInt(req.params.id));
    if (!form) return res.status(404).json({ error: "Form not found" });
    res.json(form);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getForms = async (req, res) => {
  try {
    const forms = await formModel.getAllForms();
    res.json(forms);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateForm = async (req, res) => {
  try {
    const form = await formModel.updateForm(parseInt(req.params.id), req.body);
    res.json(form);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteForm = async (req, res) => {
  try {
    await formModel.deleteForm(parseInt(req.params.id));
    res.json({ message: "Form deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};