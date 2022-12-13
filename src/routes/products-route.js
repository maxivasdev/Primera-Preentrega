import { Router } from "express";
import ProductManager from "../managers/product-manager.js";

const route = Router();
const manager = new ProductManager('./src/data/products.json');

route.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const result = await manager.getProducts(limit);
        if(result.status == 400){
            return res.status(400).send({status: result.status, message: result.message})
        }
        res.status(200).send(result);
    } catch (err) {
        res.send({ status: 500, message: 'Hay un error en el servidor' });
    }
});

route.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await manager.getProductById(id);
        if(result.status == 400){
            return res.status(400).send({status: result.status, message: result.message})
        }
        res.send(result);
    } catch (err) {
        res.send({ status: 500, message: 'Hay un error en el servidor: ' + err });
    }
});

route.post('/', async (req, res) => {

    try {
        const { title, description, price, thumbnails, code, status, category, stock } = req.body;

        if (!title || !description || !price || !code || !stock || !category) {
            return res.send({ status: 400, message: 'Todos los campos son obligatorios' });
        }

        await manager.addProduct(title, description, price, thumbnails, code, category, stock);
        res.send({ status: 200, message: 'Se ha agregado el producto: ' + title });

    } catch (err) {
        res.send({ status: 500, message: 'Hay un error en el servidor: ' + err });
    }

})

route.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const obj = req.body;
        await manager.updateProduct(id, obj);
        res.send({ status: 200, message: 'Se ha actualizado el producto con id: ' + id });
    } catch (err) {
        res.send({ status: 500, message: 'Hay un error en el servidor: ' + err });
    }
})

route.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await manager.deleteProduct(id);
        res.send({ status: 200, message: 'Se ha eliminado el producto con id: ' + id });
    } catch (err) {
        res.send({ status: 500, message: 'Hay un error en el servidor: ' + err });
    }
})

export default route