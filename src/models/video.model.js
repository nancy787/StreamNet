import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema( {
    videoFile : {
        type : String,
        required : [true, 'video filed is required']
    },
    thumbnail : {
        type : String,
        required : [true, 'thumbnail filed is required']
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref :"User"
    },
    title : {
        type : String,
        required : [true, 'Title is required']
    },
    description : {
        type : Number,
        required : [true, 'Description is required']
    },
    duration : {
        type : String,
    },
    views : {
        type : Number,
        default : 0
    },
    isPublished : {
        type : Boolean,
        default : false
    },
}, {
    timestamps : true
})

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model('Video', videoSchema)