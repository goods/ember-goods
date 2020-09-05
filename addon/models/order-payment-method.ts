import DS from "ember-data";
import Order from "./order";
import ShopPaymentMethod from "./shop-payment-method";

export default class OrderPaymentMethod extends DS.Model {
  @DS.attr("number") maxPayableAmount!: number;
  @DS.belongsTo("order") order!: Order;
  @DS.belongsTo("shop-payment-method") shopPaymentMethod!: ShopPaymentMethod;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "order-payment-method": OrderPaymentMethod;
  }
}
