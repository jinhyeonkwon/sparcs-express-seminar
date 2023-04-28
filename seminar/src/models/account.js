const mongoose = require('mongoose');

const OSchemaDefinition = {
  id: String,
  total: Number,
};

const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const AccountModel = mongoose.model('account', schema);

module.exports = AccountModel;
