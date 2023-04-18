import { attr, belongsTo } from '@ember-data/model';
import ContentEntry from './content-entry';
import VariantMetadata from './variant-metadata';

export default class VariantMetadataField extends ContentEntry {
  @attr('string') declare inputType: string;
  @attr('string') declare options: string;
  @belongsTo('variant-metadata', { async: false })
  declare metadata: VariantMetadata;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'variant-metadata-field': VariantMetadataField;
  }
}
