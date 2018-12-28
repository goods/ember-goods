import Model from "ember-data/model";
// import { attr } from "@ember-decorators/data";

export default class Shop extends Model {
  // normal class body definition here
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    shop: Shop;
  }
}
