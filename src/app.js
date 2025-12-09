import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import ProductManager from './managers/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const pm = ProductManager.getInstance();

// VISTAS
app.get('/', async (req, res) => {
    const productos = await pm.getAll();
    res.render('home', { productos, title: "Home" });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { title: "Productos Realtime con Websocket" });
});

// API HTTP (opcional pero útil)
app.post('/api/products', async (req, res) => {
    try {
        const producto = await pm.create(req.body);
        io.emit('productoCreado', producto);
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await pm.delete(req.params.id);
        io.emit('productoEliminado', Number(req.params.id));
        res.json({ status: 'ok' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// SERVIDOR + SOCKET.IO
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Enviar lista actual al conectar
    pm.getAll().then(productos => {
        socket.emit('actualizarProductos', productos);
    });

    // CREAR vía WebSocket con validación y try/catch
    socket.on('crearProducto', async (datos) => {
        try {
            const producto = await pm.create(datos);
            io.emit('productoCreado', producto);
        } catch (error) {
            socket.emit('errorCrear', error.message);
        }
    });

    // ELIMINAR vía WebSocket con feedback
    socket.on('eliminarProducto', async (id) => {
        try {
            await pm.delete(id);
            io.emit('productoEliminado', Number(id));
        } catch (error) {
            socket.emit('errorEliminar', error.message);
        }
    });
});