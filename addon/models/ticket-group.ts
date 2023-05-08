import DS from 'ember-data';
import TicketType from './ticket-type';

const DEFAULT_MAX = 9999;
const DEFAULT_MIN = 0;

export default class TicketGroup extends DS.Model {
  @DS.attr('string') declare name: string;
  @DS.attr('string') declare description: string;
  @DS.attr('string') declare priceLabel: string;
  @DS.attr('number', { defaultValue: DEFAULT_MAX }) declare maxQuantity: number;
  @DS.attr('number', { defaultValue: DEFAULT_MIN }) declare minQuantity: number;
  @DS.belongsTo('ticket-type', { async: false }) declare ticketType: TicketType;
}

// import { attr, belongsTo } from '@ember-data/model';
// import ContentEntry from './content-entry';
// import DayPlanner from './day-planner';
// import Product from './product';
// import VariantMetadata from './variant-metadata';

// export default class TicketType extends ContentEntry {
//   @attr('string') declare price: string;
//   @attr('string') declare priceLabel: string;
//   @attr('number', { defaultValue: 32 }) declare max: number;
//   @attr('number', { defaultValue: 0 }) declare min: number;
//   @belongsTo('variant-metadata', { async: false })
//   declare metadata: VariantMetadata;
//   @belongsTo('product', { async: false }) declare product: Product;
//   @belongsTo('day-planner', { async: false }) declare dayPlanner: DayPlanner;
// }

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'ticket-group': TicketGroup;
  }
}
