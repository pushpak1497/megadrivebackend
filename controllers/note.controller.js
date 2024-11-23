import { Note } from "../models/note.model.js";

export const createNote = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const note = new Note({
      title,
      description,
      category,
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: "Error creating note" });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    const notes = await Note.find(filter).sort({ created_at: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, completed } = req.body;

    const note = await Note.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        completed,
        updated_at: Date.now(),
      },
      { new: true }
    );

    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: "Error updating note" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting note" });
  }
};
