import Component from '@glimmer/component';
import Timeslot from 'ember-goods/models/timeslot-option';

interface GoodsTicketsInputTimeslotsArgs {
  selection: Timeslot;
  timeslots: Timeslot[];
  onUpdate: (timeslot: Timeslot) => void;
}

export default class GoodsTicketsInputTimeslots extends Component<GoodsTicketsInputTimeslotsArgs> {}
