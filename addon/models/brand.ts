import DS from "ember-data";

export default class Brand extends DS.Model {}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    brand: Brand;
  }
}
