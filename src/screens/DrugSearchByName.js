import React, { useState, useContext, useEffect } from 'react';
import { ProgressContext } from '../contexts/Progress';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import { Alert, Dimensions, Text } from 'react-native';
import secret from '../data/secret.json';
import { EditPharmName, EditPharmData } from '../utils';
import { AddDrugInfo } from '../actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;

const TextContainer = styled.Text`
  font-size: 20px;
  padding-bottom: 4px;
  font-weight: bold;
`;

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: flex-start
  align-items: center;
  background-color: ${({ theme }) => theme.background}
`;

const ScrollContainer = styled.ScrollView`
  flex: 1;
  margin-top: 20px;
`;

const ContentBox = styled.TouchableOpacity`
  flex: 1;
  height: 60px;
  width: ${width - 30}px;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.pharmDataContent}
  justify-content: center;
  align-items: flex-start;
  padding-left: 20px;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const ContentText = styled.Text`
  font-size: 20px;
  color: black;
`;

const TextInputBox = styled.TextInput`
  width: ${width - 110}px
  height:50px;
  border-radius:15px;
  background-color: ${({ theme }) => theme.pharmDataContent}
  font-size:20px;
  padding: 3px 18px
  margin-right: 10px
`;

const SearchContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-left: 10px;
  padding-right: 10px;
`;

const SearchButtonTouch = styled.TouchableOpacity`
  width: 60px;
  height: 50px;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.pharmDataContent};
`;

function DrugSearchByName({ navigation }) {
  const { spinner } = useContext(ProgressContext);
  const [settingInfos, setSettingInfos] = useState({});
  const [drugInformation, setDrugInformation] = useState({});
  const [text, setText] = useState('');
  const [drugNames, setDrugNames] = useState([]);
  const { setting } = useSelector(state => {
    return {
      setting: state.settingInfo,
    };
  });
  const dispatch = useDispatch();

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

  async function dispatchDrugInfo(data) {
    try {
      await AsyncStorage.setItem('@test2349873', JSON.stringify(data));
    } catch (e) {
      console.log(e.message);
    }
  }

  function timestamp() {
    var Now = new Date();
    Now.setHours(Now.getHours() + 9);
    return Now.toISOString().replace('T', ' ').substring(0, 19);
  }

  useEffect(() => {
    loadDrugInfo();
    loadSettingInfos();
  }, []);

  // seq코드를 바코드로 변경
  const SeqToBarCode = async data => {
    try {
      await fetch(`${secret.drug_seq_code_key}&item_seq=${data}&type=json`)
        .then(response => {
          return response.json();
        })
        .then(myJson => {
          const barcode = myJson.body.items[0].BAR_CODE.substring(0, 13);
          SearchDrugByBarCode(barcode);
        });
    } catch (e) {
      console.log(e.message);
      Alert.alert('다른 약물을 선택해주세요');
    }
  };

  // 바코드 정보로 약물 검색
  const SearchDrugByBarCode = async data => {
    try {
      spinner.start();
      await fetch(
        `http://apis.data.go.kr/1471057/MdcinPrductPrmisnInfoService1/getMdcinPrductItem?serviceKey=${secret.pharm_service_key}&bar_code=${data}&type=json`,
      )
        .then(response => {
          return response.json();
        })
        .then(myJson => {
          const drugInfo = {
            name: EditPharmName(myJson.body.items[0].ITEM_NAME),
            howToStore: myJson.body.items[0].STORAGE_METHOD,
            howMuch: EditPharmData(myJson.body.items[0].UD_DOC_DATA),
            mainINGR: myJson.body.items[0].MAIN_ITEM_INGR,
            id: Date.now().toString(),
            time: Date().toString(),
            barcode: data,
            seqcode: myJson.body.items[0].ITEM_SEQ,
            effect: EditPharmData(myJson.body.items[0].EE_DOC_DATA),
            caution: EditPharmData(myJson.body.items[0].NB_DOC_DATA),
            brandName: myJson.body.items[0].ENTP_NAME,
            updateInfo: myJson.body.items[0].GBN_NAME,
          };

          return CheckDrugAlert(drugInfo);
        });
    } catch (e) {
      spinner.stop();
      console.log(e.message);
    }
  };

  // 약물 확인
  function CheckDrugAlert(data) {
    spinner.stop();
    Alert.alert(
      '복용 약물이 아래 내용이 맞습니까?',
      `복약 시간: ${timestamp()}
    약물명: ${data.name}
    `,
      [
        {
          text: '아니요',
          onPress: () => {
            console.log('Cancel Pressed');
          },
          style: 'cancel',
        },
        {
          text: '네',
          onPress: () => {
            spinner.start();
            SearchStdCode(data);
            navigation.navigate('MainTab');
          },
        },
      ],
    );
  }

  // 바코드를 스탠다드 코드로 변환
  const SearchStdCode = async data => {
    try {
      await fetch(`${secret.drug_information_key1}/${data.barcode}/.json`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          data.StdCode = json.StdCode;
          data.ATCcode = json.ATCCode;
          data.PregnantGrade = json.PregnantGrade;
          data.PregnantNote = json.PregnantNote;
          data.ElderNote = json.ElderNote;
          data.ChildAge = json.ChildAge;
          data.ChildRange = json.ChildRange;
          data.ChildNote = json.ChildNote;
          data.MaxInjectDay = json.MaxInjectDay;
          data.MaxDayCapacity = json.MaxDayCapacity;

          SearchMoreData(data);
        });
    } catch (e) {
      spinner.stop();
      console.log('SearchStdCode function error(drug search by name');
    }
  };

  // 추가 약물 정보 검색
  const SearchMoreData = async data => {
    try {
      await fetch(`${secret.drug_information_key2}/${data.StdCode}/.json`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          data.CombTarget = json.CombTarget;
          data.CombNote = json.CombNote;
          data.CombCount = json.CombCount;
          data.EffectGroup = json.EffectGroup;
          data.EffectTarget = json.EffectTarget;
          data.DuplicationCount = json.DuplicationCount;

          dispatch(AddDrugInfo(data));
          const n_data = { [data.id]: data };
          dispatchDrugInfo({ ...drugInformation, ...n_data });
          spinner.stop();
        });
    } catch (e) {
      console.log(e.message);
      spinner.stop();
    }
  };

  // 약물 이름 길이 수정 함수
  function PharmNameset(data) {
    if (width < 600) {
      if (settingInfos.bigTextMode == true) {
        if (data.length >= 10) {
          return `${data.substring(0, 10)}..`;
        } else {
          return data;
        }
      } else {
        if (data.length >= 20) {
          return `${data.substring(0, 20)}..`;
        } else {
          return data;
        }
      }
    } else {
      return data;
    }
  }

  // 약물 누를시 알람 설정
  function PressDrugName(data) {
    SeqToBarCode(data.ITEM_SEQ);
  }

  // search drug name by call API function
  const SearchDrugName = async data => {
    try {
      await fetch(
        `${secret.search_drug_name_key}&item_name=${data}&spclty_pblc=의약품&order=Y&pageNo=1&numOfRows=100&type=json`,
      )
        .then(response => {
          return response.json();
        })
        .then(json => {
          return json.body.items;
        })
        .then(result => {
          spinner.stop();
          return setDrugNames(result);
        });
    } catch (e) {
      spinner.stop();
      return console.log('Error in Searching drug by name');
    }
  };

  // rendering start
  return (
    <Container>
      <SearchContainer>
        <TextInputBox
          onChangeText={setText}
          value={text}
          onSubmitEditing={() => {
            spinner.start();
            SearchDrugName(text);
          }}
          placeholder="약물명을 입력하세요."
        />
        <SearchButtonTouch
          onPress={() => {
            spinner.start();
            SearchDrugName(text);
          }}
        >
          <TextContainer>검색</TextContainer>
        </SearchButtonTouch>
      </SearchContainer>
      <ScrollContainer>
        {drugNames ? (
          drugNames.map(info => (
            <ContentBox
              style={{ height: settingInfos.bigTextMode ? 68 : 58 }}
              key={info.ITEM_SEQ}
              onPress={() => {
                PressDrugName(info);
              }}
            >
              <ContentText
                style={{ fontSize: settingInfos.bigTextMode ? 33 : 18 }}
              >
                {PharmNameset(EditPharmName(info.ITEM_NAME))}
              </ContentText>
            </ContentBox>
          ))
        ) : (
          <Text
            style={{
              color: 'red',
              fontSize: settingInfos.bigTextMode ? 33 : 18,
            }}
          >
            올바른 약물명을 입력하세요
          </Text>
        )}
      </ScrollContainer>
    </Container>
  );
}

export default DrugSearchByName;
