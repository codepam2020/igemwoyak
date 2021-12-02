import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Switch } from 'react-native';
import { DarkModeAction } from '../actions';
import { useDispatch, useSelector } from 'react-redux';
import { dark, light } from '../theme';
import { BigTextModeAction } from '../actions';

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
  const dispatch = useDispatch();

  function toggleSwitch() {
    dispatch(BigTextModeAction());
  }

  // darkmode redux
  const { bigTextMode, darkmode } = useSelector(state => {
    return {
      bigTextMode: state.settingInfo.bigTextMode,
      darkmode: state.settingInfo.darkmode,
    };
  });

  const theme = darkmode ? dark : light;

  ///rendering start
  return (
    <Container style={style}>
      <Content style={{ fontSize: bigTextMode ? 40 : 20 }}>{content}</Content>
      <SwitchContainer>
        <Switch
          trackColor={{
            false: theme.toggleBarUnactivated,
            true: theme.toggleBarActivated,
          }}
          thumbColor={theme.toggle}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={bigTextMode}
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
