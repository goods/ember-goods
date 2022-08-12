import DS from 'ember-data';
import BasketItem from './basket-item';
import BasketRuleValidation from './basket-rule-validation';

export default class Basket extends DS.Model {
  @DS.attr('number') total!: number;
  @DS.attr('number') discount!: number;
  @DS.attr('number') balance!: number;
  @DS.attr('number') quantity!: number;
  @DS.attr('number') shopId!: number;
  @DS.attr('string') sessionId!: number;
  @DS.attr() metadata!: any;
  @DS.hasMany('basket-item') basketItems!: BasketItem[];
  @DS.hasMany('basket-rule-validation')
  ruleValidations!: BasketRuleValidation[];
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    basket: Basket;
  }
}
