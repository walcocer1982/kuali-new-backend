const prisma = require('../prismaClient');

// Obtener todos los leads
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los leads' });
  }
};

// Crear un nuevo lead
exports.createLead = async (req, res) => {
  try {
    const newLead = await prisma.lead.create({
      data: req.body,
    });
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el lead' });
  }
};

// Actualizar un lead
exports.updateLead = async (req, res) => {
  try {
    const updatedLead = await prisma.lead.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el lead' });
  }
};

// Eliminar un lead
exports.deleteLead = async (req, res) => {
  try {
    await prisma.lead.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el lead' });
  }
}; 