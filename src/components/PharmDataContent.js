import React from 'react';
import { Dimensions, Alert, Vibration } from 'react-native';
import { RemoveDrugInfo } from '../actions';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { DateConvert } from '../utils';
import * as Speech from 'expo-speech';

const width = Dimensions.get('window').width;

const Container = styled.View`
  flex:1;
  flex-direction: row
  margin-top: 10px
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ theme }) => theme.pharmDataContent}
  border-radius: 10px;
  width: ${width - 45}px;
  height: 70px;
  margin-bottom:2px
`;

const NmaeContainer = styled.TouchableOpacity`
  flex-direction: row
  flex: 7;
  justify-content: center;
  align-self: center
  align-items: center;
  padding-left: 20px;
`;

const IconContainer = styled.TouchableOpacity`
  flex: 0.8;
  justify-content: flex-start;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px
  padding-right: 10px
  padding-left: 10px
`;

const Content = styled.Text`
  flex:0.9
  align-items: flex-start
  font-size: 20px;
  font-family: ${({ theme }) => theme.font_medium}
  color: black;
`;

const Time = styled.Text`
  flex: 1;
  font-size: 15px;
  color: black;
  align-self: center;
  align-items: center;
  justify-content: center;
  padding-top: 6px;
`;

const TimeContainer = styled.View`
  flex: 0.5;
  align-items: center;
  align-self: center;
  justify-content: center;
`;

const PharmDataContent = ({ drugInfo, namePress, style, removePress }) => {
  const dispatch = useDispatch();
  const { id, name } = drugInfo;
  const { year, month, week, date, time } = DateConvert(drugInfo.time);
  const { bigTextMode, darkmode } = useSelector(state => {
    return {
      bigTextMode: state.settingInfo.bigTextMode,
      darkmode: state.settingInfo.darkmode,
    };
  });

  function PharmNameset(data) {
    if (width < 600) {
      if (bigTextMode == true) {
        if (data.length >= 5) {
          return `${data.substring(0, 5)}..`;
        } else {
          return data;
        }
      } else {
        if (bigTextMode == true) {
          if (data.length >= 10) {
            return `${data.substring(0, 10)}..`;
          } else {
            return data;
          }
        }
      }
    } else {
      return data;
    }

    if (data.length >= 10) {
      return `${data.substring(0, 10)}..`;
    } else {
      return data;
    }
  }

  // long press function
  function longPress() {
    Vibration.vibrate(20);
    Speech.speak(name, { pitch: 1, rate: 0.9 });
  }

  return (
    <Container style={style}>
      <NmaeContainer
        onPress={namePress}
        onLongPress={longPress}
        delayLongPress={300}
      >
        <Content style={{ fontSize: bigTextMode ? 33 : 18 }}>
          {PharmNameset(name)}
        </Content>
        <TimeContainer>
          <Time
            style={{ fontSize: bigTextMode ? 25 : 15 }}
          >{`${month}월 ${date}일 (${week})`}</Time>
          <Time style={{ fontSize: bigTextMode ? 25 : 15 }}>{`${time}`}</Time>
        </TimeContainer>
      </NmaeContainer>
      <IconContainer onPress={removePress}>
        <FontAwesome5 name="trash-alt" size={26} color="black" />
      </IconContainer>
    </Container>
  );
};

export default PharmDataContent;
