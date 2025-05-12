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
    const { title, body, steps, tags } = req.body;
    
    // Validación del template básico
    if (!title || !body) {
      return res.status(400).json({ error: 'Los campos title y body son obligatorios.' });
    }

    // Objeto base para crear el template
    const data = { 
      title, 
      body
    };
    
    // Añadir tags si están presentes
    if (tags && Array.isArray(tags)) {
      data.tags = tags;
    }
    
    // Validar y procesar steps si están presentes
    if (steps !== undefined) {
      if (!Array.isArray(steps)) {
        return res.status(400).json({ error: 'steps debe ser un array.' });
      }
      
      // Validar estructura de cada step
      for (let i = 0; i < steps.length; i++) {
        const item = steps[i];
        if (
          !item ||
          typeof item !== 'object' ||
          typeof item.step !== 'string' ||
          typeof item.salesperson_response !== 'string' ||
          typeof item.client_response !== 'string'
        ) {
          return res.status(400).json({ 
            error: `Paso inválido en índice ${i}`, 
            message: 'Cada paso debe tener los campos: step, salesperson_response y client_response'
          });
        }
      }
      
      // Asignar steps al campo stepsJson en Prisma
      data.stepsJson = steps;
    }

    // Crear el template con todos los datos
    const newTemplate = await prisma.template.create({ 
      data,
      include: {
        contactLogs: false
      }
    });
    
    // Si se creó correctamente, procesamos la respuesta
    // Renombramos stepsJson a steps en la respuesta
    const response = {
      ...newTemplate,
      steps: newTemplate.stepsJson,
      stepsJson: undefined
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error al crear template:', error);
    res.status(500).json({ 
      error: 'Error al crear la plantilla', 
      details: error.message 
    });
  }
};

// Actualizar una plantilla con validación de steps
exports.updateTemplate = async (req, res) => {
  try {
    const { title, body, steps, tags } = req.body;
    
    // Verificar que el template exista
    const existingTemplate = await prisma.template.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingTemplate) {
      return res.status(404).json({ error: 'Plantilla no encontrada' });
    }
    
    // Preparar datos para actualización
    const data = {};
    
    // Añadir campos solo si están definidos
    if (title !== undefined) data.title = title;
    if (body !== undefined) data.body = body;
    
    // Añadir tags si están presentes
    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({ error: 'tags debe ser un array.' });
      }
      data.tags = tags;
    }
    
    // Validar y procesar steps si están presentes
    if (steps !== undefined) {
      if (!Array.isArray(steps)) {
        return res.status(400).json({ error: 'steps debe ser un array.' });
      }
      
      // Validar estructura de cada step
      for (let i = 0; i < steps.length; i++) {
        const item = steps[i];
        if (
          !item ||
          typeof item !== 'object' ||
          typeof item.step !== 'string' ||
          typeof item.salesperson_response !== 'string' ||
          typeof item.client_response !== 'string'
        ) {
          return res.status(400).json({ 
            error: `Paso inválido en índice ${i}`, 
            message: 'Cada paso debe tener los campos: step, salesperson_response y client_response'
          });
        }
      }
      
      // Asignar steps al campo stepsJson en Prisma
      data.stepsJson = steps;
    }

    // Actualizar el template con los datos proporcionados
    const updatedTemplate = await prisma.template.update({
      where: { id: req.params.id },
      data,
    });
    
    // Renombramos stepsJson a steps en la respuesta
    const response = {
      ...updatedTemplate,
      steps: updatedTemplate.stepsJson,
      stepsJson: undefined
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error al actualizar template:', error);
    res.status(500).json({ 
      error: 'Error al actualizar la plantilla', 
      details: error.message 
    });
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
      SELECT id, title, body, steps as "stepsJson", "createdAt", "updatedAt"
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
    if (!template.stepsJson) {
      console.log('Steps no definidos para template:', template.title);
      return res.status(404).json({ 
        error: 'Steps no encontrados', 
        message: `La plantilla "${template.title}" no tiene pasos definidos`
      });
    }

    // Asegurarse de que steps sea un array
    let stepsArray = Array.isArray(template.stepsJson) ? template.stepsJson : template.stepsJson;
    
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
      return res.status(400).json({ error: 'steps debe ser un array.' });
    }
    
    // Validar estructura de cada step
    for (let i = 0; i < steps.length; i++) {
      const item = steps[i];
      if (
        !item ||
        typeof item !== 'object' ||
        typeof item.step !== 'string' ||
        typeof item.salesperson_response !== 'string' ||
        typeof item.client_response !== 'string'
      ) {
        return res.status(400).json({ 
          error: `Paso inválido en índice ${i}`, 
          message: 'Cada paso debe tener los campos: step, salesperson_response y client_response'
        });
      }
    }

    const updatedTemplate = await prisma.template.update({
      where: { id: req.params.id },
      data: { stepsJson: steps },
      select: { stepsJson: true }
    });
    
    res.json(updatedTemplate.stepsJson);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar los steps de la plantilla', details: error.message });
  }
}; 