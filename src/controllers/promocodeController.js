// controllers/promocodeController.js
import promocodeModel from '../models/promocode.js';

export const createPromocode = async (req, res) => {
  try {
    const promocode = await promocodeModel.createPromocode(req.body);
    res.json(promocode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPromocode = async (req, res) => {
  try {
    const promocode = await promocodeModel.getPromocodeById(parseInt(req.params.id));
    if (!promocode) return res.status(404).json({ error: "Promocode not found" });
    res.json(promocode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPromocodeByCode = async (req, res) => {
  try {
    const promocode = await promocodeModel.getPromocodeByCode(req.params.code);
    if (!promocode) return res.status(404).json({ error: "Promocode not found" });
    res.json(promocode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPromocodes = async (req, res) => {
  try {
    const promocodes = await promocodeModel.getAllPromocodes();
    res.json(promocodes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updatePromocode = async (req, res) => {
  try {
    const promocode = await promocodeModel.updatePromocode(parseInt(req.params.id), req.body);
    res.json(promocode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePromocode = async (req, res) => {
  try {
    await promocodeModel.deletePromocode(parseInt(req.params.id));
    res.json({ message: "Promocode deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};