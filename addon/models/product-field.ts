import DS from "ember-data";
import Product from "./product";

export default class ProductField extends DS.Model {
  @DS.attr("string") name!: string;
  @DS.attr("string") slug!: string;
  @DS.attr() values!: any;
  @DS.belongsTo("product") product!: Product;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "product-field": ProductField;
  }
}
