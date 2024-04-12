import Component from '@glimmer/component';
import { action, get } from '@ember/object';
import { TicketTypeOption } from './visitor';

const DEFAULT_MAX_QUANTITY = 32;
const DEFAULT_MIN_QUANTITY = 0;

interface GoodsTicketsInputVisitorsArgs {
  options: TicketTypeOption[];
  maxQuantity: number;
  minQuantity: number;
  onIncrement: (ticketTypeOption: TicketTypeOption[]) => void;
  onDecrement: (ticketTypeOption: TicketTypeOption[]) => void;
}

export default class GoodsTicketsInputVisitors extends Component<GoodsTicketsInputVisitorsArgs> {
  /**
   * Total quantity selected
   */
  get totalQuantity(): number {
    return this.args.options
      .filter(
        (ticketTypeOption: TicketTypeOption) => ticketTypeOption.isFree != true
      )
      .reduce(
        (total: number, ticketTypeOption: TicketTypeOption) =>
          total + get(ticketTypeOption, 'quantity'),
        0
      );
  }

  /**
   *
   */
  get maxQuantity(): number {
    return this.args.maxQuantity ?? DEFAULT_MAX_QUANTITY;
  }

  /**
   *
   */
  get minQuantity(): number {
    return this.args.minQuantity ?? DEFAULT_MIN_QUANTITY;
  }

  /**
   *
   * @returns
   */
  @action
  canIncrement(): boolean {
    return this.totalQuantity + 1 <= this.maxQuantity;
  }

  /**
   *
   * @returns
   */
  @action
  canDecrement(): boolean {
    return true;
  }
}
