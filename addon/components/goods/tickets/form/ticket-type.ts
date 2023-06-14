/* eslint-disable ember/no-get */
import Component from '@glimmer/component';
import { action, set, get } from '@ember/object';
import { isNone } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { query } from 'ember-data-resources';
import { inject } from '@ember/service';
import moment from 'moment';
import TimeslotOption from 'ember-goods/models/timeslot-option';
import TicketType from 'ember-goods/models/ticket-type';

export interface TicketGroupSelection {
  [ticketGroupId: string]: number;
}

export interface Selection {
  ticketGroups: TicketGroupSelection;
  day?: TimeslotOption | null;
  timeslot?: TimeslotOption | null;
}

type SelectionKey = 'visitors' | 'day';

interface GoodsTicketsFormTicketTypeArgs {
  ticketTypeData: any;
}

export default class GoodsTicketsFormTicketType extends Component<GoodsTicketsFormTicketTypeArgs> {
  /**
   *
   */
  @inject declare goods: any;

  /**
   *
   */
  @tracked selection: Selection = {
    ticketGroups: {},
    day: null,
    timeslot: null,
  };

  /**
   *
   */
  @tracked isShowingDatepicker: boolean = false;

  /**
   *
   */
  @tracked calendarCenter: any = moment();

  /**
   *
   */
  get isLoading(): boolean {
    return (
      this.args.ticketTypeData.hasRan == false ||
      this.args.ticketTypeData.isLoading
    );
  }

  /**
   *
   */
  get ticketType(): TicketType {
    return this.args.ticketTypeData.records.get('firstObject');
  }

  /**
   * Iterate through the ticket group quantities object abnd return if any have greater than zero
   */
  get hasTicketGroupSelection(): boolean {
    return Object.values(this.selection.ticketGroups).some(
      (quantity) => quantity > 0
    );
  }

  /**
   *
   */
  get isInvalid(): boolean {
    return (
      this.hasTicketGroupSelection == false ||
      isNone(get(this.selection, 'day')) ||
      isNone(get(this.selection, 'timeslot'))
    );
  }

  /**
   *
   */
  get isValid(): boolean {
    return !this.isInvalid;
  }

  /**
   *
   */
  get selectionQuantity(): number {
    return Object.values(this.selection.ticketGroups).reduce(
      (total, quantity) => total + quantity,
      0
    );
  }

  /**
   *
   */
  get canIncrement(): boolean {
    return this.selectionQuantity < this.ticketType.get('maxQuantity');
  }

  /**
   *
   */
  get canDecrement(): boolean {
    return this.selectionQuantity > this.ticketType.get('minQuantity');
  }

  /**
   *
   */
  timeslotsData = query(this, 'timeslot-option', () => ({
    ...this.timeslotsQuery,
  }));

  get timeslotsQuery(): any {
    let day = get(this.selection, 'day');
    let startDate = moment(day.start).format('YYYY-MM-DDTHH:mm:ss\\Z');
    let finishDate = moment(day.finish).format('YYYY-MM-DDTHH:mm:ss\\Z');

    return {
      filter: {
        start_time: startDate,
        finish_time: finishDate,
        selection: this.selection.ticketGroups,
      },
      include: 'ticket_lines.ticket.sku',
    };
  }

  /**
   *
   */
  daysData = query(this, 'timeslot-option', () => ({ ...this.daysQuery }));

  get daysQuery(): any {
    let startDate = moment().utc().format('YYYY-MM-DDTHH:mm:ss\\Z');

    let finishDate = moment()
      .utc()
      .add(7, 'day')
      .format('YYYY-MM-DDTHH:mm:ss\\Z');

    return {
      filter: {
        aggregate: 'day',
        start_time: startDate,
        finish_time: finishDate,
        selection: this.selection.ticketGroups,
      },
    };
  }

  /**
   *
   */
  monthDaysData = query(this, 'timeslot-option', () => ({
    ...this.monthDaysQuery,
  }));

  get monthDaysQuery(): any {
    let startDate = this.calendarCenter
      .clone()
      .startOf('month')
      .format('YYYY-MM-DDTHH:mm:ss\\Z');
    let finishDate = this.calendarCenter
      .clone()
      .endOf('month')
      .format('YYYY-MM-DDTHH:mm:ss\\Z');

    return {
      filter: {
        aggregate: 'day',
        start_time: startDate,
        finish_time: finishDate,
        selection: this.selection.ticketGroups,
      },
    };
  }

  /**
   *
   */
  get totalPrice(): number {
    if (this.isInvalid) {
      return 0;
    }
    return get(this.selection, 'timeslot.price');
  }

  /**
   *
   */
  get showTimeslotsField(): boolean {
    let day = get(this.selection, 'day');
    if (isNone(day)) {
      return false;
    }

    if (isNone(this.timeslotsData.records)) {
      return false;
    }

    return this.timeslotsData.records.get('length') > 1;
  }

  /**
   *
   */
  get isAddingToBasket(): boolean {
    return this.addToBasketTask.isRunning;
  }

  /**
   *
   */
  @action
  onAddToBasket() {
    this.addToBasketTask.perform(this.goods, this.selection);
  }

  @action
  onUpdateTicketGroupSelection(ticketGroup: any, quantity: number) {
    const updatedTicketGroups = {
      ...this.selection.ticketGroups,
      [ticketGroup.get('id')]: quantity,
    };

    this.selection = {
      ...this.selection,
      ticketGroups: updatedTicketGroups,
    };
  }

  /**
   *
   * @param key
   * @param value
   */
  @action
  onUpdateSelection(key: SelectionKey, value: any) {
    set(this.selection, key, value);
    this.isShowingDatepicker = false;

    //Check there is enough stock for the selected date. If not, deselect it. Get
    //the session with the most available stock for the day
    // if (!isNone(this.selection.day)) {
    //   let maxQuantity = this.selection.day.skus.reduce((maxQuantity, sku) => {
    //     if (maxQuantity < sku.get('stockQuantity')) {
    //       return sku.get('stockQuantity');
    //     }
    //     return maxQuantity;
    //   }, 0);

    //   if (maxQuantity < this.selectionQuantity) {
    //     setProperties(this.selection, { day: null, session: null });
    //   }
    // }

    // Check there is enough stock for the selected session. If not, deselect it
    if (
      !isNone(this.selection.timeslot) &&
      this.selection.timeslot.stockQuantity < this.selectionQuantity
    ) {
      set(this.selection, 'timeslot', null);
    }
  }
  /**
   *
   * @param goods
   * @param selection
   * @returns
   */
  addToBasketTask = task(async (goods: any, selection: Selection) => {
    if (isNone(selection.timeslot)) {
      return;
    }

    await goods.tickets.addToBasket(selection.timeslot.get('ticketLines'));
    // router.transitionTo('basket');
  });

  /**
   *
   */
  setupSelectionTask = task(async () => {
    await this.args.ticketTypeData;
    let ticketType = this.args.ticketTypeData.records.get('firstObject');
    let quantities: any = {};

    ticketType.get('ticketGroups').forEach((ticketGroup: any) => {
      quantities[ticketGroup.id] = 0;
    });
    this.selection = { ticketGroups: quantities };
  });

  /**
   *
   * @param owner
   * @param args
   */
  constructor(owner: any, args: GoodsTicketsFormTicketTypeArgs) {
    super(owner, args);

    this.setupSelectionTask.perform();
  }
}
