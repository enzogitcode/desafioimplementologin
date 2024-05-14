import mongoose from 'mongoose'

const schema= new mongoose.Schema({
    first_name: {
        type:String,
        required: true
    },
    last_name: {
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        index: true,
        unique: true

    },
    age: {
        type: Number,
        required: true
    },
    password: {
        required: true,
        type: String
    }
})

const UserModel= mongoose.model("users", schema)

export default UserModel