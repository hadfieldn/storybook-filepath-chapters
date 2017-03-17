import React from 'react';
import { storiesOf } from 'storybook-filepath-chapters';
import Label1 from './Label1';
import Label2 from './Label2';

storiesOf('Labels', module)
  .add('Label1', () => <Label1>Label 1</Label1>)
  .add('Label2', () => <Label2>Label 2</Label2>)
;
