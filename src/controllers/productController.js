const prisma = require('../lib/prisma');
const { logError, handlePrismaError } = require('../utils/errorHandling');

class ProductController {
    // Obtener todos los productos
    async getAllProducts(req, res) {
        try {
            const products = await prisma.product.findMany({
                include: {
                    templates: true
                }
            });
            
            res.json({
                status: 'success',
                data: products
            });
        } catch (error) {
            logError(error, 'getAllProducts');
            res.status(500).json({ 
                error: 'Error al obtener los productos',
                details: error.message
            });
        }
    }

    // Obtener un producto por ID
    async getProductById(req, res) {
        try {
            const product = await prisma.product.findUnique({
                where: { id: req.params.id },
                include: {
                    templates: true
                }
            });
            
            if (!product) {
                return res.status(404).json({
                    error: 'Producto no encontrado'
                });
            }
            
            res.json({
                status: 'success',
                data: product
            });
        } catch (error) {
            logError(error, 'getProductById');
            res.status(500).json({ 
                error: 'Error al obtener el producto',
                details: error.message
            });
        }
    }

    // Crear un nuevo producto
    async createProduct(req, res) {
        try {
            const newProduct = await prisma.product.create({
                data: req.body,
                include: {
                    templates: true
                }
            });
            
            res.status(201).json({
                status: 'success',
                data: newProduct
            });
        } catch (error) {
            logError(error, 'createProduct');
            
            if (error.code?.startsWith('P2')) {
                const { status, message, details } = handlePrismaError(error);
                return res.status(status).json({ error: message, details });
            }
            
            res.status(500).json({ 
                error: 'Error al crear el producto',
                details: error.message
            });
        }
    }

    // Actualizar un producto
    async updateProduct(req, res) {
        try {
            const updatedProduct = await prisma.product.update({
                where: { id: req.params.id },
                data: req.body,
                include: {
                    templates: true
                }
            });
            
            res.json({
                status: 'success',
                data: updatedProduct
            });
        } catch (error) {
            logError(error, 'updateProduct');
            
            if (error.code === 'P2025') {
                return res.status(404).json({
                    error: 'Producto no encontrado'
                });
            }
            
            res.status(500).json({ 
                error: 'Error al actualizar el producto',
                details: error.message
            });
        }
    }

    // Eliminar un producto
    async deleteProduct(req, res) {
        try {
            await prisma.product.delete({
                where: { id: req.params.id }
            });
            
            res.json({
                status: 'success',
                message: 'Producto eliminado correctamente'
            });
        } catch (error) {
            logError(error, 'deleteProduct');
            
            if (error.code === 'P2025') {
                return res.status(404).json({
                    error: 'Producto no encontrado'
                });
            }
            
            res.status(500).json({ 
                error: 'Error al eliminar el producto',
                details: error.message
            });
        }
    }
}

module.exports = new ProductController(); 