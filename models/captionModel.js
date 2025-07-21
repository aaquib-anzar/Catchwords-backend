import mongoose from "mongoose";
const captionSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true,
        unique:true
    },
    captions:{
        type:[Array],
        default:[]
    }
},{timestamps:true})

const Caption = mongoose.model("Caption",captionSchema)

export default Caption

