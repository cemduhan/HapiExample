'use strict';

const Joi = require('joi');

module.exports = {
  index: {
    params: {
      restaurant_id: Joi.number().integer().required()
    }
  },

  show: {
    params: {
      id: Joi.number().integer().required(),
      restaurant_id: Joi.number().integer().required()
    }
  },

  create: {
    params: {
      restaurant_id: Joi.number().integer().required()
    },
    payload: Joi.object().keys({
      food: Joi.object().keys({
        name: Joi.string().min(2).max(40).required()
      }).required()
    }).required()
  },

  update: {
    params: {
      id: Joi.number().integer().required(),
      restaurant_id: Joi.number().integer().required()
    },
    payload: Joi.object().keys({
      food: Joi.object().keys({
        name: Joi.string().min(2).max(40).required(),
        restaurant_id: Joi.number().integer().required()
      }).required()
    }).required()
  },

  delete: {
    params: {
      id: Joi.number().integer().required(),
      restaurant_id: Joi.number().integer().required()
    }
  }
};
