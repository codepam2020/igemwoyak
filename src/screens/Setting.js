import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import {
  DarkModeButton,
  ScanVibrationButton,
  BigTextMode,
  ChildCautionButton,
  ElderCautionButton,
} from '../components';
import { useSelector } from 'react-redux';
import { dark, light } from '../theme';
import { ChildCautionAction } from '../actions';
import PregnantCautionButton from '../components/PregnantCautionButton';
import CombCautionButton from '../components/CombCautionButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Container = styled.SafeAreaView`
  justify-content: flex-start;
  padding-top: 7px
  flex: 1;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding-left: 15px;
  padding-right: 15px
`;

const List = styled.ScrollView`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
`;

const Title = styled.Text`
  font-size: 30px;
  font-family: ${({ theme }) => theme.font_bold}
  padding-bottom: 15px
  color: ${({ theme }) => theme.title};
`;

/// function start
function Setting() {
  const [choco, setChoco] = useState();
  const width = Dimensions.get('window').width;

  const { setting } = useSelector(state => {
    return {
      setting: state.settingInfo,
    };
  });

  const theme = setting.darkmode ? dark : light;

  return (
    <Container>
      <Title style={{ fontSize: setting.bigTextMode ? 40 : 30 }}>
        환경설정
      </Title>
      <List width={width - 10}>
        <DarkModeButton
          style={{ fontFamily: theme.font_medium }}
          content="다크모드 활성화"
        />
        <ScanVibrationButton content="스캔시 진동 활성화" />
        <BigTextMode content="큰 글씨 모드" />
        <ChildCautionButton content="어린이 복용 경고 활성화" />
        <ElderCautionButton content="노인 복용 경고 활성화" />
        <PregnantCautionButton content="임부 복용 경고 활성화" />
        <CombCautionButton content="병용 주의약물 복용 경고" />
      </List>
    </Container>
  );
}

export default Setting;
