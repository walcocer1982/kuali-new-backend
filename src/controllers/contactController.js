const prisma = require('../prismaClient');

// Obtener todos los contactos
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los contactos' });
  }
};

// Crear un nuevo contacto
exports.createContact = async (req, res) => {
  try {
    const newContact = await prisma.contact.create({
      data: req.body,
    });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el contacto' });
  }
};

// Actualizar un contacto
exports.updateContact = async (req, res) => {
  try {
    const updatedContact = await prisma.contact.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el contacto' });
  }
};

// Eliminar un contacto
exports.deleteContact = async (req, res) => {
  try {
    await prisma.contact.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el contacto' });
  }
}; 