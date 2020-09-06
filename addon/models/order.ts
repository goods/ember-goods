import DS from "ember-data";
import Basket from "./basket";
import Payment from "./payment";
import OrderLine from "./order-line";
import OrderPaymentMethod from "./order-payment-method";

export default class Order extends DS.Model {
  @DS.attr("number", { defaultValue: 0 }) total!: number;
  @DS.attr("number", { defaultValue: 0 }) quantity!: number;
  @DS.attr("number", { defaultValue: 0 }) amountPaid!: number;
  @DS.attr("number", { defaultValue: 0 }) balance!: number;
  @DS.attr("number", { defaultValue: 0 }) discount!: number;
  @DS.attr("boolean") marketingOptIn!: boolean;
  @DS.attr("string") name!: string;
  @DS.attr("string") emailAddress!: string;
  @DS.attr("string") phoneNumber!: string;
  @DS.attr("string") mobileNumber!: string;
  @DS.attr() metadata!: any;
  @DS.attr("string") billingAddress1!: string;
  @DS.attr("string") billingAddress2!: string;
  @DS.attr("string") billingCity!: string;
  @DS.attr("string") billingRegion!: string;
  @DS.attr("string") billingPostcode!: string;
  @DS.attr("string") billingCountry!: string;
  @DS.attr("string") shippingAddress1!: string;
  @DS.attr("string") shippingAddress2!: string;
  @DS.attr("string") shippingCity!: string;
  @DS.attr("string") shippingRegion!: string;
  @DS.attr("string") shippingPostcode!: string;
  @DS.attr("string") shippingCountry!: string;
  @DS.belongsTo("basket") basket!: Basket;
  @DS.hasMany("order-payment-method")
  orderPaymentMethods!: OrderPaymentMethod[];
  @DS.hasMany("payment") payments!: Payment[];
  @DS.hasMany("order-line") orderLines!: OrderLine[];
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    order: Order;
  }
}
