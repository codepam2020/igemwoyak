import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScanQRcode, TakingPharmData, Setting, DrugNow } from '../screens';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

import { dark, light } from '../theme';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

function TabIcon_MaterialCommunityIcons({ name, size, color }) {
  return <MaterialCommunityIcons name={name} size={25} color={color} />;
}

function TabIcon_Awesome5({ name, size, color }) {
  return <FontAwesome5 name={name} size={26} color={color} />;
}

function MainTab({ navigation }) {
  // darkmode redux
  const darkmode = useSelector(state => {
    return state.settingInfo.darkmode;
  });

  const theme = darkmode ? dark : light;

  // rendering start

  return (
    <Tab.Navigator
      initialRouteName="DrugNow"
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.background,
          borderColor: theme.background,
          paddingBottom: 0,
          height: 65,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="DrugNow"
        component={DrugNow}
        options={{
          headerShown: false,
          tabBarIcon: icon =>
            TabIcon_MaterialCommunityIcons({
              ...icon,
              name: 'clipboard-list-outline',
            }),
        }}
      />
      <Tab.Screen
        name="TakingPharmData"
        component={TakingPharmData}
        options={{
          headerShown: false,
          tabBarIcon: icon =>
            TabIcon_MaterialCommunityIcons({ ...icon, name: 'pill' }),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanQRcode}
        options={{
          headerShown: false,
          tabBarIcon: icon =>
            TabIcon_MaterialCommunityIcons({ ...icon, name: 'qrcode-scan' }),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          headerShown: false,
          tabBarIcon: props =>
            TabIcon_MaterialCommunityIcons({
              ...props,
              name: 'dots-horizontal',
            }),
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTab;
