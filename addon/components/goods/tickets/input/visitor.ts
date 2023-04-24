import Component from '@glimmer/component';
import { action, get } from '@ember/object';
import { isNone } from '@ember/utils';
import TicketType from 'ember-goods/models/ticket-type';

export interface TicketTypeOption {
  ticketType: TicketType;
  name: string;
  price?: string;
  priceLabel?: string;
  description?: string;
  quantity: number;
  max?: number;
  min?: number;
  metadata?: any;
}

interface GoodsTicketsInputVisitorArgs {
  ticketTypeOption: TicketTypeOption;
  canIncrement: (ticketTypeOption: TicketTypeOption) => boolean;
  canDecrement: (ticketTypeOption: TicketTypeOption) => boolean;
  onIncrement: (ticketTypeOption: TicketTypeOption) => void;
  onDecrement: (ticketTypeOption: TicketTypeOption) => void;
}

export default class GoodsTicketsInputVisitor extends Component<GoodsTicketsInputVisitorArgs> {
  /**
   *
   */
  get canIncrement(): boolean {
    if (this.args.canIncrement(this.args.ticketTypeOption) == false) {
      return false;
    }

    if (!isNone(this.args.ticketTypeOption.max)) {
      return (
        get(this.args.ticketTypeOption, 'quantity') + 1 <=
        this.args.ticketTypeOption.max
      );
    }

    return true;
  }

  /**
   *
   */
  get canDecrement(): boolean {
    if (this.args.canDecrement(this.args.ticketTypeOption) == false) {
      return false;
    }
    return (
      get(this.args.ticketTypeOption, 'quantity') - 1 >=
      this.args.ticketTypeOption.min
    );
  }

  /**
   *
   */
  get cannotIncrement(): boolean {
    return !this.canIncrement;
  }

  /**
   *
   */
  get cannotDecrement(): boolean {
    return !this.canDecrement;
  }

  /**
   *
   * @param ticketTypeOption
   * @returns
   */
  @action
  onIncrement(ticketTypeOption: TicketTypeOption): void {
    if (this.canIncrement == false) {
      return;
    }
    this.args.onIncrement(ticketTypeOption);
  }

  /**
   *
   * @param ticketTypeOption
   * @returns
   */
  @action
  onDecrement(ticketTypeOption: TicketTypeOption): void {
    if (this.canDecrement == false) {
      return;
    }
    this.args.onDecrement(ticketTypeOption);
  }
}
