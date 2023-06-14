import DS from 'ember-data';

export default class TimeslotOption extends DS.Model {
  @DS.attr('string') declare aggregate: 'day' | 'time';
  @DS.attr('date') declare start: Date;
  @DS.attr('date') declare finish: Date;
  @DS.attr('string') declare price: string;
  @DS.attr() declare selection: any;
  @DS.attr('string') declare status: 'available' | 'unavailable' | 'sold-out';
  @DS.hasMany('ticket-line', { async: false }) declare ticketLines: any;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'timeslot-option': TimeslotOption;
  }
}
