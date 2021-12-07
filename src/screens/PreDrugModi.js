import React, { useState, useEffect } from 'react';
import { Dimensions, Switch, Button, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styled, { ThemeConsumer } from 'styled-components/native';
import { Picker } from '@react-native-picker/picker';
import { light, dark } from '../theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AddPreDrugInfo, RemovePreDrugInfo } from '../actions/PreDrugAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;

const Container = styled.View`
  flex:1
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ theme }) => theme.background}
`;

const ScrollContainer = styled.ScrollView`
  width: ${width - 20}px;
  padding: 10px;
`;

const SemiContainer = styled.View`
  width: ${width - 30}px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const Text = styled.Text`
  font-family: ${({ theme }) => theme.font_medium};
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  padding-left: 20px;
`;

const DrugTimeText = styled.Text`
  font-family: ${({ theme }) => theme.font_medium};
  font-size: 18px;
  color: ${({ theme }) => theme.text};
`;

const SwitchContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 30px;
`;

const ButtonText = styled.Text`
  font-size: 20px;
  font-family: ${({ theme }) => theme.font_bold};
`;

function PreDrugModi({ route, navigation }) {
  const [settingInfos, setSettingInfos] = useState({});
  const [preDrugInformation, setPreDrugInformation] = useState({});
  const { drugInfo } = route.params;

  const { bigTextMode, darkmode } = useSelector(state => {
    return {
      bigTextMode: state.settingInfo.bigTextMode,
      darkmode: state.settingInfo.darkmode,
    };
  });

  const load = async () => {
    try {
      const value = await AsyncStorage.getItem('@test1849923');
      const predruginformation = JSON.parse(value);

      if (value != null) {
        setPreDrugInformation(predruginformation);
      }
    } catch (e) {
      console.log(e.message);
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

  const dispatchPreDrugInfo = async data => {
    try {
      await AsyncStorage.setItem('@test1849923', JSON.stringify(data));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    load();
    loadSettingInfos();
  }, []);

  const theme = settingInfos.darkmode ? dark : light;
  const dispatch = useDispatch();
  const [preDrugDays, setPreDrugDays] = useState(
    drugInfo.PreDrugDays ? drugInfo.PreDrugDays : '7일',
  );

  /// 숫자 리스트 형태
  var num = [];
  for (var i = 1; i < 91; i++) {
    num.push(i);
  }

  //알람 설정 여부
  const [morningAlarm, setMorningAlarm] = useState(drugInfo.MorningAlarm);
  const [lunchAlarm, setLunchAlarm] = useState(drugInfo.LunchAlarm);
  const [dinnerAlarm, setDinnerAlarm] = useState(drugInfo.DinnerAlarm);
  const [nightAlarm, setNightAlarm] = useState(drugInfo.NightAlarm);

  // 알람 설정창 show 여부
  const [morningTime, setMorningTime] = useState(
    new Date(drugInfo.MorningTime ? drugInfo.MorningTime : null),
  );
  const [morningTimeShow, setMorningTimeShow] = useState(false);
  const [lunchTime, setLunchTime] = useState(
    new Date(drugInfo.LunchTime ? drugInfo.LunchTime : null),
  );
  const [lunchtimeShow, setLunchTimeShow] = useState(false);
  const [dinnerTime, setDinnerTime] = useState(
    new Date(drugInfo.DinnerTime ? drugInfo.DinnerTime : null),
  );
  const [dinnertimeShow, setDinnerTimeShow] = useState(false);
  const [nightTime, setNightTime] = useState(
    new Date(drugInfo.NightTime ? drugInfo.NightTime : null),
  );
  const [nighttimeShow, setNightTimeShow] = useState(false);

  // 시간 변경시 함수
  function morningTimeOnChnage(event, selectedTime) {
    const currentTime = selectedTime || morningTime;
    setMorningTimeShow(Platform.OS === 'ios');
    setMorningTime(prev => currentTime);
    drugInfo.MorningTime = currentTime.toString();
  }

  function lunchTimeOnChange(event, selectedTime) {
    const currentTime = selectedTime || lunchTime;
    setLunchTimeShow(Platform.OS === 'ios');
    setLunchTime(prev => currentTime);
    drugInfo.LunchTime = currentTime.toString();
  }

  function dinnerTimeOnChange(event, selectedTime) {
    const currentTime = selectedTime || dinnerTime;
    setDinnerTimeShow(Platform.OS === 'ios');
    setDinnerTime(prev => currentTime);
    drugInfo.DinnerTime = currentTime.toString();
  }

  function nightTimeOnChange(event, selectedTime) {
    const currentTime = selectedTime || nightTime;
    setNightTimeShow(Platform.OS === 'ios');
    setNightTime(prev => currentTime);
    drugInfo.NightTime = currentTime.toString();
  }

  //push save button
  function PushSaveButton() {
    dispatch(RemovePreDrugInfo(drugInfo.id));
    dispatch(AddPreDrugInfo(drugInfo));

    preDrugInformation[drugInfo.id].PreDrugDays = preDrugDays;
    preDrugInformation[drugInfo.id].MorningAlarm = morningAlarm;
    preDrugInformation[drugInfo.id].LunchAlarm = lunchAlarm;
    preDrugInformation[drugInfo.id].DinnerAlarm = dinnerAlarm;
    preDrugInformation[drugInfo.id].NightAlarm = nightAlarm;

    preDrugInformation[drugInfo.id].MorningTime = morningTime;
    preDrugInformation[drugInfo.id].LunchTime = lunchTime;
    preDrugInformation[drugInfo.id].DinnerTime = dinnerTime;
    preDrugInformation[drugInfo.id].NightTime = nightTime;

    dispatchPreDrugInfo(preDrugInformation);

    navigation.navigate('MainTab');
  }

  /// rendering start
  return (
    <Container>
      <ScrollContainer>
        <SemiContainer>
          <Text>약물 이름 : </Text>
          <Text style={{ paddingLeft: 20 }}>{drugInfo.name}</Text>
        </SemiContainer>
        <SemiContainer>
          <Text>약물 복용 기간 : </Text>
          <Picker
            selectedValue={preDrugDays}
            onValueChange={(value, index) => {
              setPreDrugDays(value);
              drugInfo.PreDrugDays = value;
            }}
            dropdownIconColor={theme.text}
            style={{
              height: 80,
              width: 110,
              color: theme.text,
              position: 'absolute',
              right: 20,
            }}
          >
            {num.map(num => (
              <Picker.Item
                style={{ fontSize: 18 }}
                label={`${num}일`}
                value={`${num}일`}
                key={num}
              />
            ))}
          </Picker>
        </SemiContainer>
        <SemiContainer
          style={{
            borderTopColor: darkmode ? 'gray' : 'lightgray',
            borderTopWidth: 1,
            marginTop: 25,
            paddingTop: 25,
          }}
        >
          <Text>복약 알림 시간</Text>
        </SemiContainer>
        <SemiContainer>
          <DrugTimeText
            style={{
              color: morningAlarm ? theme.text : theme.pharmDataContent,
            }}
          >
            아침
          </DrugTimeText>
          <TouchableOpacity
            onPress={() => {
              setMorningTimeShow(true);
            }}
            style={{
              padding: 10,
              right: (width - 60) / 2,
              position: 'absolute',
            }}
            disabled={!morningAlarm}
          >
            <Text
              style={{
                color: morningAlarm ? theme.text : theme.pharmDataContent,
              }}
            >{`${morningTime.toTimeString().substring(0, 2)} 시  ${morningTime
              .toTimeString()
              .substring(3, 5)} 분`}</Text>
          </TouchableOpacity>
          <SwitchContainer>
            <Switch
              trackColor={{
                false: theme.toggleBarUnactivated,
                true: theme.toggleBarActivated,
              }}
              thumbColor={theme.toggle}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setMorningAlarm(prev => !prev);
                drugInfo.MorningAlarm = !morningAlarm;
              }}
              value={morningAlarm}
              style={{
                marginLeft: 4,
                alignItems: 'center',
              }}
            />
          </SwitchContainer>
        </SemiContainer>
        <SemiContainer>
          <DrugTimeText
            style={{
              color: lunchAlarm ? theme.text : theme.pharmDataContent,
            }}
          >
            점심
          </DrugTimeText>
          <TouchableOpacity
            onPress={() => {
              setLunchTimeShow(true);
            }}
            style={{
              padding: 10,
              right: (width - 60) / 2,
              position: 'absolute',
            }}
            disabled={!lunchAlarm}
          >
            <Text
              style={{
                color: lunchAlarm ? theme.text : theme.pharmDataContent,
              }}
            >{`${lunchTime.toTimeString().substring(0, 2)} 시  ${lunchTime
              .toTimeString()
              .substring(3, 5)} 분`}</Text>
          </TouchableOpacity>
          <SwitchContainer>
            <Switch
              trackColor={{
                false: theme.toggleBarUnactivated,
                true: theme.toggleBarActivated,
              }}
              thumbColor={theme.toggle}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setLunchAlarm(prev => !prev);
                drugInfo.LunchAlarm = !lunchAlarm;
              }}
              value={lunchAlarm}
              style={{
                marginLeft: 4,
                alignItems: 'center',
              }}
            />
          </SwitchContainer>
        </SemiContainer>
        <SemiContainer>
          <DrugTimeText
            style={{
              color: dinnerAlarm ? theme.text : theme.pharmDataContent,
            }}
          >
            저녁
          </DrugTimeText>
          <TouchableOpacity
            onPress={() => {
              setDinnerTimeShow(true);
            }}
            style={{
              padding: 10,
              right: (width - 60) / 2,
              position: 'absolute',
            }}
            disabled={!dinnerAlarm}
          >
            <Text
              style={{
                color: dinnerAlarm ? theme.text : theme.pharmDataContent,
              }}
            >{`${dinnerTime.toTimeString().substring(0, 2)} 시  ${dinnerTime
              .toTimeString()
              .substring(3, 5)} 분`}</Text>
          </TouchableOpacity>
          <SwitchContainer>
            <Switch
              trackColor={{
                false: theme.toggleBarUnactivated,
                true: theme.toggleBarActivated,
              }}
              thumbColor={theme.toggle}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setDinnerAlarm(prev => !prev);
                drugInfo.DinnerAlarm = !dinnerAlarm;
              }}
              value={dinnerAlarm}
              style={{
                marginLeft: 4,
                alignItems: 'center',
              }}
            />
          </SwitchContainer>
        </SemiContainer>
        <SemiContainer>
          <DrugTimeText
            style={{
              color: nightAlarm ? theme.text : theme.pharmDataContent,
            }}
          >
            취침전
          </DrugTimeText>
          <TouchableOpacity
            onPress={() => {
              setNightTimeShow(true);
            }}
            style={{
              padding: 10,
              right: (width - 60) / 2,
              position: 'absolute',
            }}
            disabled={!nightAlarm}
          >
            <Text
              style={{
                color: nightAlarm ? theme.text : theme.pharmDataContent,
              }}
            >{`${nightTime.toTimeString().substring(0, 2)} 시  ${nightTime
              .toTimeString()
              .substring(3, 5)} 분`}</Text>
          </TouchableOpacity>
          <SwitchContainer>
            <Switch
              trackColor={{
                false: theme.toggleBarUnactivated,
                true: theme.toggleBarActivated,
              }}
              thumbColor={theme.toggle}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setNightAlarm(prev => !prev);
                drugInfo.NightAlarm = !nightAlarm;
              }}
              value={nightAlarm}
              style={{
                marginLeft: 4,
                alignItems: 'center',
              }}
            />
          </SwitchContainer>
        </SemiContainer>
        <SemiContainer
          style={{
            borderTopColor: darkmode ? 'gray' : 'lightgray',
            borderTopWidth: 1,
            marginTop: 25,
            paddingTop: 30,
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            onPress={PushSaveButton}
            style={{
              backgroundColor: 'pink',
              borderRadius: 20,
              width: 110,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ButtonText>저장하기</ButtonText>
          </TouchableOpacity>
        </SemiContainer>
      </ScrollContainer>
      {morningTimeShow && (
        <DateTimePicker
          testID="dateTimePicker"
          value={morningTime}
          mode={'time'}
          is24Hour={false}
          display="default"
          onChange={morningTimeOnChnage}
        />
      )}
      {lunchtimeShow && (
        <DateTimePicker
          testID="dateTimePicker"
          value={lunchTime}
          mode={'time'}
          is24Hour={false}
          display="default"
          onChange={lunchTimeOnChange}
        />
      )}
      {dinnertimeShow && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dinnerTime}
          mode={'time'}
          is24Hour={false}
          display="default"
          onChange={dinnerTimeOnChange}
        />
      )}
      {nighttimeShow && (
        <DateTimePicker
          testID="dateTimePicker"
          value={nightTime}
          mode={'time'}
          is24Hour={false}
          display="default"
          onChange={nightTimeOnChange}
        />
      )}
    </Container>
  );
}

export default PreDrugModi;
