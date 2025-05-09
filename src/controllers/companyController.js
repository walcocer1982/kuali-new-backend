const prisma = require('../prismaClient');

// Obtener todas las compañías
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las compañías' });
  }
};

// Crear una nueva compañía
exports.createCompany = async (req, res) => {
  try {
    const newCompany = await prisma.company.create({
      data: req.body,
    });
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la compañía' });
  }
};

// Actualizar una compañía
exports.updateCompany = async (req, res) => {
  try {
    const updatedCompany = await prisma.company.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updatedCompany);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la compañía' });
  }
};

// Eliminar una compañía
exports.deleteCompany = async (req, res) => {
  try {
    await prisma.company.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la compañía' });
  }
}; 