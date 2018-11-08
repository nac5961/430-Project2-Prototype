// Import Libraries
const mongoose = require('mongoose');
const _ = require('underscore');

// Set mongoose promise
mongoose.Promise = global.Promise;

// Variable to hold the Payment Model
let PaymentModel = {};

const convertId = mongoose.Types.ObjectId;
const setString = (value) => _.escape(value).trim();

// Create a schema for the Payment collection
const PaymentSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  name: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    set: setString,
  },
  cost: {
    type: Number,
    required: true,
    min: 0,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Function to get payment information that we want to store
// in a user's session (this is the information we store in
// req.session.account)
PaymentSchema.statics.toSession = (doc) => ({
  name: doc.name,
  cost: doc.cost,
  dueDue: doc.dueDate,
});

// Function to get all payments by the owner
PaymentSchema.statics.findAllByOwner = (ownerId, callback) => {
  const query = {
    ownerId: convertId(ownerId),
  };

  return PaymentModel.find(query).select('name cost dueDate').exec(callback);
};

// Function to delete one payment by the owner
PaymentSchema.statics.deleteOneByOwner = (name, ownerId, callback) => {
  const query = {
    name,
    ownerId: convertId(ownerId),
  };

  return PaymentModel.findOneAndDelete(query, callback);
};

// Function to update on payment by the owner
PaymentSchema.statics.updateOneByOwner = (name, ownerId, updatedPayment, callback) => {
  const query = {
    name,
    ownerId: convertId(ownerId),
  };

  return PaymentModel.findOneAndUpdate(query, updatedPayment, callback);
};

// Create the Payment model
PaymentModel = mongoose.model('Payment', PaymentSchema);

module.exports = {
  PaymentSchema,
  PaymentModel,
};

