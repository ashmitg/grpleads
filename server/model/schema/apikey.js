const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  googRefreshToken: { type: String, default: '' },
  googEmailAddress: { type: String, default: '' },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  GrouponApikey: { type: String, default: '' },
  GrouponClientSecret: { type: String, default: '' },
  GrouponApidate: { type: String, default: '' },

});

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

module.exports = ApiKey;
