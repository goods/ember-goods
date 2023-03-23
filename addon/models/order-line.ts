import DS from 'ember-data';
import Order from './order';
import Sku from './sku';
import Promotion from './promotion';

export default class OrderLine extends DS.Model {
  @DS.attr('number') quantity!: number;
  @DS.attr('number') price!: number;
  @DS.attr('boolean') isHidden!: boolean;
  @DS.attr() metadata!: any;
  @DS.belongsTo('order') order!: Order;
  @DS.belongsTo('sku') sku!: Sku;
  @DS.belongsTo('promotion', { async: false }) promotion!: Promotion;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'order-line': OrderLine;
  }
}
