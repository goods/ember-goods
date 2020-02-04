import DS from "ember-data";

export default class User extends DS.Model {
  @DS.attr("string") email!: string;
  @DS.attr("string") password!: string;
  @DS.attr("string") firstName!: string;
  @DS.attr("string") lastName!: string;
  @DS.attr("string") status!: string;
  @DS.attr("string") shopRoleId!: string;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    user: User;
  }
}
