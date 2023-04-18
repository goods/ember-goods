'use strict';

let layout = {};
layout['base-scale'] = 10; // Base scale in px

module.exports = {
  name: require('./package').name,
  contentFor: function (type) {
    if (type === 'head') {
      return '<link rel="preconnect" href="https://api.goods.co.uk">';
    }

    return '';
  },

  isDevelopingAddon() {
    return true;
  },

  included() {
    let config = this.project.config()['ember-assembly'] || { styles: {} };

    let virtualModules = {
      layout: Object.assign({}, layout, config.styles.layout),
    };

    this.options = Object.assign({}, this.options, {
      cssModules: {
        virtualModules,
        plugins: [
          require('postcss-functions')({
            functions: {
              scl: function (value) {
                return value * virtualModules['layout']['base-scale'] + 'px';
              },
            },
          }),
        ],
      },
    });

    this._super.included.apply(this, arguments);
  },
};
