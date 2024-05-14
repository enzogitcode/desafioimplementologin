import express from 'express'
const router = express.Router();
import ProductsModel from "../models/products.model.js";

router.get("/", async (req, res) => {
    try {
        const products = await ProductsModel.find().lean()
        res.render('index', { products: products })
    } catch (error) {
        res.status(500).json("Error en el servidor")
    }
})
router.get("/products", async (req, res) => {

const {limit=10, page= 1, query, sort}= req.query

    try {

    const sortOption = {}
       if (sort !== 0) {
           sortOption.price = sort;
       }

        const products = await ProductsModel.paginate({}, { limit, page })

        const productsFinal = products.docs.map(product => {
            const { _id, ...rest } = product.toObject();
            return rest;
        })
        
        res.render("index", {
            payload: productsFinal,
            products: productsFinal,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
            prevLink: products.hasPrevPage? `/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`: null,
            nextLink: products.hasNextPage? `/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`: null,
        })

        console.log(products)
        console.log(productsFinal)
    } catch (error) {
        res.status(500).json("Error en el servidor")
    }
})

router.post("/products", async (req, res) => {
    const newProduct = req.body
    try {
        const product = new ProductsModel(newProduct)
        await product.save();
        res.send({
            message: "Producto agregado exitosamente", product: product,
        })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" })
    }
})
router.put("/products/:pid", async (req, res) => {
    const idProduct = req.params.pid
    const newData = req.body
    try {
        let foundedProduct = await ProductsModel.find(idProduct)
        await ProductsModel.findByIdAndUpdate(idProduct, newData)
        res.status(200).send({ message: "Producto actualizado exitosamente" })

        if (!foundedProduct) {
            return res.status(404).json({ message: "Error: Producto no encontrado" })
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto" })
    }
})

router.delete("products/:pid", async (req, res) => {

    let idProduct = req.params.pid
    try {
        await ProductsModel.findByIdAndDelete(idProduct);
        if (!idProduct) {
            return res.status(404).json({ message: "Error: Producto no encontrado" })
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto" })
    }
})

export default router