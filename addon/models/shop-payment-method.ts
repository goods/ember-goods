import DS from "ember-data";
import PaymentMethod from "./payment-method";

export default class ShopPaymentMethod extends DS.Model {
  @DS.belongsTo("payment-method") paymentMethod!: PaymentMethod;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "shop-payment-method": ShopPaymentMethod;
  }
}
