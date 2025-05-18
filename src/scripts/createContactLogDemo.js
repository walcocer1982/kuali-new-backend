const prisma = require('../lib/prisma');

async function createDemoData() {
  try {
    // 1. Create Company
    const company = await prisma.company.create({
      data: {
        name: 'Demo Company'
      }
    });
    console.log('Company created:', company);

    // 2. Create Lead
    const lead = await prisma.lead.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@demo.com',
        phoneNumber: '+51987654321',
        companyId: company.id,
        status: 'NUEVO'
      }
    });
    console.log('Lead created:', lead);

    // 3. Create Template
    const template = await prisma.template.create({
      data: {
        title: 'Welcome Template',
        body: 'Welcome to our platform {{firstName}}',
        stepsJson: { steps: [] }
      }
    });
    console.log('Template created:', template);

    // 4. Create Contact Log
    const contactLog = await prisma.contact_Log.create({
      data: {
        leadId: lead.id,
        templateId: template.id,
        status: 'PENDIENTE'
      },
      include: {
        lead: true,
        template: true
      }
    });
    console.log('Contact Log created:', contactLog);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  createDemoData()
    .catch(console.error);
}

module.exports = createDemoData; 