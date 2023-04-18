import Component from '@glimmer/component';
import { action, set } from '@ember/object';

interface GoodsTicketsInputVariantMetadataFieldArgs {
  field: any;
  item: any;
}

export default class GoodsTicketsInputVariantMetadataField extends Component<GoodsTicketsInputVariantMetadataFieldArgs> {
  /**
   *
   */
  get options(): string[] {
    return this.args.field.get('options').split(/\r?\n/);
  }
}
