'use strict';

const Controller = require('src/controllers/restaurants/foods');
const Validator = require('src/validators/restaurants/foods');

module.exports = [
  {
    method: 'GET',
    path: '/restaurants/{restaurant_id}/foods/',
    config: {
      handler: Controller.index,
      validate: Validator.index,
      description: 'Lists all foods.',
      notes: null,
      tags: ['food-service']
    }
  },

  {
    method: 'GET',
    path: '/restaurants/{restaurant_id}/foods/{id}/',
    config: {
      handler: Controller.show,
      validate: Validator.show,
      description: 'Lists all foods.',
      notes: null,
      tags: ['food-service']
    }
  },

  {
    method: 'POST',
    path: '/restaurants/{restaurant_id}/foods/',
    config: {
      handler: Controller.create,
      validate: Validator.create,
      description: 'Lists all foods.',
      notes: null,
      tags: ['food-service']
    }
  },

  {
    method: 'PUT',
    path: '/restaurants/{restaurant_id}/foods/{id}/',
    config: {
      handler: Controller.update,
      validate: Validator.update,
      description: 'Lists all foods.',
      notes: null,
      tags: ['food-service']
    }
  },

  {
    method: 'DELETE',
    path: '/restaurants/{restaurant_id}/foods/{id}/',
    config: {
      handler: Controller.delete,
      validate: Validator.delete,
      description: 'Lists all foods.',
      notes: null,
      tags: ['food-service']
    }
  }
];
