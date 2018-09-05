"use strict";

module.exports = {
  name: "ember-goods",
  contentFor: function(type) {
    if (type === "head") {
      return '<link rel="preconnect" href="https://api.goods.co.uk">';
    }

    return "";
  }
};
