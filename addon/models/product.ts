import DS from "ember-data";
import { computed, get } from "@ember/object";
import Brand from "./brand";
import Sku from "./sku";
import ProductField from "./product-field";
import ProductImage from "./product-image";
import ProductCategory from "./product-category";
import FieldSchema from "./field-schema";

export default class Product extends DS.Model {
  @DS.attr("string") name!: string;
  @DS.attr("string") summary!: string;
  @DS.attr("string") description!: string;
  @DS.attr("string") slug!: string;
  @DS.belongsTo("brand") brand!: Brand;
  @DS.hasMany("sku") skus!: Sku[];
  @DS.hasMany("product-field") productFields!: ProductField[];
  @DS.hasMany("product-image") productImages!: ProductImage[];
  @DS.hasMany("product-category") productCategories!: ProductCategory[];
  @DS.hasMany("field-schema") schema!: FieldSchema[];
  @DS.hasMany("field-schema") skuSchema!: FieldSchema[];

  @computed("productFields.[]")
  get attributes(): any {
    return this.productFields.reduce((hash: any, attribute: any) => {
      hash[get(attribute, "slug")] = get(attribute, "values");
      return hash;
    }, {});
  }
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    product: Product;
  }
}
