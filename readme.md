# Integración de chatGPT o gpt-4 en react

Este proyecto es una aplicación que integra ChatGPT con React y cuenta con funcionalidades para crear una cuenta y tener un historial de chats. El backend está hecho en Node.js y se conecta a una base de datos Postgres, mientras que el frontend está hecho en React con Vite.

### Configuración del backend

El backend requiere que se configuren las siguientes variables de entorno:

OPENAI_API_KEY: la clave de API para acceder a OpenAI GPT-3.
DATABASE_URL: la URL de la base de datos de Postgres a la que se va a conectar el backend.
GOOGLE_CLIENT_ID: el ID del cliente de Google que se usará para autenticar a los usuarios.
JWT_SECRET: la clave secreta que se usará para firmar los tokens JWT.
Para configurar estas variables de entorno, debe crear un archivo .env en la carpeta backend del proyecto. Este archivo debe tener el siguiente formato:

```
OPENAI_API_KEY=<su clave de API de OpenAI>
DATABASE_URL=<su URL de base de datos de Postgres>
GOOGLE_CLIENT_ID=<su ID de cliente de Google>
JWT_SECRET=<su clave secreta JWT>
```

### Configuración del frontend

El frontend requiere que se configuren las siguientes variables de entorno:

VITE_API_URL: la URL del backend API que se utilizará para enviar y recibir datos.
VITE_GOOGLE_CLIENT_ID: el ID del cliente de Google que se usará para autenticar a los usuarios.
VITE_STRIPE_PRICING_TABLE_ID: el ID de la tabla de precios de Stripe que se utilizará para mostrar los precios de la suscripción.
VITE_STRIPE_PUBLISHABLE_KEY: la clave pública de Stripe que se utilizará para procesar los pagos.
Para configurar estas variables de entorno, debe crear un archivo .env en la carpeta frontend del proyecto. Este archivo debe tener el siguiente formato:

```
VITE_API_URL=<la URL del backend API>
VITE_GOOGLE_CLIENT_ID=<su ID de cliente de Google>
VITE_STRIPE_PRICING_TABLE_ID=<su ID de tabla de precios de Stripe>
VITE_STRIPE_PUBLISHABLE_KEY=<su clave pública de Stripe>
```

Ejecutar la aplicación
Para ejecutar la aplicación, debe realizar los siguientes pasos:

Abra una terminal en la carpeta backend del proyecto.
Ejecute el siguiente comando para instalar las dependencias del backend:

```
npm install
```

Ejecute el siguiente comando para iniciar el backend:

```
npm start
```

Abra otra terminal en la carpeta frontend del proyecto.
Ejecute el siguiente comando para instalar las dependencias del frontend:

```
npm install
```

Ejecute el siguiente comando para iniciar el frontend:

```
npm start
```

Abra su navegador y vaya a http://localhost:5173 para ver la aplicación en acción.
¡Listo! Ahora puede utilizar la aplicación y disfrutar de la integración de ChatGPT con React.
