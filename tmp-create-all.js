const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAll() {
    try {
        console.log('🚀 Iniciando creación de datos...');

        // 1. Crear o actualizar productos base
        console.log('\n📦 Creando/actualizando productos...');
        const products = await Promise.all([
            prisma.product.upsert({
                where: { name: 'CV Scanner' },
                update: {
                    description: 'Sistema de escaneo y análisis de CVs'
                },
                create: {
                    name: 'CV Scanner',
                    description: 'Sistema de escaneo y análisis de CVs'
                }
            }),
            prisma.product.upsert({
                where: { name: 'People Management' },
                update: {
                    description: 'Sistema de gestión de personal'
                },
                create: {
                    name: 'People Management',
                    description: 'Sistema de gestión de personal'
                }
            }),
            prisma.product.upsert({
                where: { name: 'Automated Calls' },
                update: {
                    description: 'Sistema de llamadas automatizadas'
                },
                create: {
                    name: 'Automated Calls',
                    description: 'Sistema de llamadas automatizadas'
                }
            })
        ]);

        // 2. Crear plantillas para cada producto
        console.log('\n📝 Creando plantillas...');
        const templates = [];
        for (const product of products) {
            const productTemplates = await Promise.all([
                // Plantilla de bienvenida
                prisma.template.create({
                    data: {
                        title: `Bienvenida ${product.name}`,
                        body: `¡Hola! Gracias por tu interés en ${product.name}. ¿Te gustaría conocer más sobre nuestras soluciones?`,
                        productId: product.id,
                        type: 'WELCOME',
                        tags: ['bienvenida', product.name.toLowerCase(), 'inicial']
                    }
                }),
                // Plantilla de seguimiento
                prisma.template.create({
                    data: {
                        title: `Seguimiento ${product.name}`,
                        body: `¿Qué te pareció la información sobre ${product.name}? ¿Tienes alguna duda específica?`,
                        productId: product.id,
                        type: 'FOLLOW_UP',
                        tags: ['seguimiento', product.name.toLowerCase()]
                    }
                }),
                // Plantilla de cierre
                prisma.template.create({
                    data: {
                        title: `Cierre ${product.name}`,
                        body: `¿Te gustaría agendar una demostración personalizada de ${product.name}?`,
                        productId: product.id,
                        type: 'CLOSING',
                        tags: ['cierre', product.name.toLowerCase(), 'demo']
                    }
                })
            ]);
            templates.push(...productTemplates);
        }

        // 3. Crear interacciones para los leads existentes
        console.log('\n👥 Creando interacciones para leads...');
        const leads = await prisma.lead.findMany();
        
        for (const lead of leads) {
            // Crear interacción inicial de WhatsApp
            await prisma.interaction.create({
                data: {
                    leadId: lead.id,
                    type: 'WHATSAPP',
                    notes: 'Primer contacto por WhatsApp',
                    result: 'Cliente interesado en más información',
                    completedAt: new Date()
                }
            });

            // Crear interacción de seguimiento programada
            await prisma.interaction.create({
                data: {
                    leadId: lead.id,
                    type: 'CALL',
                    notes: 'Llamada de seguimiento programada',
                    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Mañana
                }
            });
        }

        // 4. Crear registros de uso de plantillas (Contact_Log)
        console.log('\n📨 Creando logs de contacto...');
        for (const lead of leads) {
            // Obtener una plantilla de bienvenida aleatoria
            const welcomeTemplate = templates.find(t => t.type === 'WELCOME');
            
            if (welcomeTemplate) {
                await prisma.contact_Log.create({
                    data: {
                        leadId: lead.id,
                        templateId: welcomeTemplate.id,
                        status: 'PENDIENTE'
                    }
                });
            }
        }

        // 5. Crear interacciones de plantillas
        console.log('\n🔄 Creando interacciones de plantillas...');
        for (const product of products) {
            await Promise.all([
                prisma.templateInteraction.create({
                    data: {
                        productId: product.id,
                        type: 'WELCOME',
                        notes: 'Respuesta positiva a mensaje de bienvenida',
                        result: 'Cliente solicita más información',
                        examples: JSON.stringify([
                            'Gracias por la información',
                            'Me interesa saber más',
                            'Quisiera una demo'
                        ])
                    }
                }),
                prisma.templateInteraction.create({
                    data: {
                        productId: product.id,
                        type: 'FOLLOW_UP',
                        notes: 'Seguimiento efectivo',
                        result: 'Cliente agenda demo',
                        examples: JSON.stringify([
                            'Sí, me gustaría ver una demo',
                            '¿Cuándo podríamos agendar?',
                            'Prefiero la próxima semana'
                        ])
                    }
                })
            ]);
        }

        console.log('\n✅ Proceso completado exitosamente');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAll(); 