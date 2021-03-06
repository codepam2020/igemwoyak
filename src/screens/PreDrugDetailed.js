import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Image,
  Dimensions,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { AddDrugInfo } from '../actions';
import styled from 'styled-components/native';
import * as Speech from 'expo-speech';
import { FontAwesome5 } from '@expo/vector-icons';
import { dark, light } from '../theme';
import secret from '../data/secret.json';
import { ProgressContext } from '../contexts/Progress';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;

const Container = styled.SafeAreaView`
  justify-content: flex-start;
  padding-top: 5px
  flex: 1;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding-left: 15px;
  padding-right: 15px
`;

const SemiContainer = styled.View`
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding-bottom: 10px;
`;

const List = styled.ScrollView`
  width: ${width - 20}px
  padding: 15px 10px;
  margin-top: 0;
  padding-bottom: 30px;
`;

const Content = styled.Text`
  font-size: 18px
  color: ${({ theme }) => theme.text};
  font-family: ${({ theme }) => theme.font_medium};
`;

const SemiTitle = styled.Text`
  flex:1
  font-size: 25px;
  font-family: ${({ theme }) => theme.font_bold}
  align-self: flex-start
  color: ${({ theme }) => theme.semititle};
`;

const ButtonText = styled.Text`
  font-size: 20px;
  font-family: ${({ theme }) => theme.font_bold};
`;

function PreDrugDetailed({ route, navigation }) {
  const [preDrugInformation, setPreDrugInformation] = useState({});
  const [drugInformation, setDrugInformation] = useState({});
  const [settingInfos, setSettingInfos] = useState({});
  const { spinner } = useContext(ProgressContext);
  const [url, setUrl] = useState('');
  const [showDUR, setShowDUR] = useState(false);
  const [showCaution, setShowCaution] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showHowToStore, setShowHowToStore] = useState(false);
  const [showEffect, setShowEffect] = useState(false);
  const [showINGR, setShowINGR] = useState(false);
  const [showMethod, setShowMethod] = useState(false);
  const { drugInfo, CombList } = route.params;

  const { setting } = useSelector(state => {
    return {
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

  async function dispatchDrugInfo(data) {
    try {
      await AsyncStorage.setItem('@test2349873', JSON.stringify(data));
    } catch (e) {
      console.log(e.message);
    }
  }

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

  useEffect(() => {
    loadSettingInfos();
    loadDrugInfo();
  }, []);

  var CombListCaution =
    CombList.filter(e => (e ? e.indexOf(drugInfo.StdCode) !== -1 : false))
      .length > 1;

  const theme = settingInfos.darkmode ? dark : light;

  // Search drug image from seq code
  const SearchDrugImage = async seqcode => {
    try {
      await fetch(
        `http://apis.data.go.kr/1470000/MdcinGrnIdntfcInfoService/getMdcinGrnIdntfcInfoList?serviceKey=${secret.image_service_key}&item_seq=${seqcode}&pageNo=1&numOfRows=3&type=json`,
      )
        .then(response => {
          return response.json();
        })
        .then(myJson => {
          return setUrl(myJson.body.items[0].ITEM_IMAGE);
        });
    } catch (e) {
      console.log(e.message);
      return setUrl('');
    }
  };
  useEffect(() => {
    SearchDrugImage(drugInfo.seqcode);
  });

  // ?????? ?????? ??????
  useEffect(() => {
    drugInfo.PregnantGrade ||
    drugInfo.ElderNote ||
    drugInfo.ChildAge ||
    CombListCaution
      ? Alert.alert(
          '????????? ???????????????!',
          '????????? ????????? ????????? ???????????????. ????????? ????????? ????????? ???????????????.',
        )
      : null;
  }, []);

  const styles = StyleSheet.create({
    text: {
      fontSize: settingInfos.bigTextMode ? 33 : 18,
    },
    semiTitle: {
      fontSize: settingInfos.bigTextMode ? 38 : 23,
    },
    icon: {
      color: theme.text,
      fontSize: 22,
    },
  });

  function PushModiButton() {
    navigation.navigate('PreDrugModi', { drugInfo });
  }

  const dispatch = useDispatch();

  function pushDrugButton() {
    drugInfo.id = Date.now().toString();
    drugInfo.time = Date().toString();
    dispatch(AddDrugInfo(drugInfo));
    const n_data = { [drugInfo.id]: drugInfo };
    dispatchDrugInfo({ ...drugInformation, ...n_data });
  }

  return (
    <Container>
      <List>
        {url !== '' ? (
          <Image
            style={{
              height: (width * 0.8) / 1.832157,
              width: width * 0.8,
              alignSelf: 'center',
              marginBottom: 30,
            }}
            source={{
              uri: url,
            }}
          />
        ) : null}
        {drugInfo.PregnantGrade || drugInfo.ElderNote || drugInfo.ChildAge ? (
          <SemiTitle style={[styles.semiTitle, { color: theme.caution }]}>
            ?????? ??????!
          </SemiTitle>
        ) : null}

        {drugInfo.PregnantGrade ? ( // ???????????? ?????? ??????
          <Content style={[styles.text, { color: theme.caution }]}>
            {`?????? ?????? ??????!\n\n?????? ?????? ??????: ${drugInfo.PregnantGrade}\n${
              drugInfo.PregnantNote == 'nan' ? null : drugInfo.PregnantNote
            }`}
          </Content>
        ) : null}
        {drugInfo.ElderNote ? ( // ????????? ?????? ?????? ??????
          drugInfo.ElderNote == 'nan' ? (
            <Content style={[styles.text, { color: theme.caution }]}>
              ????????? ?????? ??????!
            </Content>
          ) : (
            <Content style={[styles.text, { color: theme.caution }]}>
              {`????????? ?????? ??????!\n\n${drugInfo.ElderNote}`}
            </Content>
          )
        ) : null}
        {drugInfo.ChildAge ? (
          <Content style={[styles.text, { color: theme.caution }]}>
            {`?????? ????????? ?????? ??????!\n${drugInfo.ChildAge} ${
              drugInfo.ChildRange
            } ????????? ???????????????\n${
              drugInfo.ChildNote == 'nan' ? '' : drugInfo.ChildNote
            }`}
          </Content>
        ) : null}
        {CombListCaution ? (
          <Content style={[styles.text, { color: theme.caution }]}>
            {`?????? ?????? ?????? ??????!\n${
              drugInfo.CombNote == 'nan' ? '' : drugInfo.CombNote
            }`}
          </Content>
        ) : null}
        <SemiContainer>
          <TouchableOpacity
            onPress={PushModiButton}
            style={{
              borderRadius: 25,
              backgroundColor: 'pink',
              justifyContent: 'center',
              alignItems: 'center',
              width: 190,
            }}
          >
            <ButtonText>???????????? ?????????</ButtonText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pushDrugButton}
            style={{
              borderRadius: 25,
              backgroundColor: 'pink',
              justifyContent: 'center',
              alignItems: 'center',
              width: 90,

              marginLeft: 50,
            }}
          >
            <ButtonText>??????</ButtonText>
          </TouchableOpacity>
        </SemiContainer>

        <SemiTitle style={styles.semiTitle}>?????????</SemiTitle>
        <Content style={styles.text}>{drugInfo.name}</Content>
        <SemiContainer>
          <TouchableOpacity
            onPress={() => {
              setShowMethod(prev => !prev);
            }}
            delayLongPress={300}
            onLongPress={() => {
              Vibration.vibrate(20);
              Speech.speak(drugInfo.howMuch, {
                pitch: 1,
                rate: 0.9,
              });
            }}
            style={{ paddingLeft: 0, marginLeft: 0, flex: 1 }}
          >
            <SemiTitle style={styles.semiTitle}>???????????? ??? ?????????</SemiTitle>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingRight: 4,
              paddingLeft: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setShowMethod(prev => !prev);
            }}
          >
            <FontAwesome5
              name={showMethod ? 'chevron-up' : 'chevron-down'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </SemiContainer>
        {showMethod ? (
          <SemiContainer
            style={{
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            <Content style={styles.text}>
              {drugInfo.howMuch.substring(6)}
            </Content>
          </SemiContainer>
        ) : null}

        <SemiContainer>
          <TouchableOpacity
            onPress={() => {
              setShowDUR(prev => !prev);
            }}
            delayLongPress={300}
            onLongPress={() => {
              Vibration.vibrate(20);
              Speech.speak(drugInfo.d, {
                pitch: 1,
                rate: 0.9,
              });
            }}
            style={{ paddingLeft: 0, marginLeft: 0, flex: 1 }}
          >
            <SemiTitle style={styles.semiTitle}>?????? DUR ??????</SemiTitle>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              // ?????? DUR??????
              paddingRight: 5,
              paddingLeft: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setShowDUR(prev => !prev);
            }}
          >
            <FontAwesome5
              name={showDUR ? 'chevron-up' : 'chevron-down'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </SemiContainer>
        {showDUR ? (
          <SemiContainer
            style={{
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            <Content style={styles.text}>?????????: {drugInfo.brandName}</Content>
            <Content style={styles.text}>?????????: {drugInfo.barcode}</Content>
            <Content style={styles.text}>
              ?????? ????????????: {drugInfo.seqcode}
            </Content>
            {drugInfo.stdcode == '' ? null : (
              <Content style={styles.text}>
                ????????? ??????: {drugInfo.StdCode}
              </Content>
            )}
            {drugInfo.ATCcode === 'nan' ? null : (
              <Content style={styles.text}>
                ATC ??????: {drugInfo.ATCcode}
              </Content>
            )}
            {drugInfo.INGRCode == null ? null : (
              <Content style={styles.text}>
                ????????? ??????: {drugInfo.INGRCode}
              </Content>
            )}
          </SemiContainer>
        ) : null}

        <SemiContainer>
          <TouchableOpacity
            onPress={() => {
              setShowUpdate(prev => !prev);
            }}
            delayLongPress={300}
            onLongPress={() => {
              Vibration.vibrate(20);
              Speech.speak(drugInfo.updateInfo, {
                pitch: 1,
                rate: 0.9,
              });
            }}
            style={{ paddingLeft: 0, marginLeft: 0, flex: 1 }}
          >
            <SemiTitle style={styles.semiTitle}>
              ?????? ?????? ???????????? ??????
            </SemiTitle>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingRight: 4,
              paddingLeft: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setShowUpdate(prev => !prev);
            }}
          >
            <FontAwesome5
              name={showUpdate ? 'chevron-up' : 'chevron-down'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </SemiContainer>
        {showUpdate ? (
          <SemiContainer
            style={{
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            <Content style={styles.text}>{drugInfo.updateInfo}</Content>
          </SemiContainer>
        ) : null}

        <SemiContainer>
          <TouchableOpacity
            onPress={() => {
              setShowHowToStore(prev => !prev);
            }}
            delayLongPress={300}
            onLongPress={() => {
              Vibration.vibrate(20);
              Speech.speak(drugInfo.howToStore, {
                pitch: 1,
                rate: 0.9,
              });
            }}
            style={{ paddingLeft: 0, marginLeft: 0, flex: 1 }}
          >
            <SemiTitle style={styles.semiTitle}>?????? ?????? ??????</SemiTitle>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingRight: 4,
              paddingLeft: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setShowHowToStore(prev => !prev);
            }}
          >
            <FontAwesome5
              name={showHowToStore ? 'chevron-up' : 'chevron-down'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </SemiContainer>
        {showHowToStore ? (
          <SemiContainer
            style={{
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            <Content style={styles.text}>{drugInfo.howToStore}</Content>
          </SemiContainer>
        ) : null}

        <SemiContainer>
          <TouchableOpacity
            onPress={() => {
              setShowCaution(prev => !prev);
            }}
            delayLongPress={300}
            onLongPress={() => {
              Vibration.vibrate(20);
              Speech.speak(drugInfo.caution, {
                pitch: 1,
                rate: 0.9,
              });
            }}
            style={{ paddingLeft: 0, marginLeft: 0, flex: 1 }}
          >
            <SemiTitle style={styles.semiTitle}>????????? ????????????</SemiTitle>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingRight: 4,
              paddingLeft: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setShowCaution(prev => !prev);
            }}
          >
            <FontAwesome5
              name={showCaution ? 'chevron-up' : 'chevron-down'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </SemiContainer>
        {showCaution ? (
          <SemiContainer
            style={{
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            <Content style={styles.text}>{drugInfo.caution}</Content>
          </SemiContainer>
        ) : null}

        <SemiContainer>
          <TouchableOpacity
            onPress={() => {
              setShowEffect(prev => !prev);
            }}
            delayLongPress={300}
            onLongPress={() => {
              Vibration.vibrate(20);
              Speech.speak(drugInfo.effect.substring(6), {
                pitch: 1,
                rate: 0.9,
              });
            }}
            style={{ paddingLeft: 0, marginLeft: 0, flex: 1 }}
          >
            <SemiTitle style={styles.semiTitle}>?????? ??? ??????</SemiTitle>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingRight: 4,
              paddingLeft: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setShowEffect(prev => !prev);
            }}
          >
            <FontAwesome5
              name={showEffect ? 'chevron-up' : 'chevron-down'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </SemiContainer>
        {showEffect ? (
          <SemiContainer
            style={{
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            <Content style={styles.text}>
              {drugInfo.effect.substring(6)}
            </Content>
          </SemiContainer>
        ) : null}

        <SemiContainer>
          <TouchableOpacity
            onPress={() => {
              setShowINGR(prev => !prev);
            }}
            delayLongPress={300}
            onLongPress={() => {
              Vibration.vibrate(20);
              Speech.speak(drugInfo.mainINGR, {
                pitch: 1,
                rate: 0.9,
              });
            }}
            style={{ paddingLeft: 0, marginLeft: 0, flex: 1 }}
          >
            <SemiTitle style={styles.semiTitle}>?????????</SemiTitle>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingRight: 4,
              paddingLeft: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setShowINGR(prev => !prev);
            }}
          >
            <FontAwesome5
              name={showINGR ? 'chevron-up' : 'chevron-down'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </SemiContainer>
        {showINGR ? (
          <SemiContainer
            style={{
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            <Content style={styles.text}>{drugInfo.mainINGR}</Content>
          </SemiContainer>
        ) : null}
      </List>
    </Container>
  );
}

export default PreDrugDetailed;
