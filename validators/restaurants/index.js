'use strict';

const Joi = require('joi');

module.exports = {
  index: {
    //  No need to perform validation.
  },

  show: {
    params: {
      id: Joi.number().integer().required()
    }
  },

  create: {
    payload: Joi.object().keys({
      restaurant: Joi.object().keys({
        name: Joi.string().min(2).max(40).required()
      }).required()
    }).required()
  },

  update: {
    params: {
      id: Joi.number().integer().required()
    },
    payload: Joi.object().keys({
      restaurant: Joi.object().keys({
        name: Joi.string().min(2).max(40).required()
      }).required()
    }).required()
  },

  delete: {
    params: {
      id: Joi.number().integer().required()
    }
  }
};
