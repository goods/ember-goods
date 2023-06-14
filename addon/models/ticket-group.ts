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

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'ticket-group': TicketGroup;
  }
}
