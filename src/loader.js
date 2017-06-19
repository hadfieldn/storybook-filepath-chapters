import { storiesOf as originalStoriesOf, configure } from '@storybook/react';
import '@storybook/addon-chapters';

/**
 * This module provides a method for loading React Storybook stories. It creates a navigational hierarchy
 * using [storybook-chapters](https://github.com/sm-react/storybook-chapters) based on the file paths to
 * the stories.
 *
 * To use it, replace all imports of `{ storiesOf } from '@kadira/storybook'` with the `storiesOf` function
 * provided by this module.
 *
 * Some utility functions for developing stories are provided:
 *
 *   `storiesOf.skip()` can be used to prevent a story from appearing in the storybook.
 *   `storiesOf.dev()` can be used to make a story appear in the root of the storybook navigation. This is
 *     a useful workaround for a bug in storybook-chapters that prevents the currently selected story from
 *     retaining its selection after a page refresh or hot reload.
 */

let _Stories = null;
let _LastStoriesWereSkipped = false;
let _OpenedNewPathChapter = false;
let _WrapStoriesInChapters = false;

const _log = () => {}; //console.log;


/**
 * @private
 *
 * Create copies of all the decorators & add-ons in storybook that do nothing but return the original storybook
 * @param storybook
 * @returns {{}}
 */
function getStorybookMock(storybook) {
  const mock = {};
  for (const method in storybook) {
    if (typeof storybook[method] == 'function') {
      mock[method] = new Function(String(method), 'return this;');
    }
  }
  return mock;
}

/**
 * @private
 *
 * close chapters for each path component from startIdx forward
 * @param {object} storybook
 * @param {array} path - an array of path components
 * @param {number} startIdx
 */
function closePathChapters(storybook, path, startIdx) {
  let book = storybook;
  let idx = path.length - 1;
  while (idx >= startIdx) {
    const pathComponent = path[idx];
    if (idx === path.length - 1 && isStoryFolderName(pathComponent)) {
      _log(`Leaving story folder ${pathComponent} -- skipping chapter closure, since noe was opened`);
    } else {
      _log(`Closing path chapter ${pathComponent} ===============`);
      book = book.endOfChapter();
    }
    --idx;
  }
  return book;
}

function getPathComponents(path) {
  // don't include the containing folder nor the file itself
  return path.split('/').slice(1, -1);
}

// Matches any name that ends in `stories` or `Stories` */
 function isStoryFolderName(name) {
  return name && name.match(/.*stories$/i);
}

/**
 * @private
 *
 * Check if `pathComponent` is a folder containing story definition files.
 *
 * Matches only if `pathComponent` is the last item of `pathComponents`.
 */
function isStoryFolder(pathComponent, pathComponents, index) {
  return pathComponent && (index === pathComponents.length - 1) && isStoryFolderName(pathComponent);
}

/**
 * @private
 *
 * Returns a loader that can be passed to Storybook's `configure` function.
 * `reqContext` is a Webpack require context, e.g.:
 *
 *   `const reqContext = require.context('../app/components', true, /.*stories((\.js)|\/(index\.js|*stories\.js))$/i);`
 *
 *  In this example, reqContext matches all files under `../app/components` with names that end in `stories.js`
 *  and all files in folders with names that end in `stories`.
 *
 * @param storybook
 * @param reqContext
 * @returns {function()}
 *
 */
function pathsIntoChaptersLoader(storybook, reqContext, options) {

  _WrapStoriesInChapters = options.wrapStories;

  let book = storybook;
  let currentPath = [];
  return () => {
    reqContext.keys().forEach((key) => {
      const pathComponents = getPathComponents(key);
      pathComponents.forEach((pathComponent, index) => {
        const prev = currentPath[index];
        if (prev !== pathComponent) {
          // we're processing a new folder
          if(isStoryFolder(pathComponent, pathComponents, index)) {
            // we entered a folder named *Stories/ or *stories/ (e.g., 'budgets/_stories/index.js')
            // -- don't show it as a chapter
          } else {
            if (prev) {
              // we changed folders, so close chapters for the previous folder and any sub-folders
              closePathChapters(book, currentPath, index);
              currentPath = currentPath.slice(0, index);    // crop the path at the new folder branch
            }
            // create the path chapter
            _log(`Path Chapter [${pathComponent}]====================`);
            book.chapter(pathComponent);
            currentPath = currentPath.concat([pathComponent]);
          }
        }
      });
      _log(`  Processing ${key}`);
      _OpenedNewPathChapter = true;
      reqContext(key);
      if (_LastStoriesWereSkipped) {
        _log('  Skipping closure of prior chapter because story was skipped');
        _LastStoriesWereSkipped = false;
      } else {
        _log(`  Closing prior chapter -----------------`);
        _WrapStoriesInChapters && book.endOfChapter();
      }
    });
    closePathChapters(book, currentPath, 0);
  };
}

/** overwrite the @kadira `storiesOf` function to wrap the story in a chapter */
const storiesOf = (name, module, options = {}) => {
  if (! _OpenedNewPathChapter && ! _LastStoriesWereSkipped) {
    // need to close the previous story chapter unless we are the first story in a path chapter
    _log(`    Closing story chapter ----------`);
    _WrapStoriesInChapters && _Stories.endOfChapter();
  } else {
    if (_OpenedNewPathChapter) {
      _log('    New path chapter -- skipping closure of previous chapter');
    }
    _OpenedNewPathChapter = false;
  }
  if (_LastStoriesWereSkipped) {
    _log('   Skipping closure of prior story chapter because story was skipped.');
  }
  _LastStoriesWereSkipped = false;

  _log(`    Story chapter ${name}------------`);
  if (options.skip) {
    _LastStoriesWereSkipped = true;
    return getStorybookMock(_Stories);
  }
  if (options.dev) {
    _LastStoriesWereSkipped = true;
    return kadiraStoriesOf(name, module);
  }

  _WrapStoriesInChapters && _Stories.chapter(name);
  return _Stories;
};

/** skip the story by returning a mockup of the storybook that does nothing */
storiesOf.skip = (name, module) => {
  _log(`    SKIPPING stories of ${name}...`);
  return storiesOf(name, module, { skip: true });
};

/**
 * add the story to the Storybook root so that it will stay open during a refresh
 * (Hopefully storybook-chapters will be fixed soon to maintain the currently selected chapter after a refresh,
 * and this will no longer be needed.)
 */
storiesOf.dev = (name, module) => {
  _log(`    Rendering ${name} in dev mode...`);
  return storiesOf(name, module, { dev: true });
};

/**
 * Load Storybook with chapters around each path component
 *
 * By default, only file paths are wrapped in chapters.
 * If `options.wrapStories` is true, each call to `storiesOf()` will be wrapped in a separate chapter.
 *
 * @param {string} storybookName
 * @param {object} reqContext
 * @param {object} options
 * @param {bool} options.wrapStories
 */
const loadStorybook = (storybookName, reqContext, options = {}) => {
  _Stories = originalStoriesOf(storybookName, module);
  const storyLoader = pathsIntoChaptersLoader(_Stories, reqContext, options);
  configure(storyLoader, module);
};


export { storiesOf, loadStorybook };
