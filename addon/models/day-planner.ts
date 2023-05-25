import { attr, hasMany } from '@ember-data/model';
import ContentEntry from './content-entry';
import TicketType from './ticket-type';

export const DEFAULT_MAX_QUANTITY = 32;
export const DEFAULT_MIN_QUANTITY = 1;

export default class DayPlanner extends ContentEntry {
  @attr('string') declare introduction: string;
  @attr('number', { defaultValue: DEFAULT_MAX_QUANTITY })
  declare maxQuantity: number;
  @attr('number', { defaultValue: DEFAULT_MIN_QUANTITY })
  declare minQuantity: number;
  @attr('string') declare entryTicketIdentifiers: string;
  @attr('string') declare experienceIdentifiers: string;
  @hasMany('ticket-type') declare ticketTypes: TicketType[];
  @attr('string') declare ticketTypesHeading: string;
  @attr('string') declare entryTicketsHeading: string;
  @attr('string') declare entryTicketsIntroduction: string;
  @attr('string') declare experienceTicketsHeading: string;
  @attr('string') declare experienceTicketsIntroduction: string;
  @attr('string') declare priceCalendarHeading: string;
  @attr('string') declare priceCalendarIntroduction: string;
  @attr('string') declare priceCalendarStart: string;
  @attr('string') declare priceCalendarFinish: string;
  @attr('string') declare entireSelectionCalendarKeyLabel: string;
  @attr('string') declare onlyEntryTicketsCalendarKeyLabel: string;
  @attr('string') declare onlyEntryTicketsConfirmationHeading: string;
  @attr('string') declare onlyEntryTicketsConfirmationMessage: string;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'day-planner': DayPlanner;
  }
}
