/* eslint-disable ember/no-get */
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
//@ts-ignore
import { TrackedObject } from 'tracked-built-ins';
import { action, get, set } from '@ember/object';
import DayPlanner from 'ember-goods/models/day-planner';
import { TicketTypeOption } from './input/visitor';
import { Moment } from 'moment';
import TicketType from 'ember-goods/models/ticket-type';
import { TicketOption } from './input/ticket';
import GoodsTickets from 'ember-goods/services/goods-tickets';
import { inject } from '@ember/service';
import { isNone } from '@ember/utils';
import { TicketPackage } from './input/price-calendar';
import { generateCombinations, listToString } from 'ember-goods/utils/utils';

interface GoodsTicketsDayPlannerArgs {
  dayPlanner: DayPlanner;
  ticketDetailsComponent: string;
  errors: any[];
  isAddingToBasket: boolean;
  onAddToBasket: (basketLines: any) => void;
}

enum SelectionState {
  Visitors = 'visitors',
  Tickets = 'tickets',
  Date = 'date',
  Customization = 'customization',
}

interface Selection {
  ticketTypeOptions: TicketTypeOption[];
  entryTickets: TicketOption[];
  experienceTickets: TicketOption[];
  date: Moment | null;
}

/**
 * Day planner component
 *
 *
 * @class GoodsTicketsDayPlanner
 *
 * @argument {DayPlanner} dayPlanner
 *
 * @example
 *
 * <GoodsTicketsDayPlanner @dayPlanner={{this.dayPlanner}} />
 *
 */
export default class GoodsTicketsDayPlanner extends Component<GoodsTicketsDayPlannerArgs> {
  @inject('goods-tickets') declare tickets: GoodsTickets;
  /**
   * A tracked object that represents the current selection and tracks changes
   * to the selection across the day planner states.
   */
  selection: Selection = new TrackedObject<Selection>({
    ticketTypeOptions: [],
    date: null,
    entryTickets: [],
    experienceTickets: [],
  });

  /**
   * Selection state.
   */
  @tracked selectionState: SelectionState = SelectionState.Visitors;

  get hasOutOfStockError(): boolean {
    return this.args.errors.any(
      (error: any) => error.title == 'Insufficient stock'
    );
  }

  /**
   *
   */
  get ticketTypeOptions(): TicketTypeOption[] {
    if (this.args.dayPlanner == null) {
      return [];
    }

    return this.args.dayPlanner
      .get('ticketTypes')
      .map((ticketType: TicketType) => {
        let ticketTypeOption = {
          name: ticketType.get('name'),
          priceLabel: ticketType.get('price'),
          max: ticketType.get('max') ?? 32,
          min: ticketType.get('min') ?? 0,
          quantity: 0,
        };

        let selected = this.selection.ticketTypeOptions.find(
          (selectedOption: TicketTypeOption) =>
            selectedOption.name === ticketTypeOption.name
        );
        if (selected) {
          ticketTypeOption.quantity = selected.quantity;
        }
        return ticketTypeOption;
      });
  }

  /**
   * Can move to the tickets selection state?
   */
  get canMoveToTickets(): boolean {
    return this.totalTicketTypeQuantity >= this.minQuantity;
  }

  /**
   * Can move to the date selection state?
   */
  get canMoveToDate(): boolean {
    return this.selection.entryTickets.length > 0;
  }

  /**
   * Total quantity selected
   */
  get totalTicketTypeQuantity(): number {
    return this.selection.ticketTypeOptions.reduce(
      (total: number, ticketTypeOption: TicketTypeOption) =>
        total + ticketTypeOption.quantity,
      0
    );
  }

  /**
   *
   */
  get selectedTickets(): TicketOption[] {
    return get(this, 'selection.entryTickets').concat(
      get(this, 'selection.experienceTickets')
    );
  }

  /**
   *
   */
  get entryTime(): string {
    return get(this, 'selection.entryTickets')
      .mapBy('product.attrs.entryTime')
      .reduce((a: string, b: string) => {
        if (a > b) {
          return a;
        }
        return b;
      }, '00:00:00');
  }

  /**
   *
   */
  get ticketPackages(): TicketPackage[] {
    let ticketPackages: any = [];
    let entryTickets: any = get(this, 'selection.entryTickets');
    let experienceTickets: any = get(this, 'selection.experienceTickets');
    let selectionCount = entryTickets.length + experienceTickets.length;

    let combos = generateCombinations(experienceTickets, entryTickets);

    ticketPackages = combos
      .map((ticketOptions: any, index: number) => {
        let onlyEntryTicketsAvailable =
          entryTickets.length == ticketOptions.length;
        let allTicketsAvailable = selectionCount == ticketOptions.length;

        let unavailableTicketNames = experienceTickets
          .filter((ticket: any) => !ticketOptions.includes(ticket))
          .map(
            (ticket: any) =>
              ticket.product.get('attrs.shortName') ||
              ticket.product.get('name')
          );
        let unavailableString = listToString(unavailableTicketNames);

        let packageId = `ticket-package-${index}`;
        let order = index;
        if (onlyEntryTicketsAvailable) {
          packageId = 'entry-tickets';
          order = combos.length;
        }
        if (allTicketsAvailable) {
          packageId = 'all-tickets';
          order = -1;
        }

        let ticketPackage: any = {
          ticketOptions,
          id: packageId,
          order,
          startTime: this.entryTime,
          cssClasses: [packageId],
        };

        if (allTicketsAvailable) {
          ticketPackage.keyLabel = 'Available';
        } else {
          ticketPackage.keyLabel = unavailableString + ' sold out';
          ticketPackage.confirmationHeading =
            'Some of the chosen experiences are not available for this date.';
          ticketPackage.confirmationMessage = `Are you sure want to continue? This will remove the ${unavailableString} from your purchase.`;
        }

        return ticketPackage;
      })
      .sort((a: any, b: any) => a.order - b.order);

    return ticketPackages;
  }

  /**
   * Maximum quantity
   */
  get maxQuantity(): number {
    return this.args.dayPlanner.get('maxQuantity') ?? 32;
  }

  /**
   * Minimum quantity
   */
  get minQuantity(): number {
    return this.args.dayPlanner.get('minQuantity') ?? 1;
  }

  /**
   * Get the entry ticket identifiers
   * @returns {string[]}
   * @private
   * @memberof GoodsTicketsDayPlanner
   */
  get entryTicketIdentifiers(): string[] {
    return this.args.dayPlanner
      .get('entryTicketIdentifiers')
      .replace(' ', '')
      .split(',');
  }

  /**
   * Get the experience ticket identifiers
   * @returns {string[]}
   * @private
   * @memberof GoodsTicketsDayPlanner
   */
  get experienceIdentifiers(): string[] {
    return this.args.dayPlanner
      .get('experienceIdentifiers')
      .replace(' ', '')
      .split(',');
  }

  /**
   *
   */
  get showSummary(): boolean {
    return this.selectionState == SelectionState.Customization;
  }

  get totalPrice(): number {
    return 0;
  }

  /**
   *
   */
  @action
  onRestart() {
    this.selectionState = SelectionState.Visitors;
    set(this.selection, 'entryTickets', []);
    set(this.selection, 'experienceTickets', []);
    set(this.selection, 'date', null);
  }

  /**
   *
   * @param ticketTypeOption
   */
  @action
  onIncrementTicketOptionType(
    ticketOption: TicketOption,
    ticketTypeOption: TicketTypeOption
  ): void {
    let ticketOptionIndex = this.selection.experienceTickets.findIndex(
      (selectedOption) =>
        selectedOption.product.get('id') == ticketOption.product.get('id')
    );
    if (ticketOptionIndex != -1) {
      let ticketOption: TicketOption =
        this.selection.experienceTickets[ticketOptionIndex];

      let ticketTypeOptions = ticketOption.ticketTypeOptions;
      let index = ticketTypeOptions.findIndex(
        (selectedOption) => selectedOption.name == ticketTypeOption.name
      );

      if (index != -1) {
        set(ticketTypeOption, 'quantity', ticketTypeOption.quantity + 1);
      }

      //Resync metadata
      this.tickets.syncMetadata(ticketTypeOption);

      this.selection.experienceTickets[ticketOptionIndex].ticketTypeOptions[
        index
      ] = ticketTypeOption;
    }
  }
  /**
   *
   * @param ticketTypeOption
   */
  @action
  onDecrementTicketOptionType(
    ticketOption: TicketOption,
    ticketTypeOption: TicketTypeOption
  ): void {
    let ticketOptionIndex = this.selection.experienceTickets.findIndex(
      (selectedOption) =>
        selectedOption.product.get('id') == ticketOption.product.get('id')
    );
    if (ticketOptionIndex != -1) {
      let ticketOption: TicketOption =
        this.selection.experienceTickets[ticketOptionIndex];

      let ticketTypeOptions = ticketOption.ticketTypeOptions;
      let index = ticketTypeOptions.findIndex(
        (selectedOption) => selectedOption.name == ticketTypeOption.name
      );

      if (index != -1) {
        set(ticketTypeOption, 'quantity', ticketTypeOption.quantity - 1);
      }

      //Resync metadata
      this.tickets.syncMetadata(ticketTypeOption);

      this.selection.experienceTickets[ticketOptionIndex].ticketTypeOptions[
        index
      ] = ticketTypeOption;
    }
  }

  /**
   *
   * @param ticketTypeOption
   */
  @action
  onIncrementTicketType(ticketTypeOption: TicketTypeOption): void {
    let ticketTypeOptions = this.selection.ticketTypeOptions;
    let index = ticketTypeOptions.findIndex(
      (selectedOption) => selectedOption.name == ticketTypeOption.name
    );

    if (index == -1) {
      ticketTypeOption.quantity = 1;
      ticketTypeOptions.push(ticketTypeOption);
    } else {
      ticketTypeOptions[index].quantity += 1;
    }
    this.selection.ticketTypeOptions = ticketTypeOptions;
  }

  /**
   *
   * @param ticketTypeOption
   */
  @action
  onDecrementTicketType(ticketTypeOption: TicketTypeOption): void {
    let ticketTypeOptions = this.selection.ticketTypeOptions;
    let index = ticketTypeOptions.findIndex(
      (selectedOption) => selectedOption.name == ticketTypeOption.name
    );

    if (index != -1) {
      ticketTypeOptions[index].quantity -= 1;
      if (ticketTypeOptions[index].quantity == 0) {
        ticketTypeOptions.splice(index, 1);
      }
    }
    this.selection.ticketTypeOptions = ticketTypeOptions;
  }

  @action
  onSelectSession(ticketOption: TicketOption, session: any): void {
    let ticketOptionIndex = this.selection.experienceTickets.findIndex(
      (selectedOption) =>
        selectedOption.product.get('id') == ticketOption.product.get('id')
    );

    if (ticketOptionIndex != -1) {
      set(ticketOption, 'session', session);
    }
  }

  /**
   *
   * @param visitors
   */
  @action
  onSelectTicketTypes(): void {
    this.selectionState = SelectionState.Tickets;
    this.scrollTo('day-planner');
  }

  /**
   *
   * @param visitors
   */
  @action
  onSelectTickets(): void {
    this.selectionState = SelectionState.Date;
    this.scrollTo('day-planner');
  }

  /**
   *
   * @param date
   */
  @action
  onSelectDate(day: any): void {
    let selectedExperienceIds =
      day.metadata.ticketPackage.ticketOptions.mapBy('product.id');

    let experienceTickets = this.selection.experienceTickets.filter(
      (ticketOption) =>
        selectedExperienceIds.includes(ticketOption.product.get('id'))
    );

    this.selection.experienceTickets = experienceTickets;

    this.selection.date = day.date;
    this.selectionState = SelectionState.Customization;
    this.scrollTo('day-planner');
  }

  /**
   *
   * @param basketLines
   */
  @action
  onAddToBasket(basketLines: any): void {
    this.args.onAddToBasket(basketLines);
  }

  /**
   *
   * @param id
   */
  scrollTo(id: string) {
    if (isNone(window)) {
      return;
    }

    let dest = window.document.getElementById(id)?.offsetTop;

    if (!isNone(dest)) {
      window.scrollTo({
        top: dest - 100,
        left: 0,
        behavior: 'smooth',
      });
    }
  }
}
