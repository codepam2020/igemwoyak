// 바코드 정보로 약물 검색
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

// 약물 확인
function CheckDrugAlert(data) {
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
          setScanned(false);
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
    console.log('SearchStdCode function error');
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

        BarCodeToINGRCode(data);
      });
  } catch (e) {
    console.log(e.message);
    console.log('SearchMoreData function error');
  }
};

// 주성분코드 검색
const BarCodeToINGRCode = async data => {
  await fetch(`${secret.drug_ingr_code_key}/${data.barcode}/.json`)
    .then(response => {
      return response.json();
    })
    .then(json => {
      data.INGRCode = json.INGRCode;

      dispatch(AddDrugInfo(data));
    });
};
