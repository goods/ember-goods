import DS from "ember-data";
import Order from "./order";
import ShopPaymentMethod from "./shop-payment-method";

export default class Payment extends DS.Model {
  @DS.attr("number") amount!: number;
  @DS.attr("string") token!: string;
  @DS.attr("boolean", { defaultValue: true }) capture!: boolean;
  @DS.attr("string") cardNumber!: string;
  @DS.attr("string") cardholder!: string;
  @DS.attr("string") cardType!: string;
  @DS.attr("string") validFrom!: string;
  @DS.attr("string") expiryDate!: string;
  @DS.attr("string") issueNumber!: string;
  @DS.attr("string") cvv!: string;
  @DS.attr("string") challengeUrl!: string;
  @DS.attr("string") status!: string;
  @DS.attr() challengeRequest!: any;
  @DS.attr() challengeResponse!: any;
  @DS.attr("string") challengeSuccessUrl!: string;
  @DS.attr("string") challengeFailedUrl!: string;
  @DS.attr("boolean") browserJavascriptEnabled!: boolean;
  @DS.attr("boolean") browserJavaEnabled!: boolean;
  @DS.attr("string") browserColorDepth!: string;
  @DS.attr("string") browserScreenHeight!: string;
  @DS.attr("string") browserScreenWidth!: string;
  @DS.attr("string") browserTimezone!: string;
  @DS.attr("string") browserLanguage!: string;
  @DS.belongsTo("order") order!: Order;
  @DS.belongsTo("shop-payment-method") shopPaymentMethod!: ShopPaymentMethod;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    payment: Payment;
  }
}
