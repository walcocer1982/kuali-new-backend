# Datos para Simulación en Kuali

## 1. Empresas Peruanas

1. **BCP (Banco de Crédito del Perú)**
   - Sector: Financiero
   
2. **Alicorp**
   - Sector: Consumo Masivo

3. **Grupo Gloria**
   - Sector: Alimentos y Bebidas
   
4. **Interbank**
   - Sector: Financiero
   
5. **Cementos Pacasmayo**
   - Sector: Construcción
   
6. **VisaNet Perú**
   - Sector: Tecnología y Pagos

## 2. Leads/Candidatos

1. **Carlos Mendoza**
   - Email: carlos.mendoza@gmail.com
   - Teléfono: +51 987 654 321
   - Puesto: Desarrollador Full Stack
   - Empresa actual: Globant
   - Status: NUEVO
   
2. **María Fernanda Rojas**
   - Email: mfrojas@outlook.com
   - Teléfono: +51 986 543 212
   - Puesto: Gerente de Marketing Digital
   - Empresa actual: Circus Grey
   - Status: CONTACTADO
   
3. **Javier Sánchez Ríos**
   - Email: jsanchez@hotmail.com
   - Teléfono: +51 976 432 198
   - Puesto: Analista de Data Science
   - Empresa actual: Everis
   - Status: CALIFICADO
   
4. **Luciana Castro**
   - Email: lucicastro@gmail.com
   - Teléfono: +51 965 321 876
   - Puesto: Especialista en Recursos Humanos
   - Empresa actual: Belcorp
   - Status: OPORTUNIDAD
   
5. **Eduardo Paredes**
   - Email: eparedes@gmail.com
   - Teléfono: +51 954 321 765
   - Puesto: Director Financiero
   - Empresa actual: Scotiabank
   - Status: CLIENTE
   
6. **Ana Paula Montoya**
   - Email: anamontoya@yahoo.com
   - Teléfono: +51 943 765 412
   - Puesto: UX/UI Designer
   - Empresa actual: Laboratoria
   - Status: PERDIDO

## 3. Templates con Pasos

### Template 1: CV Scanner
```json
{
  "title": "Presentación de CV Scanner",
  "body": "Mensaje inicial para presentar CV Scanner",
  "steps": [
    {
      "order": 1,
      "name": "Presentación",
      "message": "Hola, {cliente}! Soy {vendedor}, de Kuali.ai. Te contacto porque sé que revisan muchísimos CVs; nosotros tenemos un scanner con IA que hace esa criba en segundos y sin sesgos. kuali.ai"
    },
    {
      "order": 2,
      "name": "Diagnóstico",
      "message": "¿Cuánto tarda hoy tu equipo en filtrar currículums y qué les cuesta más de ese proceso?"
    },
    {
      "order": 3,
      "name": "Propuesta de valor",
      "message": "Nuestro motor puntúa cada CV según los criterios que tú marques—experiencia, estudios, habilidades—y te entrega un ranking listo para entrevistar. kuali.ai"
    },
    {
      "order": 4,
      "name": "Beneficios",
      "message": "Las empresas que lo usan reducen hasta un 80% el tiempo de revisión y ganan objetividad. kuali.ai"
    },
    {
      "order": 5,
      "name": "Validación",
      "message": "¿Dirías que un filtrado más rápido y justo quitaría presión a tu equipo?"
    },
    {
      "order": 6,
      "name": "Demo",
      "message": "Si te parece, armemos una demo de 30 min con CVs reales el miércoles a las 3 p.m. ¿Te cuadra?"
    },
    {
      "order": 7,
      "name": "Presupuesto",
      "message": "Para enviarte la propuesta, ¿qué rango anual manejan para herramientas de selección?"
    },
    {
      "order": 8, 
      "name": "Cierre",
      "message": "Genial. Te paso la invitación y, tras la demo, podemos lanzar un piloto de dos semanas."
    }
  ],
  "tags": ["CV", "IA", "Filtrado", "Reclutamiento"]
}
```

### Template 2: Llamadas y Mensajes Automatizados
```json
{
  "title": "Contacto Automatizado",
  "body": "Mensaje inicial para presentar sistema de contacto automatizado",
  "steps": [
    {
      "order": 1,
      "name": "Presentación",
      "message": "Hola, {cliente}. Soy {vendedor}, de Kuali.ai. Vi que buscas mejorar el contacto con candidatos; nuestro servicio envía llamadas, WhatsApp y SMS personalizados desde el primer minuto. kuali.ai"
    },
    {
      "order": 2,
      "name": "Diagnóstico",
      "message": "¿En qué fase pierden más postulantes por falta de seguimiento?"
    },
    {
      "order": 3,
      "name": "Propuesta de valor",
      "message": "Configuramos flujos que recuerdan a cada candidato completar su aplicación y les dan el enlace directo, todo segmentado por perfil y horario. kuali.ai"
    },
    {
      "order": 4,
      "name": "Beneficios",
      "message": "Esto suele disparar la tasa de finalización y liberar tiempo al equipo de reclutamiento. kuali.ai"
    },
    {
      "order": 5,
      "name": "Validación",
      "message": "¿Aumentar el contacto temprano ayudaría a reducir vuestro time-to-hire?"
    },
    {
      "order": 6,
      "name": "Demo",
      "message": "Te muestro un flujo real en 20 min mañana a las 10 a.m. ¿Te va?"
    },
    {
      "order": 7,
      "name": "Presupuesto",
      "message": "¿Qué presupuesto anual destinan a comunicación multicanal?"
    },
    {
      "order": 8,
      "name": "Cierre",
      "message": "Te envío la invitación y, tras la demo, habilitamos un piloto de 14 días."
    }
  ],
  "tags": ["Whatsapp", "SMS", "Automatización", "Contacto"]
}
```

### Template 3: Asistente Inteligente de Screening
```json
{
  "title": "Bot de Screening",
  "body": "Mensaje inicial para presentar asistente de screening",
  "steps": [
    {
      "order": 1,
      "name": "Presentación",
      "message": "¡Buenos días, {cliente}! Soy {vendedor}, de Kuali.ai. Tenemos un bot de IA que hace la primera entrevista por voz o chat y evalúa soft skills al instante. kuali.ai"
    },
    {
      "order": 2,
      "name": "Diagnóstico",
      "message": "¿Cuántas horas se van cada semana en entrevistas iniciales y qué tan fácil es medir habilidades blandas?"
    },
    {
      "order": 3,
      "name": "Propuesta de valor",
      "message": "El bot formula preguntas abiertas, analiza el tono y las palabras, y asigna un puntaje objetivo que prioriza a los candidatos adecuados. kuali.ai"
    },
    {
      "order": 4,
      "name": "Beneficios",
      "message": "Ahorras horas de trabajo y obtienes un registro completo de la conversación para decisiones informadas. kuali.ai"
    },
    {
      "order": 5,
      "name": "Validación",
      "message": "¿Crees que un scoring de culture fit desde la primera entrevista sería útil?"
    },
    {
      "order": 6,
      "name": "Demo",
      "message": "¿Te parece una prueba de 25 min el viernes a las 4 p.m. con perfiles reales?"
    },
    {
      "order": 7,
      "name": "Presupuesto",
      "message": "¿Qué rango anual tienen para IA de entrevistas?"
    },
    {
      "order": 8,
      "name": "Cierre",
      "message": "Genial, te paso agenda y, después de la demo, podemos activar un piloto de un mes."
    }
  ],
  "tags": ["IA", "Entrevistas", "Soft Skills", "Screening"]
}
```

### Template 4: People Analytics
```json
{
  "title": "Analytics RR.HH.",
  "body": "Mensaje inicial para presentar Analytics de RRHH",
  "steps": [
    {
      "order": 1,
      "name": "Presentación",
      "message": "Hola, {cliente}. Soy {vendedor}, de Kuali.ai. Nuestra plataforma de People Analytics convierte tu proceso en dashboards de tiempo real para que veas exactamente dónde se atasca cada vacante. kuali.ai"
    },
    {
      "order": 2,
      "name": "Diagnóstico",
      "message": "¿Hoy cómo detectas cuellos de botella o justificas tus decisiones con datos?"
    },
    {
      "order": 3,
      "name": "Propuesta de valor",
      "message": "Integramos tu ATS y ERP y te damos KPIs como tiempo de contratación, tasa de respuesta, costo por hire y calidad de contratación. kuali.ai"
    },
    {
      "order": 4,
      "name": "Beneficios",
      "message": "Con esos datos, los líderes toman decisiones más rápidas y alinean la estrategia de talento al negocio. kuali.ai"
    },
    {
      "order": 5,
      "name": "Validación",
      "message": "¿Un dashboard proactivo facilitaría la priorización de posiciones y el ahorro de costos?"
    },
    {
      "order": 6,
      "name": "Demo",
      "message": "Propongo una demo de 40 min el martes a las 2 p.m. usando datos anonimizados de tu proceso."
    },
    {
      "order": 7,
      "name": "Presupuesto",
      "message": "¿Qué presupuesto anual manejan para analítica de talento?"
    },
    {
      "order": 8,
      "name": "Cierre",
      "message": "Te envío acceso de invitado y un caso de éxito; luego definimos el plan de implementación."
    }
  ],
  "tags": ["Analytics", "Dashboard", "KPI", "Datos"]
}
```

## 4. Interacciones

1. **Interacción con BCP**
   - Lead: Carlos Mendoza
   - Tipo: CALL
   - Notas: "Primera llamada de presentación del CV Scanner"
   - Resultado: "Cliente interesado, solicita más información"
   - Programado: 2023-05-10 10:00:00
   - Completado: 2023-05-10 10:15:00
   
2. **Interacción con Alicorp**
   - Lead: María Fernanda Rojas
   - Tipo: EMAIL
   - Notas: "Envío de propuesta de Llamadas Automatizadas"
   - Resultado: "Cliente pide cotización formal"
   - Programado: 2023-05-12 15:30:00
   - Completado: 2023-05-12 16:00:00

3. **Interacción con Grupo Gloria**
   - Lead: Javier Sánchez Ríos
   - Tipo: MEETING
   - Notas: "Reunión de demostración del Asistente de Screening"
   - Resultado: "Cliente muy interesado, quiere iniciar un piloto"
   - Programado: 2023-05-15 11:00:00
   - Completado: 2023-05-15 11:45:00

4. **Interacción con Interbank**
   - Lead: Luciana Castro
   - Tipo: DEMO
   - Notas: "Demostración de People Analytics con datos reales"
   - Resultado: "Cliente emocionado con las posibilidades"
   - Programado: 2023-05-18 14:00:00
   - Completado: 2023-05-18 15:00:00

5. **Interacción con Cementos Pacasmayo**
   - Lead: Eduardo Paredes
   - Tipo: CALL
   - Notas: "Seguimiento post-implementación de CV Scanner"
   - Resultado: "Cliente satisfecho, quiere añadir módulo de Analytics"
   - Programado: 2023-05-20 16:00:00
   - Completado: 2023-05-20 16:30:00

6. **Interacción con VisaNet**
   - Lead: Ana Paula Montoya
   - Tipo: OTHER
   - Notas: "Cliente canceló la reunión y no desea continuar"
   - Resultado: "Lead perdido, menciona que encontraron otra solución"
   - Programado: 2023-05-22 09:00:00
   - Completado: null

## 5. Resumen de Contactos

1. **Contacto BCP - Carlos Mendoza**
   - Template: CV Scanner
   - Estado: ENVIADO
   
2. **Contacto Alicorp - María Fernanda Rojas**
   - Template: Llamadas y Mensajes Automatizados
   - Estado: LEIDO
   
3. **Contacto Grupo Gloria - Javier Sánchez Ríos**
   - Template: Asistente Inteligente de Screening
   - Estado: RESPONDIDO
   
4. **Contacto Interbank - Luciana Castro**
   - Template: People Analytics
   - Estado: ENTREGADO
   
5. **Contacto Cementos Pacasmayo - Eduardo Paredes**
   - Template: CV Scanner
   - Estado: PENDIENTE
   
6. **Contacto VisaNet - Ana Paula Montoya**
   - Template: Asistente Inteligente de Screening
   - Estado: FALLIDO
