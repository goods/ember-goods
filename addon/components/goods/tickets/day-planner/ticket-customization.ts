import Component from '@glimmer/component';
import { TicketOption } from '../input/ticket';
import { Moment } from 'moment';
import { TicketTypeOption } from '../input/visitor';

interface GoodsTicketsDayPlannerTicketCustomizationArgs {
  ticket: TicketOption;
  entryTickets: TicketOption[];
  date: Moment;
  selectedSession: any;
  onSelectSession: (ticketOption: TicketOption, session: any) => void;
}

export default class GoodsTicketsDayPlannerTicketCustomization extends Component<GoodsTicketsDayPlannerTicketCustomizationArgs> {
  /**
   *
   */
  get showMetadata(): boolean {
    return this.args.ticket.ticketTypeOptions
      .filter((option: TicketTypeOption) => option.quantity > 0)
      .any(
        (option: TicketTypeOption) => Object.keys(option.metadata).length != 0
      );
  }

  /**
   *
   */
  get rangeStartTime(): string {
    let entryTime = this.args.entryTickets
      .map((ticket: TicketOption) => {
        return (
          ticket.product.attrs.experienceEntryTime ??
          ticket.product.attrs.entryTime ??
          '00:00:00'
        );
      })
      .reduce((a: string, b: string) => {
        if (a > b) {
          return a;
        }
        return b;
      }, '00:00:00');
    return entryTime;
  }
}
