import { attr, belongsTo } from '@ember-data/model';
import ContentEntry from './content-entry';
import DayPlanner from './day-planner';
import Product from './product';
import VariantMetadata from './variant-metadata';

export default class TicketType extends ContentEntry {
  @attr('string') declare price: string;
  @attr('string') declare priceLabel: string;
  @attr('number', { defaultValue: 32 }) declare max: number;
  @attr('number', { defaultValue: 0 }) declare min: number;
  @attr('boolean', { defaultValue: false }) declare isFree: boolean;
  @belongsTo('variant-metadata', { async: false })
  declare metadata: VariantMetadata;
  @belongsTo('product', { async: false }) declare product: Product;
  @belongsTo('day-planner', { async: false }) declare dayPlanner: DayPlanner;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'ticket-type': TicketType;
  }
}
