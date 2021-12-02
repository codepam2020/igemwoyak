import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from 'styled-components/native';
import { dark, light } from '../theme';
import { StatusBar } from 'react-native';

import DrugStack from './DrugStack';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { ProgressContext } from '../contexts/Progress';
import { Spinner } from '../components';

const Navigation = () => {
  // darkmode redux
  const { inProgress } = useContext(ProgressContext);
  const { bigTextMode, darkmode } = useSelector(state => {
    return {
      bigTextMode: state.settingInfo.bigTextMode,
      darkmode: state.settingInfo.darkmode,
    };
  });

  const theme = darkmode ? dark : light;

  return (
    <ThemeProvider theme={theme} bigTextMode={bigTextMode}>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={darkmode ? 'light-content' : 'dark-content'}
      />

      <NavigationContainer>
        <DrugStack />
        {inProgress && <Spinner />}
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default Navigation;
