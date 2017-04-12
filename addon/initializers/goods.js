import GoodsAdapter from '../adapters/goods';
import GoodsSerializer from '../serializers/goods';

export function initialize( application ) {
  let config = application.get( 'goods' );
  GoodsAdapter.reopen({
    headers: {
      'Accept': 'application/vnd.api+json',
      'content-type': 'application/vnd.api+json;',
      'Authorization': 'Bearer ' + config.access_token
    }
  });
  application.register('adapter:application', GoodsAdapter);
  application.register('serializer:application', GoodsSerializer);
}

export default {
  name: 'goods',
  initialize
};