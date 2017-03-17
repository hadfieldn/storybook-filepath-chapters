import React from 'react';
import { storiesOf } from 'storybook-filepath-chapters';
import Button1 from './Button1';
import Button2 from './Button2';

storiesOf('Buttons', module)
  .add('Button1', () => <Button1>Button 1</Button1>)
  .add('Button2', () => <Button2>Button 2</Button2>)
;
