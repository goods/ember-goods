import DS from "ember-data";
import Price from "./price";
import Product from "./product";
import Bom from "./bom";

export default class Sku extends DS.Model {
  @DS.attr("number") stockQuantity!: number;
  @DS.attr() attrs!: any;
  @DS.belongsTo("price") price!: Price;
  @DS.belongsTo("product") product!: Product;
  @DS.belongsTo("bom", { async: false }) bom!: Bom;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    sku: Sku;
  }
}
