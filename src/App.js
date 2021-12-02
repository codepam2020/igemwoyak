import React, { useState } from 'react';
import Navigation from './navigations';
import { Provider } from 'react-redux';
import store from './store';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { ProgressProvider } from './contexts/Progress';

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const getFonts = async () => {
    await Font.loadAsync({
      'NotoSansKR-Medium': require('../assets/fonts/NotoSansKR-Medium.otf'),
      'NotoSansKR-Bold': require('../assets/fonts/NotoSansKR-Bold.otf'),
    });
  };

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={getFonts}
        onFinish={() => {
          setFontsLoaded(true);
        }}
        onError={err => {
          console.log(err);
        }}
      />
    );
  } else {
    return (
      <Provider store={store}>
        <ProgressProvider>
          <Navigation />
        </ProgressProvider>
      </Provider>
    );
  }
}

export default App;
