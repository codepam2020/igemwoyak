import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import { RemoveDrugInfo } from '../actions';
import PharmDataContent from '../components/PharmDataContent';
import { dark, light } from '../theme';
import DrugSearchButton from '../components/DrugSearchButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Container = styled.SafeAreaView`
  justify-content: flex-start;
  padding-top: 0px
  margin-top:0
  flex: 1;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding-left: 15px;
  padding-right: 15px
`;

const Title = styled.Text`
  font-size: 30px;
  top:-10px
  font-family: ${({ theme }) => theme.font_bold}
  color: ${({ theme }) => theme.title};
  padding-top: 0;
  margin-top: 0;
`;

const List = styled.ScrollView`
  flex: 1;
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 0;
`;

const Content = styled.Text`
  font-size: 18px;
  font-family: ${({ theme }) => theme.font_medium}
  color: white;
  padding: 7px 0;
  padding-bottom: 30px;
  padding-top: 0
  margin-top:0
`;

// function start
function TakingPharmData({ navigation }) {
  const [settingInfos, setSettingInfos] = useState({});
  const [preDrugInformation, setPreDrugInformation] = useState({});
  const [drugInformation, setDrugInformation] = useState({});
  const { drugInfos, preDrugInfos, setting } = useSelector(state => {
    return {
      drugInfos: state.drugInfo,
      preDrugInfos: state.preDrugInfo,
      setting: state.settingInfo,
    };
  });
  const dispatch = useDispatch();

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

  async function loadDrugInfo() {
    try {
      const value = await AsyncStorage.getItem('@test2349873');
      const info = JSON.parse(value);
      if (value != null) {
        setDrugInformation(info);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async function dispatchDrugInfo(data) {
    try {
      await AsyncStorage.setItem('@test2349873', JSON.stringify(data));
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    load();
    loadSettingInfos();
    loadDrugInfo();
  }, [drugInfos, preDrugInfos, setting]);

  console.log(drugInformation);

  const theme = settingInfos.darkmode ? dark : light;

  var CombList = [];

  for (i = 0; i < Object.values(preDrugInformation).length; i++) {
    CombList.push(Object.values(preDrugInformation)[i].CombTarget);
  }

  function removePress(id) {
    console.log('Press remove button');
    Alert.alert(
      '?????? ?????????????????????????',
      '????????? ?????? ??????????????? ????????? ??????????????????.',
      [
        {
          text: '?????????',
          onPress: () => {},
        },
        {
          text: '???',
          onPress: () => {
            const currentDrugInfos = Object.assign({}, drugInformation);
            delete currentDrugInfos[id];
            dispatch(RemoveDrugInfo(id));
            dispatchDrugInfo(currentDrugInfos);
          },
        },
      ],
    );
  }

  return (
    <Container>
      <Title style={{ fontSize: settingInfos.bigTextMode ? 40 : 30 }}>
        ?????? ??????
      </Title>
      <Content style={{ color: theme.caution, paddingBottom: 10 }}>
        ??????????????? ???????????? ????????? ????????? ????????? ????????? ???????????????
      </Content>
      <List>
        {Object.values(drugInformation) &&
          Object.values(drugInformation)
            .sort((a, b) => parseFloat(b.id) - parseFloat(a.id))
            .map(drugInfo => (
              <PharmDataContent
                style={{
                  height: setting.bigTextMode ? 85 : 70,
                  backgroundColor:
                    (settingInfos.PregnantCaution
                      ? drugInfo.PregnantGrade
                      : false) ||
                    (settingInfos.ElderCaution ? drugInfo.ElderNote : false) ||
                    (settingInfos.ChildCaution ? drugInfo.ChildAge : false) ||
                    (settingInfos.CombCaution
                      ? CombList.filter(e =>
                          e ? e.indexOf(drugInfo.StdCode) !== -1 : false,
                        ).length > 1
                      : false)
                      ? theme.caution
                      : settingInfos.darkmode
                      ? 'gray'
                      : 'lightgray',
                }}
                key={drugInfo.id}
                drugInfo={drugInfo}
                navigation={navigation}
                namePress={() =>
                  navigation.navigate('PharmDetailed', { drugInfo, CombList })
                }
                removePress={() => removePress(drugInfo.id)}
              />
            ))}
      </List>
      <DrugSearchButton
        onPress={() => {
          navigation.navigate('DrugSearchByName');
        }}
        icon="search"
      />
    </Container>
  );
}

export default TakingPharmData;

// charAt : ?????? index??? ???????????? ????????? ???????????? ??????
// indexOf : ?????? ????????? ????????? ????????? ??????
// substring : string?????? index:index ??? ?????? ?????? string ?????? ??????
// title=" => +7
// [CDATA[ => +7

// ???????????????(???????????????????????????)
// ??????2(???????????????)
