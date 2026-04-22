// controllers/bookingController.js
import bookingModel from '../models/booking.js';

export const createBooking = async (req, res) => {
  try {
    const booking = await bookingModel.createBooking(req.body);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getBooking = async (req, res) => {
  try {
    const booking = await bookingModel.getBookingById(parseInt(req.params.id));
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getAllBookings();
    res.json(bookings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await bookingModel.updateBooking(parseInt(req.params.id), req.body);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    await bookingModel.deleteBooking(parseInt(req.params.id));
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};