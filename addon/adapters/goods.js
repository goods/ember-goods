import Ember from 'ember';
import JSONAPIAdapter from 'ember-data/adapters/json-api';

export default JSONAPIAdapter.extend({

  coalesceFindRequests: true,

  host: '',
  
  pathForType() {
    return 'entries';
  },

  /**
   @override
   */
  findAll(store, type, sinceToken) {
    let modelName = type.modelName;

    let query = {
      content_group: Ember.String.camelize(modelName)
    };

    const url = this.buildURL(modelName, null, null, 'findAll');

    if (sinceToken) {
      query.since = sinceToken;
    }

    if (this.sortQueryParams) {
      query = this.sortQueryParams(query);
    }

    return this.ajax(url, 'GET', {data: {filter: query}});
  },

  // /**
  //  @override
  //  */
  query(store, type, query) {

    let modelName = type.modelName;

    query.filter = Ember.$.extend(query.filter, {
      'content_group': Ember.String.camelize(modelName)
    });

    if (this.sortQueryParams) {
      query = this.sortQueryParams(query);
    }

    let url = this.buildURL(modelName, null, null, 'query', query);

    return this.ajax(url, 'GET', {data: query});
  },

  /**
   @override
   * */
  queryRecord() {
    throw new Ember.Error("You may not call 'queryRecord' on a store. Use 'query'.");
  },
  /**
   @override
   */
  findMany: null,

  /**
   @override
   */
  findHasMany: null,

  /**
   @override
   */
  findBelongsTo: null,

  /**
   @override
   */
  updateRecord() {
    throw new Ember.Error("You may not call 'updateRecord' on a store.");
  },

  /**
   @override
   * */
  deleteRecord() {
    throw new Ember.Error("You may not call 'deleteRecord' on a store.");
  },


});