import DS from "ember-data";

export default class BasketRule extends DS.Model {
  @DS.attr("string") label!: string;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "basket-rule": BasketRule;
  }
}
