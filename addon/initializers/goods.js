import GoodsAdapter from "../adapters/goods";
import GoodsSerializer from "../serializers/goods";
import GoodsService from "../services/goods";
import BasketService from "../services/basket";
import ProductService from "../services/product";
import SkuService from "../services/sku";

export function initialize(application) {
  let config = application.get("goods");
  GoodsAdapter.reopen({
    headers: {
      Accept: "application/vnd.api+json",
      "content-type": "application/vnd.api+json;",
      Authorization: "Bearer " + config.access_token
    },
    host: config.host
  });
  application.register("adapter:application", GoodsAdapter);
  application.register("serializer:application", GoodsSerializer);

  application.register("adapter:basket-item", GoodsAdapter);
  application.register("adapter:basket", GoodsAdapter);
  application.register("adapter:brand", GoodsAdapter);
  application.register("adapter:category", GoodsAdapter);
  application.register("adapter:country", GoodsAdapter);
  application.register("adapter:order-line", GoodsAdapter);
  application.register("adapter:order-payment-method", GoodsAdapter);
  application.register("adapter:order", GoodsAdapter);
  application.register("adapter:payment-method", GoodsAdapter);
  application.register("adapter:payment", GoodsAdapter);
  application.register("adapter:product-category", GoodsAdapter);
  application.register("adapter:product-field", GoodsAdapter);
  application.register("adapter:product-image", GoodsAdapter);
  application.register("adapter:product", GoodsAdapter);
  application.register("adapter:promotion", GoodsAdapter);
  application.register("adapter:shop-payment-method", GoodsAdapter);
  application.register("adapter:sku-field", GoodsAdapter);
  application.register("adapter:sku-image", GoodsAdapter);
  application.register("adapter:sku", GoodsAdapter);
  application.register("adapter:state", GoodsAdapter);

  application.register("service:goods", GoodsService);
  application.register("service:basket", BasketService);
  application.register("service:product", ProductService);
  application.register("service:sku", SkuService);
}

export default {
  name: "goods",
  initialize
};
