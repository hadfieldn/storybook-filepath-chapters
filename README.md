# storybook-filepath-chapters

A simple loader for [React Storybook](https://getstorybook.io/) that creates
a hierarchical navigation tree that mirrors your filesystem.

[Demo](/docs/index.html)

![screenshot](assets/demo.gif)

## Installation
```sh
npm add --save-dev storybook-filepath-chapters
```

## Configuration

```js
// stories.js

import { loadStorybook } from 'storybook-filepath-chapters';
const stories = require.context('../app/components', true, /.*stories((\.js)|\/(index\.js|.*?stories\.js))$/i);
loadStorybook('Demo Components', stories);
```

**IMPORTANT**: In your stories, import `storiesOf` from `storybook-filepath-chapters` instead
of `@kadira/storybook`:

```jsx
// app/components/widgets/buttons/_stories.js

import React from 'react';
import { storiesOf } from 'storybook-filepath-chapters';

storiesOf('Buttons', module)
  .add('Button1', () => <button>Button 1</button>)
  .add('Button2', () => <button>Button 2</button>)
;
```

```jsx
// app/components/widgets/labels/_stories.js

import React from 'react';
import { storiesOf } from 'storybook-filepath-chapters';

storiesOf('Labels', module)
  .add('Label1', () => <h1>Label 1</h1>)
  .add('Label2', () => <h2>Label 2</h2>)
;
```

## Options

```js
loadStorybook(*rootName*, *requireContext*, *options*);
```
- *rootName*: Story name to show at the root of the navigational tree.
- *requireContext*: A webpack [require context](https://github.com/webpack/docs/wiki/context)
that identifies the files to be searched for stories. (See the example above.)
- *options*: `{ wrapStories: true }` -- will wrap each call to `storiesOf` in a new chapter.
By default, all stories in a given folder are wrapped in a single chapter.

```js
storiesOf.skip(*storyName*, *module*)
```
Causes the story to be skipped from the navigation tree.

```js
storiesOf.dev(*storyName*, *module*)
```
Renders the story in the root navigation view. This can be handy during development to make
a component immediately accessible.
```
