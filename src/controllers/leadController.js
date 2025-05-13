const prisma = require('../lib/prisma');
const { logError } = require('../utils/errorHandler');

// Obtener todos los leads
exports.getAllLeads = async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    if (!prisma) {
      throw new Error('Cliente Prisma no inicializado');
    }

    const leads = await prisma.lead.findMany({
      where: { deletedAt: null },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            sector: true
          }
        }
      }
    });

    res.json({
      status: 'success',
      data: leads
    });
  } catch (error) {
    logError(error, 'getAllLeads');
    res.status(500).json({ 
      error: 'Error al obtener los leads',
      details: error.message,
      type: error.constructor.name
    });
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