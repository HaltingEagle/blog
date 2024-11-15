import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    articles: [{
        type: Schema.Types.ObjectId,
        ref: "blog"
    }]
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;