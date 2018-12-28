"use strict";

module.exports = {
  name: require("./package").name,
  contentFor: function(type) {
    if (type === "head") {
      return '<link rel="preconnect" href="https://api.goods.co.uk">';
    }

    return "";
  },

  isDevelopingAddon() {
    return true;
  }
};
