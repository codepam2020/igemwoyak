import React, { useState, useContext } from 'react';
import { ProgressContext } from '../contexts/Progress';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';
import { Alert, Dimensions, Text } from 'react-native';
import secret from '../data/secret.json';
import { EditPharmName, EditPharmData } from '../utils';

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

function AddDrugByName({ navigation }) {
  const { spinner } = useContext(ProgressContext);
  const [text, setText] = useState('');
  const [drugNames, setDrugNames] = useState([]);
  const { bigTextMode, darkmode } = useSelector(state => {
    return {
      bigTextMode: state.settingInfo.bigTextMode,
      darkmode: state.settingInfo.darkmode,
    };
  });

  function timestamp() {
    var Now = new Date();
    Now.setHours(Now.getHours() + 9);
    return Now.toISOString().replace('T', ' ').substring(0, 19);
  }

  // ?????? ?????? ????????? ??????
  function PressDrugName(data) {
    SeqToBarCode(data.ITEM_SEQ);
  }

  // seq????????? ???????????? ??????
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
      spinner.stop();
      console.log('seq');
      Alert.alert('?????? ????????? ??????????????????');
    }
  };

  // ????????? ????????? ?????? ??????
  const SearchDrugByBarCode = async data => {
    try {
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
      Alert.alert('?????? ????????? ??????????????????');
    }
  };

  // ?????? ??????
  function CheckDrugAlert(data) {
    spinner.stop();
    Alert.alert(
      '?????? ????????? ?????????????????????????',
      `?????????: ${data.name}
    `,
      [
        {
          text: '?????????',
          onPress: () => {
            console.log('?????????');
          },
          style: 'cancel',
        },
        {
          text: '???',
          onPress: () => {
            spinner.start();
            SearchStdCode(data);
          },
        },
      ],
    );
  }

  // ???????????? ???????????? ????????? ??????
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
      console.log(e.message);
      Alert.alert('?????? ????????? ??????????????????');
    }
  };

  // ?????? ?????? ?????? ??????
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
          spinner.stop();
          navigation.navigate('AddDrugSetting', { data });
        });
    } catch (e) {
      spinner.stop();
      console.log(e.message);
      console.log('?????? ????????? ??????????????????');
    }
  };

  // ?????? ?????? ?????? ?????? ??????
  function PharmNameset(data) {
    if (width < 600) {
      if (bigTextMode == true) {
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

  // search drug name by call API function
  const SearchDrugName = async data => {
    try {
      await fetch(
        `${secret.search_drug_name_key}&item_name=${data}&spclty_pblc=?????????&order=Y&pageNo=1&numOfRows=100&type=json`,
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
          placeholder="???????????? ???????????????."
        />
        <SearchButtonTouch
          onPress={() => {
            spinner.start();
            SearchDrugName(text);
          }}
        >
          <TextContainer>??????</TextContainer>
        </SearchButtonTouch>
      </SearchContainer>
      <ScrollContainer>
        {drugNames ? (
          drugNames.map(info => (
            <ContentBox
              style={{ height: bigTextMode ? 70 : 60 }}
              key={info.ITEM_SEQ}
              onPress={() => {
                spinner.start();
                PressDrugName(info);
              }}
            >
              <ContentText style={{ fontSize: bigTextMode ? 35 : 20 }}>
                {PharmNameset(EditPharmName(info.ITEM_NAME))}
              </ContentText>
            </ContentBox>
          ))
        ) : (
          <Text style={{ color: 'red', fontSize: bigTextMode ? 30 : 20 }}>
            ????????? ???????????? ???????????????
          </Text>
        )}
      </ScrollContainer>
    </Container>
  );
}

export default AddDrugByName;
