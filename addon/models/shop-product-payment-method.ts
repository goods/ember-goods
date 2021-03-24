import DS from "ember-data";
import ShopPaymentMethod from "./shop-payment-method";
import Product from "./product";

export default class ShopProductPaymentMethod extends DS.Model {
  @DS.belongsTo("product") product!: Product;
  @DS.belongsTo("shop-payment-method") shopPaymentMethod!: ShopPaymentMethod;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "shop-product-payment-method": ShopProductPaymentMethod;
  }
}
