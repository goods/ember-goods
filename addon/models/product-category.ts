import DS from "ember-data";
import Product from "./product";
import Category from "./category";

export default class ProductCategory extends DS.Model {
  @DS.belongsTo("product") product: Product;
  @DS.belongsTo("category") category: Category;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "product-category": ProductCategory;
  }
}
