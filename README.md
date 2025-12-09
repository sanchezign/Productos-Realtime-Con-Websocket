# Programación Backend I: Desarrollo Avanzado
**Handlebars + WebSockets en tiempo real.**  
 
 ## Tecnologías utilizadas
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express](https://img.shields.io/badge/Express-4.18-blue)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-red)
![Handlebars](https://img.shields.io/badge/Handlebars-7.1-orange)

## Objetivos cumplidos:
- Motor de plantillas **Handlebars**.
- Dos vistas: `home.handlebars` y `realTimeProducts.handlebars`.
- WebSockets totalmente funcionales con **Socket.IO**.
- Creación y eliminación de productos **en tiempo real** (se actualiza en todas las pestañas sin recargar).
- Lógica de productos encapsulada en clase `ProductManager` (código limpio y reutilizable).
- Validaciones completas tanto por HTTP como por WebSocket.
- Manejo de errores con feedback al cliente.
- Generación de IDs sin duplicación.
- Buenas prácticas: singleton, try/catch, sanitización de datos.

## Cómo ejecutar el proyecto

```bash
# 1. Clonar o descargar el repositorio

git clone https://github.com/sanchezign/Productos-Realtime-Con-Websocket.git

cd Productos-Realtime-Con-Websocket

# 2. Instalar dependencias

npm install

# 3. Iniciar el servidor

npm start



