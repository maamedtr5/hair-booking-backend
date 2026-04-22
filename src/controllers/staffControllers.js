import { createStaff, getStaffById, getAllStaff, updateStaff, deleteStaff } from '../models/staff.js';

export async function createStaffHandler(req, res) { try { res.json(await createStaff(req.body)); } catch (err) { res.status(400).json({ error: err.message }); } }
export async function getStaffHandler(req, res) { try { const staff = await getStaffById(parseInt(req.params.id)); if (!staff) return res.status(404).json({ error: "Staff not found" }); res.json(staff); } catch (err) { res.status(400).json({ error: err.message }); } }
export async function getStaffsHandler(req, res) { try { res.json(await getAllStaff()); } catch (err) { res.status(400).json({ error: err.message }); } }
export async function updateStaffHandler(req, res) { try { res.json(await updateStaff(parseInt(req.params.id), req.body)); } catch (err) { res.status(400).json({ error: err.message }); } }
export async function deleteStaffHandler(req, res) { try { await deleteStaff(parseInt(req.params.id)); res.json({ message: "Staff deleted successfully" }); } catch (err) { res.status(400).json({ error: err.message }); } }
