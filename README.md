# ember-goods

This addon provides an adapter to use with the Goods platform (https://www.goods.co.uk).


## Installation

```
ember install ember-goods
```

## Configuration


```js
// environment.js

ENV.APP.goods = {
    access_token: 'xxxxxx',
}
```

### Configuration Parameters

* `access_token`: Generate this access token in your Goods account and add it here.
Create a shop, then go to Settings > Access tokens.
Your Content group name in Goods must match the Ember model name. 
The Content entry field reference is the dasherized name of the Ember model field. 


## Usage

### Models
All models that use a Goods content entry should inherit the `content-entry` model. This contains default fields such as:

```js
name: DS.attr(),
slug: DS.attr(),
insertedAt : DS.attr('date'),
createdAt : DS.attr('date'),
isArchived: DS.attr('boolean'),
isDeleted: DS.belongsTo('boolean'),
isPublished: DS.belongsTo('boolean'),
isHidden: DS.belongsTo('boolean')
```

Example model:

```js
// models/spaceship.js

import DS from 'ember-data';
import ContentEntry from 'ember-goods/models/content-entry';

export default ContentEntry.extend({
  colour: DS.attr(),
  block: DS.attr('string'),
  massToLowEarthOrbit: DS.attr()
});
```


Example Goods content group:

```js
Content group name: Spaceship

Content fields:
name: colour
reference: colour
type: Short text

name: block
reference: block
type: Options dropdown

name:Mass to LEO (Low Earth Orbit)
reference:mass-to-low-earth-orbit
type: Number
```

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
