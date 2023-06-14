import DS from 'ember-data';
import TicketGroup from './ticket-group';
import Sku from './sku';

export default class Ticket extends DS.Model {
  @DS.belongsTo('ticket-group', { async: false })
  declare ticketGroup: TicketGroup;
  @DS.belongsTo('sku', { async: false }) declare sku: Sku;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    ticket: Ticket;
  }
}
