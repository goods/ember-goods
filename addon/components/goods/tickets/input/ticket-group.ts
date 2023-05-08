import Component from '@glimmer/component';
import { action } from '@ember/object';
import TicketGroup from 'ember-goods/models/ticket-group';

const DEFAULT_MAX = 9999;

interface GoodsTicketsInputTicketGroupArgs {
  ticketGroup: TicketGroup;
  quantity: number;
  canIncrement?: () => void;
  canDecrement?: () => void;
  onUpdate: (quantity: number) => void;
}

/**
 * Simple `TicketGroup` input component.
 *
 * @param ticketGroup The `TicketGroup` record
 * @param quantity The selected quantity
 * @param canIncrement Can the quantity be incremented?
 * @param canDecrement Can the quantity be decremented?
 * @param onUpdate Function that updates the quantity with the new value
 *
 */
export default class GoodsTicketsInputTicketGroup extends Component<GoodsTicketsInputTicketGroupArgs> {
  /**
   * The max quantity limit for this `TicketGroup`
   */
  get maxQuantity(): number {
    return this.args.ticketGroup.get('maxQuantity') ?? DEFAULT_MAX;
  }

  /**
   * The min quantity limit for this `TicketGroup`
   */
  get minQuantity(): number {
    return this.args.ticketGroup.get('minQuantity') ?? 0;
  }

  /**
   * Can the quantity be incremented?
   */
  get canIncrement(): boolean {
    let canIncrement = this.args.canIncrement ?? true;
    return canIncrement && this.args.quantity + 1 <= this.maxQuantity;
  }

  /**
   * Can the quantity be decremented?
   */
  get canDecrement(): boolean {
    let canDecrement = this.args.canDecrement ?? true;
    return canDecrement && this.args.quantity - 1 >= this.minQuantity;
  }

  /**
   * Inverse of canIncrement
   */
  get cannotIncrement(): boolean {
    return !this.canIncrement;
  }

  /**
   * Inverse of canDecrement
   */
  get cannotDecrement(): boolean {
    return !this.canDecrement;
  }

  /**
   * Action that handles incrementing the quantity.
   *
   * @returns void
   */
  @action
  onIncrement(): void {
    if (this.canIncrement == false) {
      return;
    }
    this.args.onUpdate(this.args.quantity + 1);
  }

  /**
   * Action handles decrementing the quantity
   *
   * @returns void
   */
  @action
  onDecrement(): void {
    if (this.canDecrement == false) {
      return;
    }
    this.args.onUpdate(this.args.quantity - 1);
  }
}
