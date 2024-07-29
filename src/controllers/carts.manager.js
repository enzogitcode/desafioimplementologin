import CartModel from "../models/carts.model.js";
import ProductsModel from "../models/products.model.js";

class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error al crear el nuevo carrito", error)
            throw error;
        }
    }
    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId)
            if (!cart) {
                console.log("No existe un carrito con ese Id");
                return null
            }
            return cart;
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async addProducts(cartId, productId, quantity=1) {
        try {
            const cart = await this.getCartById(cartId);
            const productExist = cart.products.find(item => item.product.toString() === productId);

            if (productExist) {
                productExist.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            cart.markModified("products");

            await cart.save();
            return cart;

        } catch (error) {
            console.log("Error al agregar un producto", error);
            throw error;
        }
    }
    async updateCart (cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId)
            if (!cart) {
                console.log("Carrito no encontrado");

            }
            cart.products= updatedProducts
            cart.markModified("products") 
            return cart
            
        } catch (error) {
            console.log ("No se pudo actualizar el carrito", error)
            throw error
        }
    }
    async updateProductQuantity (cartId, productId) {
        
    }
    async deleteProducts(cartId, productId){
        try {
            const cart= await CartModel.findById(cartId)
            if (!cart) {
                throw new Error("Carrito no encontrado")
            }
            cart.products= await ProductsModel.findById(productId)
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error no se pudo eliminar el producto del carrito", error);

            throw error
        }
    }
    async clearCart (cartId) {
        try {
            const cart= await CartModel.findByIdAndUpdate(cartId, {products:[]}, {new: true} )
            if (!cart) {
                throw new Error ("Carrito no encontrado")
            }
            return cart
        } catch (error) {
            console.log("Error al vaciar el carrito", error);
            throw Error
        }
    }
}


export default CartManager;