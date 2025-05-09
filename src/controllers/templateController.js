const prisma = require('../prismaClient');

// Obtener todas las plantillas
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await prisma.template.findMany();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las plantillas' });
  }
};

// Crear una nueva plantilla
exports.createTemplate = async (req, res) => {
  try {
    const newTemplate = await prisma.template.create({
      data: req.body,
    });
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la plantilla' });
  }
};

// Actualizar una plantilla
exports.updateTemplate = async (req, res) => {
  try {
    const updatedTemplate = await prisma.template.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updatedTemplate);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la plantilla' });
  }
};

// Eliminar una plantilla
exports.deleteTemplate = async (req, res) => {
  try {
    await prisma.template.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la plantilla' });
  }
}; 