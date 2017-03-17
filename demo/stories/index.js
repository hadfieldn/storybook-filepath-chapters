import { loadStorybook } from 'storybook-filepath-chapters';
const stories = require.context('../app/components', true, /.*stories((\.js)|\/(index\.js|.*?stories\.js))$/i);
loadStorybook('Demo Components', stories);
