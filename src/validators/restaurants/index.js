'use strict';

const Joi = require('joi');

module.exports = {
  index: {
    query: {
      name: Joi.string().min(2).max(40),
      limit: Joi.number().integer().min(1).max(40).default(20),
      offset: Joi.number().integer().min(0).default(0)
    }
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
