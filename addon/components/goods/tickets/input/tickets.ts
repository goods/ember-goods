import Component from '@glimmer/component';
import { action } from '@ember/object';
import Product from 'ember-goods/models/product';
import { query } from 'ember-data-resources';
import { TicketTypeOption } from './visitor';
import { TicketOption } from './ticket';
import { isEmpty, isNone } from '@ember/utils';

export type SelectionMode = 'single' | 'multiple';

interface GoodsTicketsInputTicketsArgs {
  selected: TicketOption[];
  productIdentifiers: string[];
  mode: SelectionMode;
  defaultSelectedTypes: TicketTypeOption[];
  canEditTicketTypes: boolean;
  ticketDetailsComponent: string;
  onSelect: (options: TicketOption[]) => void;
  onIncrementType: (
    ticketOption: TicketOption,
    ticketTypeOption: TicketTypeOption
  ) => void;
  onDecrementType: (
    ticketOption: TicketOption,
    ticketTypeOption: TicketTypeOption
  ) => void;
}

export default class GoodsTicketsInputTickets extends Component<GoodsTicketsInputTicketsArgs> {
  /**
   *
   */
  get mode(): SelectionMode {
    return this.args.mode ?? 'single';
  }

  /**
   *
   */
  get canEditTicketTypes(): boolean {
    return this.args.canEditTicketTypes ?? false;
  }

  /**
   *
   */
  get isLoading(): boolean {
    return this.productsData.isLoading;
  }

  /**
   * Get the product ids
   */
  get productIds(): string[] {
    return this.products.map((product: Product) => product.get('id'));
  }

  /**
   *
   */
  get selectedIds(): string[] {
    return this.args.selected.map((option: TicketOption) =>
      option.product.get('id')
    );
  }

  /**
   *
   */
  get products(): (Product | undefined)[] {
    let products: Product[] = [];
    let unsortedProducts = this.productsData.records?.toArray() ?? [];

    if (isEmpty(unsortedProducts)) {
      return products;
    }

    return this.args.productIdentifiers
      .map((productIdentifier: string) => {
        return unsortedProducts.find(
          (product) => product.get('slug') == productIdentifier
        );
      })
      .filter((product: Product) => !isNone(product));
  }

  /**
   * Loads the products
   */
  productsData = query<Product>(this, 'product', () => {
    return {
      filter: {
        slug: this.args.productIdentifiers,
      },
      include: 'brand',
    };
  });

  /**
   *
   * @param product
   */
  @action
  onSelect(option: TicketOption): void {
    if (this.mode == 'single') {
      this.args.onSelect([option]);
    }

    if (this.mode == 'multiple') {
      let updated = this.args.selected;
      if (this.selectedIds.includes(option.product.get('id'))) {
        updated = this.args.selected.filter(
          (selectedOption: TicketOption) =>
            selectedOption.product.get('id') != option.product.get('id')
        );
      } else {
        updated.push(option);
      }

      this.args.onSelect(updated);
    }
  }
}
