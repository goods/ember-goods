import DS from "ember-data";

export default class PaymentMethod extends DS.Model {
  @DS.attr("string") name!: string;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "payment-method": PaymentMethod;
  }
}
