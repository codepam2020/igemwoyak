import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { dark, light } from '../theme';
import { ScanVibrationAction } from '../actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Container = styled.View`
  flex-direction: row;
  padding: 10px 0;
  padding-left: 10px;
`;

const SwitchContainer = styled.View`
  flex: 1;
  flex-direction: row-reverse
  align-items: center;
  justify-content: flex-start;
  `;

const Content = styled.Text`
  color: ${({ theme }) => theme.text};
  font-family: ${({ theme }) => theme.font_medium}
  font-size: 20px;
  align-self: flex-start;
`;

/// function start
function ScanVibrationButton({ content, style }) {
  const [settingInfos, setSettingInfos] = useState({});
  const dispatch = useDispatch();

  // darkmode redux
  const { setting } = useSelector(state => {
    return {
      setting: state.settingInfo,
    };
  });

  const dispatchSettingInfos = async data => {
    try {
      await AsyncStorage.setItem('@testsettinginfo12321', JSON.stringify(data));
    } catch (e) {
      console.log(e);
    }
  };

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

  ///rendering start
  return (
    <Container style={style}>
      <Content style={{ fontSize: settingInfos.bigTextMode ? 33 : 18 }}>
        {content}
      </Content>
      <SwitchContainer>
        <Switch
          trackColor={{
            false: theme.toggleBarUnactivated,
            true: theme.toggleBarActivated,
          }}
          thumbColor={theme.toggle}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            const new_setting = { vibration: !settingInfos.vibration };
            dispatchSettingInfos({ ...settingInfos, ...new_setting });
            dispatch(ScanVibrationAction());
            loadSettingInfos();
          }}
          value={settingInfos.vibration}
          style={{
            marginLeft: 4,
            alignItems: 'center',
          }}
        />
      </SwitchContainer>
    </Container>
  );
}

export default ScanVibrationButton;

ScanVibrationButton.defaultprops = {
  isEnabled: false,
};
