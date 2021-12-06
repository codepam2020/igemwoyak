import React, { useContext, useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from 'styled-components/native';
import { dark, light } from '../theme';
import { StatusBar } from 'react-native';

import DrugStack from './DrugStack';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { ProgressContext } from '../contexts/Progress';
import { Spinner } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Navigation = () => {
  const [settingInfos, setSettingInfos] = useState({});
  // darkmode redux
  const { inProgress } = useContext(ProgressContext);
  const { setting } = useSelector(state => {
    return {
      setting: state.settingInfo,
    };
  });

  const loadSettingInfos = async () => {
    try {
      const value = await AsyncStorage.getItem('@testsettinginfo12321');
      const settingInfo = JSON.parse(value);
      if (value != null) {
        setSettingInfos(settingInfo);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    loadSettingInfos();
  }, [setting]);

  const theme = settingInfos.darkmode ? dark : light;

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={settingInfos.darkmode ? 'light-content' : 'dark-content'}
      />

      <NavigationContainer>
        <DrugStack />
        {inProgress && <Spinner />}
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default Navigation;
