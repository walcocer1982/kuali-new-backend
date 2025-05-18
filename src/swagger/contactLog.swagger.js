/**
 * @swagger
 * components:
 *   schemas:
 *     Lead:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *     
 *     Template:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *     
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
 *         lead:
 *           $ref: '#/components/schemas/Lead'
 *           description: Información del lead asociado
 *         template:
 *           $ref: '#/components/schemas/Template'
 *           description: Información de la plantilla asociada
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
 *                 example: "Error de validación"
 *               details:
 *                 type: string
 *                 example: "El campo leadId es requerido"
 *               type:
 *                 type: string
 *                 example: "ValidationError"
 *     NotFoundError:
 *       description: Recurso no encontrado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Registro no encontrado"
 *               details:
 *                 type: string
 *                 example: "No existe un registro con ID: 123e4567-e89b-12d3-a456-426614174000"
 *     TransitionError:
 *       description: Error en la transición de estado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Transición de estado inválida"
 *               details:
 *                 type: string
 *                 example: "No se puede cambiar de ENTREGADO a PENDIENTE"
 *               allowedTransitions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["LEIDO", "FALLIDO"]
 * 
 * /contact-logs:
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
 *             example:
 *               - id: "123e4567-e89b-12d3-a456-426614174000"
 *                 leadId: "123e4567-e89b-12d3-a456-426614174001"
 *                 templateId: "123e4567-e89b-12d3-a456-426614174002"
 *                 status: "PENDIENTE"
 *                 createdAt: "2024-03-20T10:00:00Z"
 *                 updatedAt: "2024-03-20T10:00:00Z"
 *                 lead:
 *                   id: "123e4567-e89b-12d3-a456-426614174001"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   email: "john@example.com"
 *                 template:
 *                   id: "123e4567-e89b-12d3-a456-426614174002"
 *                   title: "Bienvenida"
 *       500:
 *         $ref: '#/components/responses/ValidationError'
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
 *           example:
 *             leadId: "123e4567-e89b-12d3-a456-426614174001"
 *             templateId: "123e4567-e89b-12d3-a456-426614174002"
 *     responses:
 *       201:
 *         description: Registro creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactLog'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 * 
 * /contact-logs/{id}:
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactLog'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 *           example:
 *             status: "ENVIADO"
 *     responses:
 *       200:
 *         description: Registro actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactLog'
 *       400:
 *         $ref: '#/components/responses/TransitionError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     tags: [Contact Logs]
 *     summary: Eliminar registro de contacto
 *     responses:
 *       204:
 *         description: Registro eliminado exitosamente
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 * 
 * /contact-logs/lead/{leadId}:
 *   get:
 *     tags: [Contact Logs]
 *     summary: Obtener registros por Lead
 *     description: Obtiene todos los registros de contacto asociados a un lead específico, ordenados por fecha de creación descendente
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del lead para buscar sus registros de contacto
 *     responses:
 *       200:
 *         description: Lista de registros del lead encontrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     lead:
 *                       $ref: '#/components/schemas/Lead'
 *                     contactLogs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ContactLog'
 *                     total:
 *                       type: integer
 *                       description: Número total de registros encontrados
 *                       example: 5
 *             example:
 *               success: true
 *               data:
 *                 lead:
 *                   id: "123e4567-e89b-12d3-a456-426614174001"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   email: "john@example.com"
 *                 contactLogs:
 *                   - id: "123e4567-e89b-12d3-a456-426614174000"
 *                     leadId: "123e4567-e89b-12d3-a456-426614174001"
 *                     templateId: "123e4567-e89b-12d3-a456-426614174002"
 *                     status: "ENVIADO"
 *                     createdAt: "2024-03-20T10:00:00Z"
 *                     updatedAt: "2024-03-20T10:00:00Z"
 *                     template:
 *                       id: "123e4567-e89b-12d3-a456-426614174002"
 *                       title: "Bienvenida"
 *                 total: 1
 *       404:
 *         description: Lead no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lead no encontrado"
 *                 details:
 *                   type: string
 *                   example: "No existe un lead con ID: 123e4567-e89b-12d3-a456-426614174001"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Error al obtener los registros de contacto"
 *                 details:
 *                   type: string
 *                   example: "Error interno del servidor"
 * 
 * /contact-logs/template/{templateId}:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ContactLog'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */ 