'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

module.exports = function crawl(currentPath) {
  return _.flattenDeep(fs.readdirSync(currentPath)
    .map(node => {
      const targetPath = path.join(currentPath, node);

      try {
        fs.readdirSync(targetPath);

        return crawl(targetPath);
      } catch (err) {
        if (err.code === 'ENOTDIR') {
          return require(`../${currentPath}/${path.basename(targetPath, '.js')}`);
        }

        throw err;
      }
    }));
};
