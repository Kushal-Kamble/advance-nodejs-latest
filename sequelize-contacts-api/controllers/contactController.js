// सारे CRUD ऑपरेशन यहाँ होंगे (हिन्दी कमेंट्स के साथ)

const Contact = require("../models/Contact");

// ---------------- CREATE CONTACT ----------------
exports.createContact = async (req, res) => {
    try {
        // body से data लेना (x-www-form-urlencoded + JSON दोनों काम करेंगे)
        const { first_name, last_name, email, phone, address } = req.body;

        // नया contact create करना
        const contact = await Contact.create({
            first_name,
            last_name,
            email,
            phone,
            address
        });

        // Response
        res.status(201).json({
            message: "Contact Created Successfully",
            data: contact
        });

    } catch (err) {
        console.error(err);

        // Unique field error (email already exists)
        if (err.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({
                error: "Email पहले से मौजूद है"
            });
        }

        res.status(500).json({ error: err.message });
    }
};

// ---------------- READ ALL CONTACTS ----------------
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- READ SINGLE CONTACT (BY ID) ----------------
exports.getContact = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);

        if (!contact)
            return res.status(404).json({ message: "Contact Not Found" });

        res.json(contact);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- UPDATE CONTACT ----------------
exports.updateContact = async (req, res) => {
    try {
        const id = req.params.id;

        const [updated] = await Contact.update(req.body, { where: { id } });

        if (!updated)
            return res.status(404).json({ message: "Contact Not Found" });

        const updatedContact = await Contact.findByPk(id);

        res.json({
            message: "Contact Updated Successfully",
            data: updatedContact
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- DELETE CONTACT ----------------
exports.deleteContact = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await Contact.destroy({ where: { id } });

        if (!deleted)
            return res.status(404).json({ message: "Contact Not Found" });

        res.json({ message: "Contact Deleted Successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
