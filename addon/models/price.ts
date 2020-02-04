import DS from "ember-data";

export default class Price extends DS.Model {
  @DS.attr("number") value!: number;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    price: Price;
  }
}
