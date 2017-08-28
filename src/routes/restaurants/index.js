'use strict';

const Controller = require('src/controllers/restaurants');
const Validator = require('src/validators/restaurants');

module.exports = [
  {
    method: 'GET',
    path: '/restaurants/',
    config: {
      handler: Controller.index,
      validate: Validator.index,
      description: 'Lists all restaurants.',
      notes: null,
      tags: ['food-service']
    }
  },

  {
    method: 'GET',
    path: '/restaurants/{id}/',
    config: {
      handler: Controller.show,
      validate: Validator.show,
      description: 'Show specific restaurant.',
      notes: null,
      tags: ['food-service']
    }
  },

  {
    method: 'POST',
    path: '/restaurants/',
    config: {
      handler: Controller.create,
      validate: Validator.create,
      description: 'Create a new restaurant.',
      notes: null,
      tags: ['food-service']
    }
  },

  {
    method: 'PUT',
    path: '/restaurants/{id}/',
    config: {
      handler: Controller.update,
      validate: Validator.update,
      description: 'Update a restaurant with id.',
      notes: null,
      tags: ['food-service']
    }
  },

  {
    method: 'DELETE',
    path: '/restaurants/{id}/',
    config: {
      handler: Controller.delete,
      validate: Validator.delete,
      description: 'Delete a restaurant with id.',
      notes: null,
      tags: ['food-service']
    }
  }
];
