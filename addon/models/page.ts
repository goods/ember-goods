import DS from "ember-data";
import PageTemplate from "./page-template";

export default class Page extends DS.Model {
  @DS.attr("string") declare name: string;
  @DS.attr("string") declare url: string;
  @DS.belongsTo("page-template") declare template: PageTemplate;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    page: Page;
  }
}
