import { AddPreDrugInfo } from '../actions';
import secret from '../data/secret.json';
import { useDispatch } from 'react-redux';

const ScanPrescription = async data => {
  const dispatch = useDispatch;
  try {
    await fetch(
      `http://apis.data.go.kr/1471057/MdcinPrductPrmisnInfoService1/getMdcinPrductItem?serviceKey=${secret.pharm_service_key}&bar_code=${data}&type=json`,
    )
      .then(response => {
        console.log('hi');
        return response.json;
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

        SearchStdCode(drugInfo);
      });
  } catch (e) {
    console.log('hi');
  }
};

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

        dispatch(AddPreDrugInfo(data));
      });
  } catch (e) {
    console.log(e.message);
    console.log('SearchMoreData function error');
  }
};

export default ScanPrescription;
