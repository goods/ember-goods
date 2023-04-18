import Component from '@glimmer/component';
import { isNone } from '@ember/utils';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import { dasherize, capitalize } from '@ember/string';
import { Store } from '@ember-data/store';
import { tracked } from '@glimmer/tracking';
import moment, { Moment } from 'moment';
import { load } from 'ember-goods/helpers/load';
import { TicketOption } from './ticket';
import Goods from 'ember-goods/services/goods';
import Sku from 'ember-goods/models/sku';

interface GoodsTicketsInputPriceCalendarArgs {
  selectedTickets: TicketOption[];
  startDate: Moment;
  finishDate: Moment;
  onSelect: (date: Date) => void;
}

export default class GoodsTicketsInputPriceCalendar extends Component<GoodsTicketsInputPriceCalendarArgs> {
  @inject declare store: Store;
  @inject declare goods: Goods;

  /**
   *
   */
  @tracked calendarCenter: moment.Moment = this.args.startDate;

  /**
   *
   */
  get isLoading() {
    return this.skusData.any((data: any) => data.isLoading);
  }

  get hasPriceBand(): boolean {
    return this.skus.any((sku: Sku) => {
      return 'priceBand' in sku.get('attrs');
    });
  }

  get priceBands(): string[] {
    if (this.hasPriceBand == false) {
      return [];
    }

    return this.days
      .map((day) => day.priceBand)
      .uniq()
      .compact();
  }

  get calendarKeys(): any[] {
    let keys = this.priceBands.map((priceBand) => {
      return {
        label: capitalize(priceBand),
        cssClass: dasherize(priceBand.replace(',', '').toLowerCase()),
      };
    });

    return keys;
  }

  /**
   * The calendar SKUs data
   */
  #skusCalendarCenter: Moment = moment().utc();
  #skusData: any = { isLoading: true, value: [] };
  get skusData() {
    let calendarCenter = moment(this.calendarCenter);

    if (!calendarCenter.isSame(this.#skusCalendarCenter)) {
      this.#skusCalendarCenter = moment(this.calendarCenter);
      let startDate = this.calendarCenter.clone().startOf('month');
      let finishDate = this.calendarCenter.clone().endOf('month');

      let skusData = this.args.selectedTickets.map(
        (ticketOption: TicketOption) => {
          let query = [
            [
              'bookable-date',
              'is_same_or_after',
              startDate.format('YYYY-MM-DDTHH:mm:ss\\Z'),
            ],
            [
              'bookable-date',
              'is_same_or_before',
              finishDate.format('YYYY-MM-DDTHH:mm:ss\\Z'),
            ],
          ];

          return load(
            this.store.query('sku', {
              filter: {
                product_id: ticketOption.product.get('id'),
                query,
              },
              page: {
                offset: 0,
                limit: 10000,
              },
              include: 'price',
            })
          );
        }
      );

      this.#skusData = skusData;
    }

    return this.#skusData;
  }

  /**
   *
   */
  get skus(): Sku[] {
    if (this.isLoading) {
      return [];
    }

    return this.skusData.reduce((acc: any, data: any) => {
      return acc.concat(data.value.toArray());
    }, []);
  }

  /**
   *
   */
  get days(): any[] {
    let groups = this.goods.tickets.groupByDayAndProduct(this.skus);

    let days = groups.map((group: any) => {
      let date = moment.utc(group.date);
      let status = 'available';
      let isSelected = false;
      let price = 0;
      // if (!isNone(this.args.selection)) {
      //   isSelected = date.isSame(this.args.selection.date, 'day');
      // }

      let hasCapacity = this.args.selectedTickets.every(
        (ticketOption: TicketOption) => {
          let productGroup = group.products.findBy(
            'product.id',
            ticketOption.product.get('id')
          );
          if (isNone(productGroup)) {
            return false;
          }
          return this.goods.tickets.hasCapacity(
            productGroup.skus,
            ticketOption.ticketTypeOptions
          );
        }
      );

      if (hasCapacity == false) {
        status = 'unavailable';
      }

      price = this.args.selectedTickets.reduce(
        (price: number, ticketOption: TicketOption) => {
          let productGroup = group.products.findBy(
            'product.id',
            ticketOption.product.get('id')
          );
          if (isNone(productGroup)) {
            return 0;
          }

          return (
            price +
            this.goods.tickets.getPrice(
              productGroup.skus,
              ticketOption.ticketTypeOptions
            )
          );
        },
        0
      );

      let priceBand = null;
      if (!isNone(group.priceBand) && status != 'unavailable') {
        priceBand = dasherize(group.priceBand.replace(',', '').toLowerCase());
      }

      return {
        date: date,
        skus: group.skus,
        priceBand,
        price,
        isSelected,
        status,
      };
    });
    return days;
  }

  /**
   *
   * @param date
   */
  @action
  onChangeCenter(date: Moment) {
    if (
      date.isBefore(this.args.startDate, 'day') ||
      date.isAfter(this.args.finishDate, 'day')
    ) {
      return;
    }
    this.calendarCenter = date;
  }
}
