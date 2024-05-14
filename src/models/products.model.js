import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: { type: String },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: true,
        index:true
    },
    thumbnails: {
        type: Array,
        default:[]
    }
})

productsSchema.plugin(mongoosePaginate)
const ProductsModel = mongoose.model("products", productsSchema)

export default ProductsModel;
