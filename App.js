import React from 'react';
import Navigation from './app/navigations/Navigation';
import { firebaseApp } from './app/utils/firebase';
/* import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
  'Module RCTImageLoader requires',
]); */

export default function App() {
  return <Navigation />;
}