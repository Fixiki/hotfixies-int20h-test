import { Font, AppLoading, Asset } from 'expo'
import React, { Component } from 'react'
import { StyleProvider } from 'native-base'

import App from './App'
import getTheme from './theme/components'
import variables from './theme/variables/commonColor'

export default class Setup extends Component {
  state = {
    isReady: false
  }

  render () {
    const { isReady } = this.state

    if (!isReady) {
      return (
        <AppLoading
          startAsync={this._preLoad}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      )
    }

    return (
      <StyleProvider style={getTheme(variables)}>
        <App />
      </StyleProvider>
    )
  }

  async _preLoad () {
    const loadFonts = Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf')
    })

    const images = [
      // require('../assets/images/expo-icon.png'),
      // require('../assets/images/slack-icon.png')
    ]

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync()
    })

    return Promise.all([
      loadFonts,
      cacheImages
    ])
  }
}
