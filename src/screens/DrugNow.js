import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import { DrugSearchButton } from '../components';
import { dark, light } from '../theme';
import { PreDrugDataContent } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PreDrugInformation } from '../reducers/PreDrugInformation';

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

const DrugNow = ({ navigation }) => {
  const [preDrugInformation, setPreDrugInformation] = useState({});
  const [settingInfos, setSettingInfos] = useState({});
  const [variation, setVariation] = useState(1);

  const { preDrugInfos, setting } = useSelector(state => {
    return {
      preDrugInfos: state.preDrugInfo,
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

  const load = async () => {
    try {
      const value = await AsyncStorage.getItem('@test12321');
      const predruginformation = JSON.parse(value);

      if (value != null) {
        setPreDrugInformation(predruginformation);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  var CombList = [];

  for (i = 0; i < preDrugInfos.length; i++) {
    CombList.push(preDrugInfos[i].CombTarget);
  }

  const dispatchPreDrugInfo = async data => {
    try {
      await AsyncStorage.setItem('@test12321', JSON.stringify(data));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    load();
    loadSettingInfos();
  }, [preDrugInfos, variation, setting]);

  function _removePress(id) {
    console.log('Press remove button');
    Alert.alert(
      '정말 삭제하시겠습니까?',
      '삭제시 복구 불가능하니 신중히 선택바랍니다.',
      [
        {
          text: '아니요',
          onPress: () => {},
        },
        {
          text: '네',
          onPress: () => {
            const currentDrugInfos = Object.assign({}, preDrugInformation);
            delete currentDrugInfos[id];
            dispatchPreDrugInfo(currentDrugInfos);
            setVariation(prev => prev + 1);
          },
        },
      ],
    );
  }

  const theme = settingInfos.darkmode ? dark : light;

  return (
    <Container>
      <Title style={{ fontSize: setting.bigTextMode ? 38 : 28 }}>
        현재 복용중인 약물
      </Title>
      <Content style={{ color: theme.caution, paddingBottom: 10 }}>
        빨간색으로 표시되는 약물은 복용시 주의가 필요한 약물입니다
      </Content>
      <List>
        {Object.values(preDrugInformation) &&
          Object.values(preDrugInformation)
            .sort((a, b) => parseFloat(b.id) - parseFloat(a.id))
            .map(drugInfo => (
              <PreDrugDataContent
                style={{
                  height: setting.bigTextMode ? 85 : 70,
                  backgroundColor:
                    (setting.PregnantCaution
                      ? drugInfo.PregnantGrade
                      : false) ||
                    (setting.ElderCaution ? drugInfo.ElderNote : false) ||
                    (setting.ChildCaution ? drugInfo.ChildAge : false) ||
                    (setting.CombCaution
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
                removePress={() => {
                  _removePress(drugInfo.id);
                }}
                namePress={() =>
                  navigation.navigate('PreDrugDetailed', {
                    drugInfo,
                    CombList,
                  })
                }
              />
            ))}
      </List>
      <DrugSearchButton
        onPress={() => {
          navigation.navigate('AddDrugByName');
        }}
        icon="plus"
      />
    </Container>
  );
};

export default DrugNow;

// 케토라신정(케토롤락트로메타민)
// 콕스2(세레콕시브)
