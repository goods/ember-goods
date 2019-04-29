import Model from "ember-data/model";
import { attr } from "@ember-decorators/data";

export default class User extends Model {
  @attr("string")
  email!: string;

  @attr("string")
  password!: string;

  @attr("string")
  firstName!: string;

  @attr("string")
  lastName!: string;

  @attr("string")
  status!: string;

  @attr("string")
  shopRoleId!: string;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    user: User;
  }
}
