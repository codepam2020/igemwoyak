import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import { DrugSearchButton } from '../components';
import { dark, light } from '../theme';
import { PreDrugDataContent } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RemovePreDrugInfo } from '../actions';

const Container = styled.SafeAreaView`
  justify-content: flex-start;
  padding-top: 0px
  margin-top:0
  flex: 1;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding-left: 15px;
  padding-right: 15px;
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
`;

const DrugNow = ({ navigation }) => {
  const [preDrugInformation, setPreDrugInformation] = useState({});
  const [settingInfos, setSettingInfos] = useState({});

  const { preDrugInfos, setting } = useSelector(state => {
    return {
      preDrugInfos: state.preDrugInfo,
      setting: state.settingInfo,
    };
  });
  const dispatch = useDispatch();
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
      const value = await AsyncStorage.getItem('@test1849923');
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
      await AsyncStorage.setItem('@test1849923', JSON.stringify(data));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    load();
    loadSettingInfos();
  }, [preDrugInfos, setting]);

  function _removePress(id) {
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
            const currentDrugInfos = Object.assign({}, preDrugInformation);
            delete currentDrugInfos[id];
            dispatch(RemovePreDrugInfo(id));
            dispatchPreDrugInfo(currentDrugInfos);
          },
        },
      ],
    );
  }

  const theme = settingInfos.darkmode ? dark : light;

  return (
    <Container>
      <Title style={{ fontSize: setting.bigTextMode ? 38 : 28 }}>
        ?????? ???????????? ??????
      </Title>
      <Content style={{ color: theme.caution, paddingBottom: 10 }}>
        ??????????????? ???????????? ????????? ????????? ????????? ????????? ???????????????
      </Content>
      <List>
        {Object.values(preDrugInformation) &&
          Object.values(preDrugInformation)
            .sort((a, b) => parseFloat(b.id) - parseFloat(a.id))
            .map(drugInfo => (
              <PreDrugDataContent
                style={{
                  height: settingInfos.bigTextMode ? 85 : 70,
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

// ???????????????(???????????????????????????)
// ??????2(???????????????)
