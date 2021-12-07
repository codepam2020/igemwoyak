import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import {
  DrugSearchByName,
  PharmDetailed,
  AddDrugByName,
  AddDrugSetting,
  PreDrugDetailed,
  PreDrugModi,
} from '../screens';
import MainTab from './MainTab';
import { Dimensions } from 'react-native';
import { dark, light } from '../theme';
import { Spinner } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();
const width = Dimensions.get('window').width;

const DrugStack = () => {
  const [settingInfos, setSettingInfos] = useState({});
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
    <Stack.Navigator initialRouteName="MainTab">
      <Stack.Screen
        name="MainTab"
        component={MainTab}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PharmDetailed"
        component={PharmDetailed}
        options={{
          title: '약물 상세정보',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            justifyContent: 'center',
            position: 'absolute',
            color: theme.title,
            left: (width - 300) / 2,
            paddingTop: 0,
            marginTop: 0,
            fontSize: settingInfos.bigTextMode ? 38 : 28,
            fontFamily: theme.font_bold,
          },
          headerTintColor: theme.text,

          headerStyle: {
            backgroundColor: theme.background,
          },
        }}
      />
      <Stack.Screen
        name="PreDrugDetailed"
        component={PreDrugDetailed}
        options={{
          title: '약물 상세정보',
          headerTitleStyle: {
            justifyContent: 'center',
            position: 'absolute',
            left: (width - 300) / 2,
            color: theme.title,
            paddingTop: 0,
            marginTop: 0,
            fontSize: settingInfos.bigTextMode ? 38 : 28,
            fontFamily: theme.font_bold,
          },
          headerTintColor: theme.text,

          headerStyle: {
            backgroundColor: theme.background,
          },
        }}
      />
      <Stack.Screen
        name="DrugSearchByName"
        component={DrugSearchByName}
        options={{
          title: '약물명으로 찾기',
          headerTitleStyle: {
            justifyContent: 'center',
            position: 'absolute',
            color: theme.title,
            left: (width - 300) / 2,
            paddingTop: 0,
            marginTop: 0,
            fontSize: settingInfos.bigTextMode ? 38 : 28,
            fontFamily: theme.font_bold,
          },
          headerTintColor: theme.text,

          headerStyle: {
            backgroundColor: theme.background,
          },
        }}
      />
      <Stack.Screen
        name="AddDrugByName"
        component={AddDrugByName}
        options={{
          title: '직접 추가하기',
          headerTitleStyle: {
            justifyContent: 'center',
            position: 'absolute',
            color: theme.title,
            left: (width - 300) / 2,
            paddingTop: 0,
            marginTop: 0,
            fontSize: settingInfos.bigTextMode ? 38 : 28,
            fontFamily: theme.font_bold,
          },
          headerTintColor: theme.text,

          headerStyle: {
            backgroundColor: theme.background,
          },
        }}
      />
      <Stack.Screen
        name="AddDrugSetting"
        component={AddDrugSetting}
        options={{
          title: '복약 설정',
          headerTitleStyle: {
            justifyContent: 'center',
            position: 'absolute',
            color: theme.title,
            left: (width - 300) / 2,
            paddingTop: 0,
            marginTop: 0,
            fontSize: settingInfos.bigTextMode ? 38 : 28,
            fontFamily: theme.font_bold,
          },
          headerTintColor: theme.text,

          headerStyle: {
            backgroundColor: theme.background,
          },
        }}
      />
      <Stack.Screen
        name="PreDrugModi"
        component={PreDrugModi}
        options={{
          title: '복약 설정',
          headerTitleStyle: {
            justifyContent: 'center',
            position: 'absolute',
            color: theme.title,
            left: (width - 300) / 2,
            paddingTop: 0,
            marginTop: 0,
            fontSize: settingInfos.bigTextMode ? 38 : 28,
            fontFamily: theme.font_bold,
          },
          headerTintColor: theme.text,

          headerStyle: {
            backgroundColor: theme.background,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default DrugStack;
