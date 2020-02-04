import DS from "ember-data";

export default class Shop extends DS.Model {
  // normal class body definition here
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    shop: Shop;
  }
}
