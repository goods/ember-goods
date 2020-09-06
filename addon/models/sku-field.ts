import DS from "ember-data";
import Sku from "./sku";

export default class SkuField extends DS.Model {
  @DS.attr("string") name!: string;
  @DS.attr("string") slug!: string;
  @DS.attr() values!: any;
  @DS.belongsTo("sku") sku!: Sku;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "sku-field": SkuField;
  }
}
