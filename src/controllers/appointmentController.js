// controllers/appointmentController.js
import appointmentModel from '../models/appointment.js';

export const createAppointment = async (req, res) => {
  try {
    const appointment = await appointmentModel.createAppointment(req.body);
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAppointment = async (req, res) => {
  try {
    const appointment = await appointmentModel.getAppointmentById(parseInt(req.params.id));
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.getAllAppointments();
    res.json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await appointmentModel.updateAppointment(parseInt(req.params.id), req.body);
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    await appointmentModel.deleteAppointment(parseInt(req.params.id));
    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};