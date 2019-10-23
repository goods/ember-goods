import Model from "ember-data/model";
import { attr } from "@ember-decorators/data";

export default class ContentEntryOperation extends Model {
  @attr("string") action!: string;
  @attr() operationData!: any;
  @attr("string") result!: string;
  @attr("string") status!: string;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "content-entry-operation": ContentEntryOperation;
  }
}
