import React from 'react';
import Navigation from './app/navigations/Navigation';
import { firebaseApp } from './app/utils/firebase';
import { YellowBox } from 'react-native';
import _ from 'lodash';

// TODO: LIMPIAR TERMINAL DE LOG INNECESARIOS SETTING A TIMER
YellowBox.ignoreWarnings([
  'Setting a timer',
  /* 'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
  'Module RCTImageLoader requires', */
]);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
export default function App() {
  return <Navigation />;
}