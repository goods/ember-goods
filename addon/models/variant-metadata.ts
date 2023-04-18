import { attr, hasMany, belongsTo } from '@ember-data/model';
import ContentEntry from './content-entry';
import TicketType from './ticket-type';
import VariantMetadataField from './variant-metadata-field';

export default class VariantMetadata extends ContentEntry {
  @attr('string') declare root: string;
  @attr('string') declare itemName: string;
  @attr('string') declare instructions: string;
  @belongsTo('ticket-type', { async: false }) declare ticketType: TicketType;
  @hasMany('variant-metadata-field', { async: false })
  declare fields: VariantMetadataField[];
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'variant-metadata': VariantMetadata;
  }
}
