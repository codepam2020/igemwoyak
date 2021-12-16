import React, { useState, useEffect, useContext } from 'react';
import AppLoading from 'expo-app-loading';
import { Text, Alert, Vibration, Dimensions, StyleSheet } from 'react-native';
import { ProgressContext } from '../contexts/Progress';
import styled from 'styled-components/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import ResetButton from '../components/ResetButton';
import { useDispatch, useSelector } from 'react-redux';
import { AddDrugInfo, AddPreDrugInfo } from '../actions';
import OverlayView from '../components/OverlayView';
import { EditPharmData, EditPharmName } from '../utils';
import secret from '../data/secret.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
`;

function timestamp() {
  var Now = new Date();
  Now.setHours(Now.getHours() + 9);
  return Now.toISOString().replace('T', ' ').substring(0, 19);
}

///function Starts
function ScanQRcode({ navigation }) {
  const [preDrugInformation, setPreDrugInformation] = useState({});
  const [drugInformation, setDrugInformation] = useState({});
  const { spinner } = useContext(ProgressContext);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const width = Dimensions.get('window').width;
  const dispatch = useDispatch();

  const { vibration } = useSelector(state => {
    return {
      vibration: state.settingInfo.vibration,
    };
  });

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
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  ///스캔 후 바코드를 수정
  const handleBarCodeScanned = ({ type, data }) => {
    Vibration.vibrate(vibration ? 80 : 0);
    spinner.start();
    if (data.substring(0, 4) == 'many') {
      var count = parseInt(data.substring(4, 6));
      var PreDrugDays = parseInt(data.substring(10, 12));

      var code = data;

      for (i = 1; i < count + 1; i++) {
        var barcode = code.substring(13 * i, 13 * (i + 1));
        SearchPreDrugByBarCode(barcode, PreDrugDays);
      }
      Alert.alert('약물이 추가되었습니다');
      spinner.stop();
      setScanned(true);
    } else {
      var index = data.indexOf('880');
      var editedData = data.substring(index, index + 13);
      SearchDrugByBarCode(editedData);

      console.log(
        `@@@ScanQRcode screen data@@@\nbarcode type: ${type}\nbarcode data:${editedData}\n------------------`,
      );
      setScanned(true);
    }
  };

  // 수정된 바코드로 정보들 수집
  const SearchDrugByBarCode = async editedData => {
    try {
      await fetch(
        `http://apis.data.go.kr/1471057/MdcinPrductPrmisnInfoService1/getMdcinPrductItem?serviceKey=${secret.pharm_service_key}&bar_code=${editedData}&type=json`,
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
            barcode: editedData,
            seqcode: myJson.body.items[0].ITEM_SEQ,
            effect: EditPharmData(myJson.body.items[0].EE_DOC_DATA),
            caution: EditPharmData(myJson.body.items[0].NB_DOC_DATA),
            brandName: myJson.body.items[0].ENTP_NAME,
            updateInfo: myJson.body.items[0].GBN_NAME,
          };

          return CheckDrugAlert(drugInfo);
        });
    } catch (e) {
      console.log(e.message);
      spinner.stop();
      Alert.alert(
        '스캔 오류!',
        `의약품이 아니거나 국내에서 판매되는 의약품이 아닙니다.\n카메라가 흔들릴시 잘못 인식 할 수 있으므로 다시 스캔하세요.`,
        [
          {
            text: '다시 스캔하기',
            onPress: () => {
              setScanned(false);
            },
          },
        ],
      );
    }
  };

  // 수집된 정보로 알림창 생성
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
            console.log('Cancel Pressed'), setScanned(false);
          },
          style: 'cancel',
        },
        {
          text: '네',
          onPress: () => {
            console.log('OK Pressed');
            console.log(
              `drug name: ${data.name}\ndrug barcode: ${data.barcode}\ndrug seqcode: ${data.seqcode}`,
            );
            SearchStdCode(data);
            spinner.start();
            setScanned(false);
          },
        },
      ],
    );
  }

  // BarCode를 StdCode로 변환
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
      console.log('SearchStdCode function error');
    }
  };

  // 추가 데이터들 검색
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
          dispatch(AddDrugInfo(data));
        });
    } catch (e) {
      spinner.stop();
      console.log(e.message);
      console.log('SearchMoreData function error');
    }
  };

  // 처방전 스캔
  const SearchPreDrugByBarCode = async (barcode, PreDrugDays) => {
    try {
      await fetch(
        `http://apis.data.go.kr/1471057/MdcinPrductPrmisnInfoService1/getMdcinPrductItem?serviceKey=${secret.pharm_service_key}&bar_code=${barcode}&type=json`,
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
            barcode: barcode,
            seqcode: myJson.body.items[0].ITEM_SEQ,
            effect: EditPharmData(myJson.body.items[0].EE_DOC_DATA),
            caution: EditPharmData(myJson.body.items[0].NB_DOC_DATA),
            brandName: myJson.body.items[0].ENTP_NAME,
            updateInfo: myJson.body.items[0].GBN_NAME,
            PreDrugDays: `${PreDrugDays}일`,
          };

          return SearchPreDrugStdCode(drugInfo);
        });
    } catch (e) {
      console.log(e.message);
    }
  };

  const SearchPreDrugStdCode = async data => {
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

          SearchMorePreDrugData(data);
        });
    } catch (e) {
      console.log('SearchStdCode function error');
    }
  };

  const SearchMorePreDrugData = async data => {
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

          dispatch(AddPreDrugInfo(data));
        });
    } catch (e) {
      console.log(e.message);
      console.log('SearchMoreData function error');
    }
  };

  // 처방전 스캔시 함수

  if (hasPermission === null) {
    return <Text>카메라 권한 요청중입니다...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  /// Rendering Start
  return (
    <Container>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{
          width: width - 40,
          justifyContent: 'flex-start',
          alignItems: 'center',
          flex: 1,
        }}
      />
      <OverlayView />
      {scanned && (
        <ResetButton onPress={() => setScanned(false)} title="다시스캔" />
      )}
    </Container>
  );
}

export default ScanQRcode;

///many##days###@8806444455555
