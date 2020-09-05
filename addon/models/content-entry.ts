import DS from "ember-data";

export default class ContentEntry extends DS.Model {
  @DS.attr("string") name!: string;
  @DS.attr("string") slug!: string;
  @DS.attr("date") insertedAt!: date;
  @DS.attr("date") createdAt!: date;
  @DS.attr("boolean") isArchived!: boolean;
  @DS.attr("boolean") isDeleted!: boolean;
  @DS.attr("boolean") isPublished!: boolean;
  @DS.attr("boolean") isHidden!: boolean;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "content-entry": ContentEntry;
  }
}