import DS from "ember-data";
import ProductCategory from "./product-category";

export default class Category extends DS.Model {
  @DS.attr("string") name!: string;
  @DS.attr("boolean") isMaster!: boolean;
  @DS.hasMany("product-category") productCategories!: ProductCategory[];
  @DS.hasMany("category", { inverse: "parentCategory" })
  subCategories!: Category[];
  @DS.belongsTo("category", { inverse: "subCategories" })
  parentCategory!: Category;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    category: Category;
  }
}
