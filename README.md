# storybook-filepath-chapters

[![npm package](https://badge.fury.io/js/storybook-filepath-chapters.svg)](https://badge.fury.io/js/storybook-filepath-chapters)
[![Live demo](https://img.shields.io/badge/Live%20Demo-%20Storybook-brightgreen.svg)](https://hadfieldn.github.io/storybook-filepath-chapters/)

A simple loader for [React Storybook](https://getstorybook.io/) that uses
[storybook-chapters](https://github.com/sm-react/storybook-chapters) to
create a hierarchical navigation tree that mirrors your component filesystem.

[Demo](https://hadfieldn.github.io/storybook-filepath-chapters/)

![filesystem screenshot](assets/files.png)

![screenshot](assets/demo.gif)

## Installation
```sh
npm add --save-dev storybook-filepath-chapters
```

## Configuration

```js
// stories.js

import { loadStorybook } from 'storybook-filepath-chapters';
const stories = require.context('../app/components', true, /.*stories((\.jsx?)|\/(index\.js|.*?stories\.jsx?))$/i);
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

The above example results in the following Storybook navigational tree:
```js
  // File system:
  // app/components/widgets/butons/_stories.js
  // app/components/widgets/labels/_stories.js

  // Storybook
  Demo components
    +--[widgets]
       |--[buttons]
       |   |-- Button1
       |   +-- Button2
       +--[labels]
           |-- Label1
           +-- Label2
```

## Options

```js
loadStorybook(rootName, requireContext, options);
```
- **rootName:** Story name to show at the root of the navigational tree.
- **requireContext:** A webpack [require context](https://github.com/webpack/docs/wiki/context)
that identifies the files to be searched for stories. (See the example above.)
- **options:** (optional) `{ wrapStories: true }` will wrap each call to `storiesOf` in a new chapter.
By default, all stories in a given folder are wrapped in a single chapter.

```js
storiesOf.skip(storyName, module)
```
Causes the story to be omitted from the navigation tree.

```js
storiesOf.dev(storyName, module)
```
Renders the story into the root navigation pane. This can be handy during development
in order to make a component immediately accessible, as storybook-chapters
does not currently retain your navigation selection when the page is refreshed.


### Special Thanks
to [Oleg Proskurin](https://github.com/UsulPro) for a [brilliant solution](https://github.com/sm-react/storybook-chapters) for enabling
hierarchical navigation in React Storybook.
