import *as mongoose from 'mongoose';
import {Schema} from 'mongoose'
import mongoosePaginate from 'mongoose-paginate';
const UploadSchema = new Schema ({
    name: {
        type: String,
        required: false
    },
    mimeType: {
        type: String,
        required: false
    },
    
})