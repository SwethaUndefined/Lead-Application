// controllers/leadController.js
const Lead = require('../models/Lead');

// Create Lead
exports.createLead = async (req, res) => {
  console.log(req.body,"req.body")
  try {
    const newLead = new Lead(req.body);
    await newLead.save();
    res.status(201).json(newLead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const { search, sortBy = 'name' } = req.query;
    // const query = search
    //   ? {
    //       $or: [
    //         { name: new RegExp(search, 'i') },
    //         { email: new RegExp(search, 'i') },
    //         { product: new RegExp(search, 'i') },
    //       ],
    //     }
    //   : {};
    const leads = await Lead.find({});
    res.status(200).json(leads);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedLead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
