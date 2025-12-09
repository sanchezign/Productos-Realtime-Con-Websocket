import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PRODUCTS_FILE = path.join(__dirname, '../products.json');

export default class ProductManager {
    static #instance;

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new ProductManager();
        }
        return this.#instance;
    }

    async #leer() {
        try {
            const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async #guardar(productos) {
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(productos, null, 2));
    }

    async getAll() {
        return await this.#leer();
    }

    async create(productoRaw) {
        // Validación completa
        const required = ['title', 'description', 'code', 'price', 'stock', 'category'];
        for (const campo of required) {
            if (!productoRaw[campo] || productoRaw[campo].toString().trim() === '') {
                throw new Error(`El campo ${campo} es obligatorio`);
            }
        }

        const productos = await this.#leer();

        // Generar ID
        const maxId = productos.length === 0 
            ? 0 
            : Math.max(...productos.map(p => Number(p.id)));
        const id = maxId + 1;

        const nuevoProducto = {
            id,
            title: productoRaw.title.trim(),
            description: productoRaw.description.trim(),
            code: productoRaw.code.trim(),
            price: Number(productoRaw.price),
            status: true,
            stock: Number(productoRaw.stock),
            category: productoRaw.category.trim(),
            thumbnails: productoRaw.thumbnails || []
        };

        productos.push(nuevoProducto);
        await this.#guardar(productos);
        return nuevoProducto;
    }

    async delete(id) {
        const productos = await this.#leer();
        const indice = productos.findIndex(p => p.id === Number(id));

        if (indice === -1) {
            throw new Error('Producto no encontrado');
        }

        productos.splice(indice, 1);
        await this.#guardar(productos);
        return true;
    }
}