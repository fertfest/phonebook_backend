require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)

  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: (val) => /^\d{2,3}-\d+$/.test(val),
      message: (props) => `${props.value} doesn't conform to right format of a number`,
    },
  },
});

personSchema.set('validateBeforeSave', false);

personSchema.set('toJSON', {
  transform: (document, returnedObject) => ({
    name: returnedObject.name,
    number: returnedObject.number,
    id: returnedObject._id,
  }),
});

module.exports = mongoose.model('Person', personSchema);
