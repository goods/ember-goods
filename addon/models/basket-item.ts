import DS from "ember-data";
import Basket from "./basket";
import Sku from "./sku";
import Promotion from "./promotion";
import QuoteLine from "./quote-line";

export default class BasketItem extends DS.Model {
  @DS.attr("number") quantity!: number;
  @DS.attr("number") price!: number;
  @DS.attr("boolean") isHidden!: boolean;
  @DS.attr("string") code!: string;
  @DS.attr("number") discount!: number;
  @DS.attr() metadata!: any;
  @DS.attr("number", { defaultValue: 0 }) promotionApplicationMax!: number;
  @DS.belongsTo("basket") basket!: Basket;
  @DS.belongsTo("quote-line") quoteLine!: QuoteLine;
  @DS.belongsTo("sku") sku!: Sku;
  @DS.belongsTo("promotion", { async: false }) promotion!: Promotion;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "basket-item": BasketItem;
  }
}
