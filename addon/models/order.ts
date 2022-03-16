import DS from "ember-data";
import Basket from "./basket";
import Payment from "./payment";
import OrderLine from "./order-line";
import OrderPaymentMethod from "./order-payment-method";

export default class Order extends DS.Model {
  @DS.attr("string") declare uuid: string;
  @DS.attr("string") declare sessionId: string;
  @DS.attr("number", { defaultValue: 0 }) declare total: number;
  @DS.attr("number", { defaultValue: 0 }) declare quantity: number;
  @DS.attr("number", { defaultValue: 0 }) declare amountPaid: number;
  @DS.attr("number", { defaultValue: 0 }) declare balance: number;
  @DS.attr("number", { defaultValue: 0 }) declare discount: number;
  @DS.attr("boolean") declare marketingOptIn: boolean;
  @DS.attr("string") declare name: string;
  @DS.attr("string") declare emailAddress: string;
  @DS.attr("string") declare emailConfirmation: string;
  @DS.attr("string") declare phoneNumber: string;
  @DS.attr("string") declare mobileNumber: string;
  @DS.attr() declare metadata: any;
  @DS.attr("string") declare billingAddress1: string;
  @DS.attr("string") declare billingAddress2: string;
  @DS.attr("string") declare billingCity: string;
  @DS.attr("string") declare billingRegion: string;
  @DS.attr("string") declare billingPostcode: string;
  @DS.attr("string") declare billingCountry: string;
  @DS.attr("string") declare shippingAddress1: string;
  @DS.attr("string") declare shippingAddress2: string;
  @DS.attr("string") declare shippingCity: string;
  @DS.attr("string") declare shippingRegion: string;
  @DS.attr("string") declare shippingPostcode: string;
  @DS.attr("string") declare shippingCountry: string;
  @DS.attr("number") declare shopId: number;
  @DS.belongsTo("basket") declare basket: Basket;
  @DS.hasMany("order-payment-method")
  declare orderPaymentMethods: OrderPaymentMethod[];
  @DS.hasMany("payment") declare payments: Payment[];
  @DS.hasMany("order-line") declare orderLines: OrderLine[];
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    order: Order;
  }
}
