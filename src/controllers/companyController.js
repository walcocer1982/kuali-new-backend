const prisma = require('../lib/prisma');
const { logError, handlePrismaError } = require('../utils/errorHandler');

// Obtener todas las empresas
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      where: { 
        deletedAt: null 
      }
    });
    
    res.json({
      status: 'success',
      data: companies,
      count: companies.length
    });
  } catch (error) {
    logError(error, 'getAllCompanies');
    
    if (error.code?.startsWith('P2')) {
      const { status, message, details } = handlePrismaError(error);
      return res.status(status).json({ error: message, details });
    }
    
    res.status(500).json({ 
      error: 'Error al obtener las empresas',
      details: error.message
    });
  }
};

// Crear una nueva empresa
exports.createCompany = async (req, res) => {
  try {
    const newCompany = await prisma.company.create({
      data: req.body
    });
    
    res.status(201).json({
      status: 'success',
      data: newCompany
    });
  } catch (error) {
    logError(error, 'createCompany');
    
    if (error.code?.startsWith('P2')) {
      const { status, message, details } = handlePrismaError(error);
      return res.status(status).json({ error: message, details });
    }
    
    res.status(500).json({ 
      error: 'Error al crear la empresa',
      details: error.message
    });
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