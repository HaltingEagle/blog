import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "blog",
        required: true
    },
    text: {
        type: String,
        required: true
    },
    image:{
        type: String,
        default: ""
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const commentModel = mongoose.models.comment || mongoose.model('comment', commentSchema);
export default commentModel;
