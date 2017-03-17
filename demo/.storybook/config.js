import { configure } from '@kadira/storybook';
import { setOptions } from '@kadira/storybook-addon-options';

setOptions({
    name: 'Storybook Path Navigation',
    url: 'https://github.com/hadfieldn/storybook-filepath-chapters',
    goFullScreen: false,
    showLeftPanel: true,
    showDownPanel: true,
    showSearchBox: false,
    downPanelInRight: false,
});

configure(() => { require('../stories'); }, module);
