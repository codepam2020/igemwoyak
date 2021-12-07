import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
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

  useEffect(() => {
    load();
    loadSettingInfos();
  }, [preDrugInformation, drugInfos]);

  const theme = settingInfos.darkmode ? dark : light;

  var CombList = [];

  for (i = 0; i < Object.values(preDrugInformation).length; i++) {
    CombList.push(Object.values(preDrugInformation)[i].CombTarget);
  }

  console.log(CombList);

  return (
    <Container>
      <Title style={{ fontSize: settingInfos.bigTextMode ? 40 : 30 }}>
        복약 내역
      </Title>
      <Content style={{ color: theme.caution, paddingBottom: 10 }}>
        빨간색으로 표시되는 약물은 복용시 주의가 필요한 약물입니다.
      </Content>
      <List>
        {drugInfos &&
          drugInfos
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
                        ).length > 0
                      : false)
                      ? theme.caution
                      : setting.darkmode
                      ? 'gray'
                      : 'lightgray',
                }}
                key={drugInfo.id}
                drugInfo={drugInfo}
                navigation={navigation}
                namePress={() =>
                  navigation.navigate('PharmDetailed', { drugInfo, CombList })
                }
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

// charAt : 특정 index에 해당하는 문자가 무엇인지 확인
// indexOf : 특정 문자가 어디에 있는지 확인
// substring : string에서 index:index 를 통해 특정 string 추출 가능
// title=" => +7
// [CDATA[ => +7

// 케토라신정(케토롤락트로메타민)
// 콕스2(세레콕시브)
