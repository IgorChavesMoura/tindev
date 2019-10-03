/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  
]);

console.ignoredYellowBox = ['Unrecognized WebSocket'];

import Routes from './routes';

// import { Container } from './styles';

export default class App extends Component {
  render() {
    return (

      <Routes />

    );
  }
}



