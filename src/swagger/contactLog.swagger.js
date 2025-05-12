/**
 * @swagger
 * components:
 *   schemas:
 *     ContactLog:
 *       type: object
 *       required:
 *         - leadId
 *         - templateId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único del registro de contacto
 *         leadId:
 *           type: string
 *           format: uuid
 *           description: ID del lead asociado
 *         templateId:
 *           type: string
 *           format: uuid
 *           description: ID de la plantilla asociada
 *         status:
 *           type: string
 *           enum: [PENDIENTE, ENVIADO, ENTREGADO, LEIDO, RESPONDIDO, FALLIDO]
 *           default: PENDIENTE
 *           description: Estado actual del contacto
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 * 
 *   responses:
 *     ValidationError:
 *       description: Error de validación en los datos
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *               details:
 *                 type: string
 *     NotFoundError:
 *       description: Recurso no encontrado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 * 
 * /api/contact-logs:
 *   get:
 *     tags: [Contact Logs]
 *     summary: Obtener todos los registros de contacto
 *     responses:
 *       200:
 *         description: Lista de registros de contacto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ContactLog'
 *   post:
 *     tags: [Contact Logs]
 *     summary: Crear nuevo registro de contacto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leadId
 *               - templateId
 *             properties:
 *               leadId:
 *                 type: string
 *                 format: uuid
 *               templateId:
 *                 type: string
 *                 format: uuid
 *               status:
 *                 type: string
 *                 enum: [PENDIENTE, ENVIADO, ENTREGADO, LEIDO, RESPONDIDO, FALLIDO]
 *     responses:
 *       201:
 *         description: Registro creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Lead o Template no encontrado
 * 
 * /api/contact-logs/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *       description: ID del registro de contacto
 *   get:
 *     tags: [Contact Logs]
 *     summary: Obtener registro por ID
 *     responses:
 *       200:
 *         description: Registro de contacto encontrado
 *       404:
 *         description: Registro no encontrado
 *   put:
 *     tags: [Contact Logs]
 *     summary: Actualizar estado del registro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDIENTE, ENVIADO, ENTREGADO, LEIDO, RESPONDIDO, FALLIDO]
 *     responses:
 *       200:
 *         description: Registro actualizado exitosamente
 *       400:
 *         description: Estado inválido
 *       404:
 *         description: Registro no encontrado
 * 
 * /api/contact-logs/lead/{leadId}:
 *   get:
 *     tags: [Contact Logs]
 *     summary: Obtener registros por Lead
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de registros del lead
 * 
 * /api/contact-logs/template/{templateId}:
 *   get:
 *     tags: [Contact Logs]
 *     summary: Obtener registros por Template
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de registros del template
 */ 