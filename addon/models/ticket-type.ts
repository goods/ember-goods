import DS from 'ember-data';

const DEFAULT_MAX = 9999;
const DEFAULT_MIN = 0;

export default class TicketType extends DS.Model {
  @DS.attr('string') declare name: string;
  @DS.attr('string') declare slug: string;
  @DS.attr('string') declare summary: string;
  @DS.attr('number', { defaultValue: DEFAULT_MAX }) declare maxQuantity: number;
  @DS.attr('number', { defaultValue: DEFAULT_MIN }) declare minQuantity: number;
  @DS.attr() declare attrs: any;
  @DS.hasMany('ticket-group', { async: false }) declare ticketGroups: any;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'ticket-type': TicketType;
  }
}
