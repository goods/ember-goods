import DS from 'ember-data';
import Ticket from './ticket';
import TimeslotOption from './timeslot-option';

export default class TicketLine extends DS.Model {
  @DS.attr('number') declare quantity: number;
  @DS.belongsTo('ticket', { async: false }) declare ticket: Ticket;
  @DS.belongsTo('timeslotOption', { async: false })
  declare timeslotOption: TimeslotOption;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'ticket-line': TicketLine;
  }
}
