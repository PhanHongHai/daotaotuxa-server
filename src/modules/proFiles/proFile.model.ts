import * as mongoose from 'mongoose';
import {Schema, Types} from 'mongoose';
import {IProFile} from './proFile.interface';
import mongoosePaginate from 'mongoose-paginate';
const ProFileSchema = new Schema({
    accountID:{
        type: Types.ObjectId,
        ref: 'accounts',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    path:{
        type: String,
        required: true
    },
    url:{
        type:String,
        required:true
    },
    isDeleted: {
        type: Boolean,
        default:false,
        required: true,
    }
},{
    timestamps: true,
});

ProFileSchema.plugin(mongoosePaginate);
const ProFileModel = mongoose.model<IProFile>('proFiles',ProFileSchema);
export default ProFileModel; 
