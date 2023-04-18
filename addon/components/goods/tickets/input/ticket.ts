import Component from '@glimmer/component';
import Product from 'ember-goods/models/product';
import { tracked } from '@glimmer/tracking';
import { isEmpty } from '@ember/utils';
import { TicketTypeOption } from './visitor';
import { SelectionMode } from './tickets';
import { query } from 'ember-data-resources';
import { inject } from '@ember/service';
import TicketType from 'ember-goods/models/ticket-type';
import GoodsTickets from 'ember-goods/services/goods-tickets';

export interface TicketOption {
  product: Product;
  ticketTypeOptions: TicketTypeOption[];
  session?: any;
}

interface GoodsTicketsInputTicketArgs {
  product: Product;
  mode: SelectionMode;
  canEditTicketTypes: boolean;
  selected: TicketOption;
  defaultSelectedTypes: TicketTypeOption[];
  selectedTypes: TicketTypeOption[];
  ticketDetailsComponent: string;
  isSelected: boolean;
  onSelect: (ticketOption: TicketOption) => void;
  onIncrementType: (
    ticketOption: TicketOption,
    ticketTypeOption: TicketTypeOption
  ) => void;
}

export default class GoodsTicketsInputTicket extends Component<GoodsTicketsInputTicketArgs> {
  /**
   *
   */
  @inject('goods-tickets') declare tickets: GoodsTickets;

  /**
   *
   */
  @tracked isShowingDetails: boolean = false;

  /**
   *
   */
  get isLoadingTicketTypes(): boolean {
    return this.ticketTypesData.isLoading;
  }

  /**
   *
   */
  get mode(): SelectionMode {
    return this.args.mode ?? 'single';
  }

  /**
   *
   */
  get totalTicketTypes(): number {
    return this.ticketOption.ticketTypeOptions.reduce((total, ticketType) => {
      return total + ticketType.quantity;
    }, 0);
  }

  /**
   *
   */
  get ticketTypes(): TicketType[] {
    return this.ticketTypesData.records?.toArray() ?? [];
  }

  /**
   *
   */
  get ticketOption(): TicketOption {
    let options = this.ticketTypes.map((ticketType) => {
      return this.tickets.createTicketTypeOption(ticketType);
    });

    //Map the default selection to the ticket types and set the quantities
    if (!isEmpty(this.args.defaultSelectedTypes)) {
      let variantFieldMapStringified =
        this.args.product.get('attrs').variantFieldMap;
      let variantFieldMap = JSON.parse(variantFieldMapStringified);

      options = this.args.defaultSelectedTypes.reduce(
        (
          ticketTypeOptions: TicketTypeOption[],
          selectedType: TicketTypeOption
        ) => {
          let match = variantFieldMap.findBy('src', selectedType.name);
          if (match) {
            let existing = ticketTypeOptions.find(
              (ticketTypeOption) => ticketTypeOption.name == match.dest
            );
            if (existing) {
              existing.quantity += selectedType.quantity;
            }
          }

          return ticketTypeOptions;
        },
        options
      );
    }

    //Limit to the initial quantities
    options.forEach((option) => {
      option.max = option.quantity;
    });

    //Override with the set quantities
    options = options.map((option) => {
      let match = this.args.selectedTypes.find(
        (selectedType) => selectedType.name == option.name
      );
      if (match) {
        option.quantity = match.quantity;
      }

      //Resync metadata
      this.tickets.syncMetadata(option);

      return option;
    });

    return {
      product: this.args.product,
      ticketTypeOptions: options,
      session: null,
    };
  }

  /**
   * Loads the ticket types
   */
  ticketTypesData = query<TicketType>(this, 'ticket-type', () => {
    return {
      filter: {
        id: this.args.product.get('attrs').ticketTypes.join(','),
      },
      include: 'metadata.fields',
    };
  });
}
