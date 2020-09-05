import DS from "ember-data";
import { computed, get } from "@ember/object";
import Price from "./price";
import Product from "./product";
import Bom from "./bom";
import SkuImage from "./sku-image";
import SkuField from "./sku-field";

export default class Sku extends DS.Model {
  @DS.attr("number") stockQuantity!: number;
  @DS.belongsTo("price") price!: Price;
  @DS.belongsTo("product") product!: Product;
  @DS.belongsTo("bom", { async: false }) bom!: Bom;
  @DS.hasMany("sku-image") skuImages: SkuImage[];
  @DS.hasMany("sku-field") skuFields: SkuField[];

  @computed("skuFields.[]")
  get attributes(): any {
    return this.skuFields.reduce((hash, attribute) => {
      hash[get(attribute, "slug")] = get(attribute, "values");
      return hash;
    }, {});
  }
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    sku: Sku;
  }
}
