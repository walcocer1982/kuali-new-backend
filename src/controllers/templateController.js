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
    const { title, body, stepsJson, tags } = req.body;
    
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
    
    // Validar y procesar stepsJson si está presente
    if (stepsJson !== undefined) {
      // Validar que sea un array o un objeto JSON válido
      try {
        const stepsData = typeof stepsJson === 'string' ? JSON.parse(stepsJson) : stepsJson;
        
        if (!Array.isArray(stepsData)) {
          return res.status(400).json({ error: 'stepsJson debe ser un array.' });
        }
        
        // Validar estructura de cada step
        for (let i = 0; i < stepsData.length; i++) {
          const item = stepsData[i];
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
        
        data.stepsJson = stepsData;
      } catch (e) {
        return res.status(400).json({ 
          error: 'Formato JSON inválido', 
          message: 'El campo stepsJson debe ser un JSON válido'
        });
      }
    }

    // Crear el template con todos los datos
    const newTemplate = await prisma.template.create({ data });
    
    res.status(201).json(newTemplate);
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
    const { title, body, stepsJson, tags } = req.body;
    
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
    
    // Validar y procesar stepsJson si está presente
    if (stepsJson !== undefined) {
      try {
        const stepsData = typeof stepsJson === 'string' ? JSON.parse(stepsJson) : stepsJson;
        
        if (!Array.isArray(stepsData)) {
          return res.status(400).json({ error: 'stepsJson debe ser un array.' });
        }
        
        // Validar estructura de cada step
        for (let i = 0; i < stepsData.length; i++) {
          const item = stepsData[i];
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
        
        data.stepsJson = stepsData;
      } catch (e) {
        return res.status(400).json({ 
          error: 'Formato JSON inválido', 
          message: 'El campo stepsJson debe ser un JSON válido'
        });
      }
    }

    // Actualizar el template con los datos proporcionados
    const updatedTemplate = await prisma.template.update({
      where: { id: req.params.id },
      data,
    });
    
    res.json(updatedTemplate);
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
    const template = await prisma.template.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        title: true,
        stepsJson: true
      }
    });
    
    if (!template) {
      return res.status(404).json({ error: 'Plantilla no encontrada' });
    }

    // Verificar si stepsJson existe
    if (!template.stepsJson) {
      return res.status(404).json({ 
        error: 'Steps no encontrados', 
        message: `La plantilla no tiene pasos definidos`
      });
    }

    // Validar que cada step tenga la estructura correcta
    const stepsArray = template.stepsJson;
    if (!Array.isArray(stepsArray) || stepsArray.length === 0) {
      return res.status(404).json({ 
        error: 'Steps no encontrados', 
        message: `La plantilla no tiene pasos válidos definidos`
      });
    }

    const stepsValidos = stepsArray.every(step => 
      step && 
      typeof step === 'object' &&
      typeof step.step === 'string' &&
      typeof step.salesperson_response === 'string' &&
      typeof step.client_response === 'string'
    );

    if (!stepsValidos) {
      return res.status(400).json({
        error: 'Formato de steps inválido',
        message: 'Uno o más steps no tienen la estructura correcta'
      });
    }

    res.json(template.stepsJson);
  } catch (error) {
    console.error('Error al obtener steps:', error);
    res.status(500).json({ 
      error: 'Error al obtener los steps de la plantilla',
      details: error.message
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