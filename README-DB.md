# Database Configuration

## Error encontrado

Se detectó un error en la configuración de la base de datos. La URL en .env tenía un salto de línea que causaba fallas de conexión en Render.

## Solución

Asegúrate de que la URL de la base de datos esté en una sola línea en el archivo .env:

```
DATABASE_URL=postgresql://database_owner:npg_8b4RljJmeVhH@ep-hidden-band-a4faipgl-pooler.us-east-1.aws.neon.tech/database?sslmode=require
```
