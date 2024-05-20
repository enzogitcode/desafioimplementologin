import express from "express";
const cartRouter = express.Router();

import CartManager from "../controllers/carts.manager.js";
import CartModel from "../models/carts.model.js";
import ProductsModel from "../models/products.model.js";
const cartManager = new CartManager()

//Visualizar todos los carritos existentes //Funciona
cartRouter.get("/carts/", async (req, res) => {
    const carts = await CartModel.find().lean();
    res.render("cartsContainer", { carts: carts })
    console.log(carts);
})
//Visualizar un solo carrito
cartRouter.get("/carts/:cid", async (req, res) => {
    let cartId = req.params.cid
    try {
        const cart = await CartModel.findById(cartId).lean()
        res.render("cartsContainer", { products: cart })
        if (!cart) {
            console.log("No existe un carrito con ese Id")
            res.send.json("No existe un carrito con ese Id")
        }
        console.log(cart)
    } catch (error) {
        res.status(500).json({ message: "Error: No se puede visualizar el carrito" })
    }
})
//Crear un nuevo carrito
cartRouter.post("/api/carts", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.render("cartsContainer", { carts: newCart })
    } catch (error) {
        console.log("Error al crear el carrito", error)
        res.status(500).json({ message: "Error: No se pudo crear el carrito" })
    }
})
//Agregar un producto al carrito
cartRouter.post("/api/carts/:cid/products/:pid", async (req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    let quantity = req.body.quantity || 1
    try {
        const updatedCart = await cartManager.addProducts(cartId, productId, quantity)
        res.json(updatedCart)
    } catch (error) {
        res.status(500).json({ message: "Error: No se pudo agregar el producto al carrito" })

    }
})
//actualizar el carrito
cartRouter.put("/api/carts/:cid", async (req, res) => {
    let cartId = req.params.cid
    let updatedProducts = req.body
    try {
        const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
        res.json(updatedCart)
    } catch (error) {
        console.log("No se pudo actualizar el carrito", error);
        res.status(500).json({ message: "Error en el servidor" })
    }
})
//actualizar la cantidad de ejemplares de un determinado producto
cartRouter.put("/api/carts/:cid/products/:pid", async (req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    let newQuantity = req.body.quantity

    try {
    const updatedCart = await cartManager.updateProductQuantity(cartId, productId, newQuantity)

        res.json({message:"Cantidad actualizada correctamente", updatedCart})

    } catch (error) {
        console.log("No se pudo actualizar la cantidad", error);
        res.status(500).json({ message: "Error: No se pudo actualizar la cantidad" })

    }

})

/* Eliminar del carrito el producto seleccionado. */
cartRouter.delete("/api/carts/:cid/products/:pid", async (req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    try {
        const updatedCart = await cartManager.deleteProducts(cartId, productId)
        res.json({ message: "Producto eliminado correctamente", updatedCart })

    } catch (error) {
        res.status(500).json({ message: "Error: No se pudo eliminar el producto seleccionado" })
    }
})

//Eliminar todos los productos del carrito seleccionado
cartRouter.delete("/api/carts/:cid", async (req, res) => {
    let cid = req.params.cid
    try {
        const emptyCart = await cartManager.cleanCart(cid)
        if (!cid) {
            res.json({ message: "No existe un carrito con ese id" })
        }
        await emptyCart.save();
        res.json({ message: "Carrito eliminado con éxito" })
    } catch (error) {
        res.status(500).json({ message: "Error: No se pudo vaciar el carrito" })
        console.log(error);
    }
})
export default cartRouter