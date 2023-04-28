/* eslint-disable ember/no-side-effects */
import Component from '@glimmer/component';
import { TicketOption } from '../input/ticket';
import { Moment } from 'moment';
import { load } from 'ember-goods/helpers/load';
import { inject } from '@ember/service';
import Store from '@ember-data/store';
import { isNone } from '@ember/utils';
import { action, get } from '@ember/object';
import GoodsCommerce from 'ember-goods/services/goods-commerce';
import Sku from 'ember-goods/models/sku';

interface GoodsTicketsDayPlannerSummaryArgs {
  selectedEntryTickets: TicketOption[];
  selectedExperienceTickets: TicketOption[];
  selectedDate: Moment;
  isAddingToBasket: boolean;
  onAddToBasket: (selection: any) => void;
}

export default class GoodsTicketsDayPlannerSummary extends Component<GoodsTicketsDayPlannerSummaryArgs> {
  /**
   *
   */
  @inject declare store: Store;

  /**
   *
   */
  @inject('goods-commerce') declare commerce: GoodsCommerce;

  /**
   *
   */
  get isLoading(): boolean {
    return this.isLoadingEntrySkus || this.isLoadingExperienceSkus;
  }

  /**
   *
   */
  get isLoadingEntrySkus(): boolean {
    return this.entrySkusData.any((skusData: any) => skusData.data.isLoading);
  }

  /**
   *
   */
  get isLoadingExperienceSkus(): boolean {
    return this.experienceSkusData.any(
      (skusData: any) => skusData.data.isLoading
    );
  }

  /**
   *
   */
  get isAddingToBasket(): boolean {
    return this.args.isAddingToBasket ?? false;
  }

  /**
   * Entry SKUs data
   */
  #entryQueriesStr: string = '';
  #entrySelectedDate: Moment | null = null;
  #entrySkusData: any = [];
  get entrySkusData() {
    let queries = this.args.selectedEntryTickets.map(
      (ticketOption: TicketOption) => {
        let query = {
          filter: {
            product_id: ticketOption.product.get('id'),
            query: [
              [
                'bookable-date',
                'is_same',
                this.args.selectedDate.format('YYYY-MM-DDTHH:mm:ss\\Z'),
              ],
            ],
          },
          include: 'price',
        };

        return query;
      }
    );

    if (
      !this.args.selectedDate.isSame(this.#entrySelectedDate) ||
      JSON.stringify(queries) != this.#entryQueriesStr
    ) {
      this.#entrySelectedDate = this.args.selectedDate;
      this.#entryQueriesStr = JSON.stringify(queries);

      let entrySkusData = queries.map((query: any) => {
        let ticketOption = this.args.selectedEntryTickets.find(
          (ticket: TicketOption) =>
            ticket.product.get('id') == query.filter.product_id
        );
        return {
          ticketOption: ticketOption,
          data: load(this.store.query('sku', query)),
        };
      });

      this.#entrySkusData = entrySkusData;
    }

    return this.#entrySkusData;
  }

  /**
   * Experience SKUs data
   */
  #experienceQueriesStr: string = '';
  #experienceSelectedDate: Moment | null = null;
  #experienceSkusData: any = [];
  get experienceSkusData() {
    let queries = this.args.selectedExperienceTickets.map(
      (ticketOption: TicketOption) => {
        let conditions = [
          [
            'bookable-date',
            'is_same',
            this.args.selectedDate.format('YYYY-MM-DDTHH:mm:ss\\Z'),
          ],
        ];

        if (!isNone(get(ticketOption, 'session'))) {
          conditions.push([
            'session-start-time',
            'is_time_same',
            get(ticketOption, 'session.startTime'),
          ]);
          conditions.push([
            'session-finish-time',
            'is_time_same',
            get(ticketOption, 'session.finishTime'),
          ]);
        }

        let query = {
          filter: {
            product_id: ticketOption.product.get('id'),
            query: conditions,
          },
          include: 'price',
        };

        return query;
      }
    );

    if (
      !this.args.selectedDate.isSame(this.#experienceSelectedDate) ||
      JSON.stringify(queries) != this.#experienceQueriesStr
    ) {
      this.#experienceSelectedDate = this.args.selectedDate;
      this.#experienceQueriesStr = JSON.stringify(queries);

      let experienceSkusData = queries.map((query: any) => {
        let ticketOption = this.args.selectedExperienceTickets.find(
          (ticket: TicketOption) =>
            ticket.product.get('id') == query.filter.product_id
        );
        return {
          ticketOption: ticketOption,
          data: load(this.store.query('sku', query)),
        };
      });

      this.#experienceSkusData = experienceSkusData;
    }

    return this.#experienceSkusData;
  }

  /**
   *
   */
  get canAddToBasket(): boolean {
    if (this.isLoading) {
      return false;
    }
    return this.args.selectedExperienceTickets.every(
      (ticketOption: TicketOption) => {
        return !isNone(get(ticketOption, 'session'));
      }
    );
  }

  /**
   *
   */
  get basketLines(): any[] {
    let basketLines = this.entrySkusData
      .concat(this.experienceSkusData)
      .reduce((basketLines: any[], skusData: any) => {
        let lines = skusData.ticketOption.ticketTypeOptions
          .filter((option: any) => option.quantity > 0)
          .map((option: any) => {
            let template = skusData.ticketOption.product.get('skuName');
            let sku = skusData.data.value.find((sku: Sku) => {
              return (
                this.commerce.getSkuName(sku.get('attrs'), template) ==
                option.name
              );
            });

            return {
              sku,
              quantity: option.quantity,
              metadata: option.metadata,
            };
          });
        return basketLines.concat(lines);
      }, []);

    return basketLines;
  }

  /**
   *
   */
  get totalPrice(): number {
    return this.basketLines.reduce((total: number, line: any) => {
      return total + line.sku.get('price').get('value') * line.quantity;
    }, 0);
  }

  /**
   *
   */
  @action
  onAddToBasket() {
    this.args.onAddToBasket(this.basketLines);
  }
}
