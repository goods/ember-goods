import DS from "ember-data";
import Product from "./product";

export default class ProductImage extends DS.Model {
  @DS.attr("string") filename!: string;
  @DS.attr("string") originalUrl!: string;
  @DS.attr("string") thumbUrl!: string;
  @DS.attr("string") thumbLargeUrl!: string;
  @DS.belongsTo("product") product!: Product;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "product-image": ProductImage;
  }
}
