import DS from "ember-data";
import Basket from "./basket";
import BasketItem from "./basket-item";
import BasketRule from "./basket-rule";

export default class BasketRuleValidation extends DS.Model {
  @DS.attr("boolean") passed!: boolean;
  @DS.belongsTo("basket-item") triggerBasketItem!: BasketItem;
  @DS.belongsTo("basket") basket!: Basket;
  @DS.belongsTo("basket-rule") rule!: BasketRule;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "basket-rule-validation": BasketRuleValidation;
  }
}
