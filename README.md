# ember-goods

This addon provides an adapter to use with the Goods platform (https://www.goods.co.uk).

## Compatibility

- Ember.js v2.18 or above
- Ember CLI v2.13 or above

## Installation

```
ember install ember-goods
```

## Configuration

```js
// environment.js

ENV.APP.goods = {
  accessToken: "xxxxxx"
};
```

### Configuration Parameters

- `accessToken`: Generate this access token in your Goods account and add it here.
  Create a shop, then go to Settings > Access tokens.
  Your `content group` name in Goods must match the Ember model name.
  The `content entry` field reference is the dasherized name of the Ember model field.

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

- `npm run lint:hbs`
- `npm run lint:js`
- `npm run lint:js -- --fix`
- `ember test` – Runs the test suite on the current Ember version
- `ember test --server` – Runs the test suite in "watch mode"
- `ember try:each` – Runs the test suite against multiple Ember versions

```js
// models/spaceship.js

import DS from "ember-data";
import ContentEntry from "ember-goods/models/content-entry";

export default ContentEntry.extend({
  colour: DS.attr(),
  block: DS.attr(),
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

- `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
- `ember test`
- `ember test --server`

## Building

- `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
