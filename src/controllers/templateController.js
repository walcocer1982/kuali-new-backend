const { PrismaClient, TemplateType } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todas las plantillas
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await prisma.template.findMany({
      include: {
        product: true
      }
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las plantillas' });
  }
};

// Obtener una plantilla por ID
exports.getTemplateById = async (req, res) => {
  try {
    const template = await prisma.template.findUnique({
      where: { id: req.params.id },
      include: {
        product: true
      }
    });
    if (!template) {
      return res.status(404).json({ error: 'Plantilla no encontrada' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la plantilla' });
  }
};

// Obtener plantillas por producto
exports.getTemplatesByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const templates = await prisma.template.findMany({
      where: { productId },
      include: {
        product: true
      }
    });
    
    res.json(templates);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener las plantillas por producto',
      details: error.message  
    });
  }
};

// Obtener plantillas por tipo
exports.getTemplatesByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    // Verificar que el tipo sea válido
    const validTypes = ['WELCOME', 'FOLLOW_UP', 'CLOSING'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: 'Tipo de plantilla inválido',
        message: 'Los tipos válidos son: WELCOME, FOLLOW_UP, CLOSING'
      });
    }
    
    const templates = await prisma.template.findMany({
      where: { type },
      include: {
        product: true
      }
    });
    
    res.json(templates);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener las plantillas por tipo',
      details: error.message  
    });
  }
};

// Crear una nueva plantilla
exports.createTemplate = async (req, res) => {
  try {
    const { title, body, tags, productId, type } = req.body;
    
    // Validación de campos requeridos
    if (!title || !body || !type) {
      return res.status(400).json({ 
        error: 'Campos requeridos faltantes',
        details: {
          title: !title ? 'El título es requerido' : null,
          body: !body ? 'El cuerpo es requerido' : null,
          type: !type ? 'El tipo de plantilla es requerido' : null
        },
        message: 'Los campos title, body y type son obligatorios.'
      });
    }

    // Validación del tipo usando el enum de Prisma
    const validTypes = Object.values(TemplateType);
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: 'Tipo de plantilla inválido',
        message: `Los tipos válidos son: ${validTypes.join(', ')}`,
        providedType: type,
        validTypes: validTypes
      });
    }

    // Objeto base para crear el template
    const templateData = { 
      title, 
      body,
      type
    };
    
    // Validación y asignación de productId
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });
      
      if (!product) {
        return res.status(400).json({ 
          error: 'Producto no encontrado',
          message: 'El producto especificado no existe en la base de datos.',
          providedProductId: productId
        });
      }
      
      templateData.productId = productId;
    }
    
    // Validación y asignación de tags
    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({
          error: 'Formato inválido',
          message: 'El campo tags debe ser un array de strings',
          providedTags: tags
        });
      }
      templateData.tags = tags;
    }

    // Crear el template usando Prisma
    const newTemplate = await prisma.template.create({ 
      data: templateData,
      include: {
        product: true
      }
    });
    
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error('Error al crear template:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'Error de validación',
        message: 'Ya existe una plantilla con estos datos',
        details: error.meta
      });
    }
    res.status(500).json({ 
      error: 'Error interno',
      message: 'Error al crear la plantilla',
      details: error.message 
    });
  }
};

// Actualizar una plantilla con validación de steps
exports.updateTemplate = async (req, res) => {
  try {
    const { title, body, stepsJson, tags, productId, type } = req.body;
    
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
    
    // Añadir productId si está presente
    if (productId !== undefined) {
      // Si se envía null, eliminar la relación
      if (productId === null) {
        data.productId = null;
      } else {
        // Verificar que el producto exista
        const product = await prisma.product.findUnique({
          where: { id: productId }
        });
        
        if (!product) {
          return res.status(400).json({ error: 'El producto especificado no existe.' });
        }
        
        data.productId = productId;
      }
    }
    
    // Añadir type si está presente
    if (type !== undefined) {
      // Si se envía null, eliminar el tipo
      if (type === null) {
        data.type = null;
      } else {
        // Verificar que el tipo sea válido
        const validTypes = ['WELCOME', 'FOLLOW_UP', 'CLOSING'];
        if (!validTypes.includes(type)) {
          return res.status(400).json({
            error: 'Tipo de plantilla inválido',
            message: 'Los tipos válidos son: WELCOME, FOLLOW_UP, CLOSING'
          });
        }
        
        data.type = type;
      }
    }
    
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
      include: {
        product: true
      }
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
    
    if (!steps || !Array.isArray(steps)) {
      return res.status(400).json({ error: 'Se requiere un array de steps.' });
    }
    
    // Verificar que el template exista
    const existingTemplate = await prisma.template.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingTemplate) {
      return res.status(404).json({ error: 'Plantilla no encontrada' });
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
    
    // Actualizar solo los steps
    const updatedTemplate = await prisma.template.update({
      where: { id: req.params.id },
      data: { stepsJson: steps },
      select: {
        id: true,
        title: true,
        stepsJson: true
      }
    });
    
    res.json(updatedTemplate);
  } catch (error) {
    console.error('Error al actualizar steps:', error);
    res.status(500).json({ 
      error: 'Error al actualizar los steps de la plantilla',
      details: error.message
    });
  }
};

module.exports = exports; 