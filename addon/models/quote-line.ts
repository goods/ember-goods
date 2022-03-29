import DS from "ember-data";
import Price from "./price";
import Quote from "./quote";
import Sku from "./sku";

export default class QuoteLine extends DS.Model {
  @DS.attr() declare params: any;
  @DS.attr("number") declare quantity: number;
  @DS.attr("number") declare priceAmount: number;
  @DS.attr("string") declare priceFormatted: string;
  @DS.belongsTo("price") declare price: Price;
  @DS.belongsTo("sku") declare sku: Sku;
  @DS.belongsTo("quote") declare quote: Quote;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "quote-line": QuoteLine;
  }
}
