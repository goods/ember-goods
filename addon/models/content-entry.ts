import DS from "ember-data";

export default class ContentEntry extends DS.Model {
  @DS.attr("string") declare name: string;
  @DS.attr("string") declare slug: string;
  @DS.attr("date") declare insertedAt: Date;
  @DS.attr("date") declare createdAt: Date;
  @DS.attr("boolean") declare isArchived: boolean;
  //@ts-ignore
  @DS.attr("boolean") declare isDeleted: boolean;
  @DS.attr("boolean") declare isPublished: boolean;
  @DS.attr("boolean") declare isHidden: boolean;

  /**
   * Indicates that this is a content entry schema. Used by the adapter to
   * customize the endpoint.
   */
  static isContentEntry: boolean = true;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "content-entry": ContentEntry;
  }
}
