import DS from "ember-data";

export default class ContentEntryOperation extends DS.Model {
  @DS.attr("string") action!: string;
  @DS.attr() operationData!: any;
  @DS.attr("string") result!: string;
  @DS.attr("string") status!: string;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "content-entry-operation": ContentEntryOperation;
  }
}
