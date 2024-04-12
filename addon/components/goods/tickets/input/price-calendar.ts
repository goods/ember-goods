/* eslint-disable ember/no-side-effects */
import Component from '@glimmer/component';
import { isNone, isEmpty } from '@ember/utils';
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

export interface TicketPackage {
  ticketOptions: TicketOption[];
  startTime?: string;
  confirmationHeading?: string;
  confirmationMessage?: string;
  cssClasses?: string[];
  keyLabel?: string;
}

type CalendarKeyType = 'price-bands' | 'packages';

interface GoodsTicketsInputPriceCalendarArgs {
  packages: TicketPackage[];
  selectedTickets: TicketOption[];
  calendarKeyType: CalendarKeyType;
  startDate: Moment;
  finishDate: Moment;
  onSelect: (date: Date) => void;
}

export default class GoodsTicketsInputPriceCalendar extends Component<GoodsTicketsInputPriceCalendarArgs> {
  /**
   * The store service
   */
  @inject declare store: Store;

  /**
   * The goods service
   */
  @inject declare goods: Goods;

  /**
   *
   */
  @tracked calendarCenter: moment.Moment = this.args.startDate;

  /**
   *
   */
  @tracked isShowingConfirmation: boolean = false;

  /**
   *
   */
  @tracked selectedDay: any = null;

  /**
   *
   */
  get isLoading() {
    return this.packageSkusData.any((dataList: any) =>
      dataList.any((data: any) => data.isLoading)
    );
  }

  /**
   * Default key type
   */
  get calendarKeyType(): CalendarKeyType {
    return this.args.calendarKeyType ?? 'price-bands';
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
    let keys: any = [];
    if (this.calendarKeyType == 'price-bands') {
      keys = this.priceBands.map((priceBand) => {
        return {
          label: capitalize(priceBand),
          cssClass:
            'price-band-' + dasherize(priceBand.replace(',', '').toLowerCase()),
        };
      });
    } else if (this.calendarKeyType == 'packages') {
      keys = this.args.packages
        .filter((ticketPackage: TicketPackage) => {
          return !isNone(ticketPackage.keyLabel);
        })
        .map((ticketPackage: TicketPackage) => {
          return {
            label: ticketPackage.keyLabel,
            cssClass: ticketPackage.cssClasses
              ?.map((cssClass) => 'package-' + cssClass)
              .join(' '),
          };
        });
    }

    return keys;
  }

  /**
   * The SKUS data for the package
   */
  #packageSkusCalendarCenter: Moment = moment().utc();
  #packageSkusData: any = { isLoading: true, value: [] };
  get packageSkusData() {
    let calendarCenter = moment(this.calendarCenter);

    if (!calendarCenter.isSame(this.#packageSkusCalendarCenter)) {
      this.#packageSkusCalendarCenter = moment(this.calendarCenter);
      let startDate = this.calendarCenter.clone().startOf('month');
      let finishDate = this.calendarCenter.clone().endOf('month');

      let packageSkusData = this.args.packages.map(
        (ticketPackage: TicketPackage) => {
          return ticketPackage.ticketOptions.map((ticketOption) => {
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
          });
        }
      );

      this.#packageSkusData = packageSkusData;
    }

    return this.#packageSkusData;
  }

  /**
   * Reduce the entire list of packages and data in a list of loaded SKUs.
   * This can then be traversed later on to group the SKUs into day availability.
   */
  get skus(): Sku[] {
    if (this.isLoading) {
      return [];
    }

    return this.packageSkusData.reduce((acc: any, data: any) => {
      return data.reduce((acc: any, data: any) => {
        return acc.concat(data.value.toArray());
      }, acc);
    }, []);
  }

  /**
   *
   */
  get days(): any[] {
    let groups = this.goods.tickets.groupByDayAndProduct(this.skus);

    let days = groups.map((group: any) => {
      let date = moment.utc(group.date);

      let packageCapacities = this.args.packages.map(
        (ticketPackage: TicketPackage) => {
          let price = 0;
          let hasCapacity = ticketPackage.ticketOptions.every(
            (ticketOption: TicketOption) => {
              let productGroup = group.products.findBy(
                'product.id',
                ticketOption.product.get('id')
              );
              if (isNone(productGroup)) {
                return false;
              }

              return this.goods.tickets.hasCapacity(
                productGroup,
                ticketOption.ticketTypeOptions,
                ticketPackage.startTime
              );
            }
          );

          price = ticketPackage.ticketOptions.reduce(
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

          return {
            ticketPackage,
            hasCapacity,
            price,
          };
        }
      );

      let packageCapacity = packageCapacities.find(
        (packageCapacity) => packageCapacity.hasCapacity == true
      );

      let price = 0;
      let cssClasses = [];
      let status = 'available';

      if (isNone(packageCapacity)) {
        status = 'unavailable';
      } else {
        price = packageCapacity.price;
        cssClasses.push(
          packageCapacity.ticketPackage.cssClasses
            ?.map((cssClass) => 'package-' + cssClass)
            .join(' ')
        );

        if (this.calendarKeyType == 'price-bands' && !isNone(group.priceBand)) {
          cssClasses.push(
            'price-band-' +
              dasherize(group.priceBand.replace(',', '').toLowerCase())
          );
        }
      }

      return {
        date: date,
        skus: group.skus,
        cssClasses: cssClasses.join(' '),
        ticketPackage: packageCapacity?.ticketPackage,
        price,
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

  /**
   *
   * @param day
   */
  @action
  onSelect(day: any) {
    this.selectedDay = day;
    if (!isEmpty(day.metadata.ticketPackage.confirmationMessage)) {
      this.isShowingConfirmation = true;
    } else {
      this.args.onSelect(day);
    }
  }
}
