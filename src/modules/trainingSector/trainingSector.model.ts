import * as mongoose from 'mongoose';

import { Schema } from 'mongoose';
import { ITrainingSector } from './trainingSector.interface';
import mongoosePaginate from 'mongoose-paginate';


const TrainingSectorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    required: true
  }
}, {
  timestamps: true,
});


TrainingSectorSchema.plugin(mongoosePaginate);
const TrainingSectorModel = mongoose.model<ITrainingSector>('trainingSectors', TrainingSectorSchema);
export default TrainingSectorModel;