import { helper } from '@ember/component/helper';
import { TicketOption } from 'ember-goods/components/goods/tickets/input/ticket';

export function getTicketTypeOptions(params /*, hash*/) {
  let ticketOptions = params[0];
  let productId = params[1];

  let ticketOption = ticketOptions.find(
    (ticketOption: TicketOption) => ticketOption.product.get('id') === productId
  );

  if (ticketOption) {
    return ticketOption.ticketTypeOptions;
  }
  return [];
}

export default helper(getTicketTypeOptions);
