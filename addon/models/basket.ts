import DS from "ember-data";
import BasketItem from "./basket-item";

export default class Basket extends DS.Model {
  @DS.attr("number") total!: number;
  @DS.attr("number") discount!: number;
  @DS.attr("number") balance!: number;
  @DS.attr("number") quantity!: number;
  @DS.hasMany("basket-item") basketItems!: BasketItem[];
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    basket: Basket;
  }
}
