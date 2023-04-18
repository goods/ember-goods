import Component from '@glimmer/component';
import Sku from 'ember-goods/models/sku';
import { query } from 'ember-data-resources';
import Goods from 'ember-goods/services/goods';
import { inject } from '@ember/service';
import { TicketOption } from './ticket';
import { Moment } from 'moment';
import { isNone } from '@ember/utils';

interface GoodsTicketsInputSessionsArgs {
  ticket: TicketOption;
  date: Moment;
  selected: any;
  rangeStartTime?: null | string;
  onSelect: (session: any) => void;
}

export default class GoodsTicketsInputSessions extends Component<GoodsTicketsInputSessionsArgs> {
  @inject declare goods: Goods;

  /**
   *
   */
  get isLoading(): boolean {
    return this.skusData.isLoading;
  }

  /**
   *
   */
  get totalQuantity(): number {
    return this.args.ticket.ticketTypeOptions.reduce((total, ticketType) => {
      return total + ticketType.quantity;
    }, 0);
  }

  /**
   *
   */
  get sessions(): any[] {
    if (this.isLoading) {
      return [];
    }

    let sessions = this.goods.tickets
      .groupBySession(this.skus)
      .filter((session: any) => {
        if (isNone(this.args.rangeStartTime)) {
          return true;
        }
        return session.startTime > this.args.rangeStartTime;
      })
      .map((session: any) => {
        let selectable = true;
        if (session.stockQuantity - this.totalQuantity < 0) {
          selectable = false;
        }

        return {
          startTime: session.startTime,
          finishTime: session.finishTime,
          stockQuantity: session.stockQuantity,
          selectable: selectable,
        };
      })
      .sortBy('startTime');
    return sessions;
  }

  /**
   *
   */
  get skus(): Sku[] {
    return this.skusData.records?.toArray() ?? [];
  }

  /**
   * Loads the skus
   */
  skusData = query<Sku>(this, 'sku', () => {
    return {
      filter: {
        product_id: this.args.ticket.product.get('id'),
        query: [
          [
            'bookable-date',
            'is_same',
            this.args.date.format('YYYY-MM-DDTHH:mm:ss\\Z'),
          ],
        ],
      },
      include: 'price',
    };
  });
}
