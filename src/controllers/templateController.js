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

// Obtener una plantilla por ID
exports.getTemplateById = async (req, res) => {
  try {
    const template = await prisma.template.findUnique({
      where: { id: req.params.id }
    });
    if (!template) {
      return res.status(404).json({ error: 'Plantilla no encontrada' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la plantilla' });
  }
};

// Crear una nueva plantilla con validación de steps
exports.createTemplate = async (req, res) => {
  try {
    const { title, body, steps } = req.body;
    // Validar que steps sea un array de objetos con llaves correctas
    if (steps !== undefined) {
      if (!Array.isArray(steps)) {
        return res.status(400).json({ error: '`steps` debe ser un array.' });
      }
      steps.forEach((item, idx) => {
        if (
          typeof item.step !== 'string' ||
          typeof item.salesperson_response !== 'string' ||
          typeof item.client_response !== 'string'
        ) {
          throw new Error(`Paso inválido en índice ${idx}: formato no válido.`);
        }
      });
    }
    const data = { title, body };
    if (steps !== undefined) data.steps = steps;

    const newTemplate = await prisma.template.create({ data });
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la plantilla', details: error.message });
  }
};

// Actualizar una plantilla con validación de steps
exports.updateTemplate = async (req, res) => {
  try {
    const { title, body, steps } = req.body;
    // Validar steps si viene presente
    if (steps !== undefined) {
      if (!Array.isArray(steps)) {
        return res.status(400).json({ error: '`steps` debe ser un array.' });
      }
      steps.forEach((item, idx) => {
        if (
          typeof item.step !== 'string' ||
          typeof item.salesperson_response !== 'string' ||
          typeof item.client_response !== 'string'
        ) {
          throw new Error(`Paso inválido en índice ${idx}: formato no válido.`);
        }
      });
    }
    const data = {};
    if (title !== undefined) data.title = title;
    if (body !== undefined) data.body = body;
    if (steps !== undefined) data.steps = steps;

    const updatedTemplate = await prisma.template.update({
      where: { id: req.params.id },
      data,
    });
    res.json(updatedTemplate);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la plantilla', details: error.message });
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

// Obtener los steps de una plantilla
exports.getTemplateSteps = async (req, res) => {
  try {
    console.log('Obteniendo template con ID:', req.params.id);
    
    // Usar una consulta SQL directa para obtener el template con todos sus campos
    const result = await prisma.$queryRaw`
      SELECT id, title, body, steps, "createdAt", "updatedAt"
      FROM "Template"
      WHERE id = ${req.params.id}
    `;

    const template = result[0];
    
    console.log('Template encontrado:', JSON.stringify(template, null, 2));
    
    if (!template) {
      console.log('Template no encontrado para ID:', req.params.id);
      return res.status(404).json({ error: 'Plantilla no encontrada' });
    }

    // Verificar si steps existe
    if (!template.steps) {
      console.log('Steps no definidos para template:', template.title);
      return res.status(404).json({ 
        error: 'Steps no encontrados', 
        message: `La plantilla "${template.title}" no tiene pasos definidos`
      });
    }

    // Asegurarse de que steps sea un array
    let stepsArray = Array.isArray(template.steps) ? template.steps : template.steps;
    
    // Si steps no es un array pero es un string JSON, intentar parsearlo
    if (!Array.isArray(stepsArray) && typeof stepsArray === 'string') {
      try {
        stepsArray = JSON.parse(stepsArray);
      } catch (e) {
        console.error('Error al parsear steps:', e);
        return res.status(500).json({ 
          error: 'Error en formato de steps',
          message: 'Los steps están en un formato JSON inválido'
        });
      }
    }

    // Verificar si steps es un array válido después del parseo
    if (!Array.isArray(stepsArray) || stepsArray.length === 0) {
      console.log('Steps inválidos o vacíos:', stepsArray);
      return res.status(404).json({ 
        error: 'Steps no encontrados', 
        message: `La plantilla "${template.title}" no tiene pasos válidos definidos`
      });
    }

    // Verificar que cada step tenga la estructura correcta
    const stepsValidos = stepsArray.every(step => 
      step && 
      typeof step === 'object' &&
      typeof step.step === 'string' &&
      typeof step.salesperson_response === 'string' &&
      typeof step.client_response === 'string'
    );

    if (!stepsValidos) {
      console.log('Estructura de steps inválida:', stepsArray);
      return res.status(400).json({
        error: 'Formato de steps inválido',
        message: 'Uno o más steps no tienen la estructura correcta'
      });
    }

    console.log('Steps válidos encontrados:', JSON.stringify(stepsArray, null, 2));
    res.json(stepsArray);
  } catch (error) {
    console.error('Error al obtener steps:', error);
    res.status(500).json({ 
      error: 'Error al obtener los steps de la plantilla',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Actualizar los steps de una plantilla
exports.updateTemplateSteps = async (req, res) => {
  try {
    const { steps } = req.body;
    
    if (!Array.isArray(steps)) {
      return res.status(400).json({ error: '`steps` debe ser un array.' });
    }
    
    steps.forEach((item, idx) => {
      if (
        typeof item.step !== 'string' ||
        typeof item.salesperson_response !== 'string' ||
        typeof item.client_response !== 'string'
      ) {
        throw new Error(`Paso inválido en índice ${idx}: formato no válido.`);
      }
    });

    const updatedTemplate = await prisma.template.update({
      where: { id: req.params.id },
      data: { steps },
      select: { steps: true }
    });
    
    res.json(updatedTemplate.steps);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar los steps de la plantilla', details: error.message });
  }
}; 