import { createStore, combineReducers } from 'redux';
import { DrugInfomation } from './reducers/DrugInformation';
import { SettingInfo } from './reducers/SettingInfo';
import { PreDrugInformation } from './reducers/PreDrugInformation';

const reducers = combineReducers({
  drugInfo: DrugInfomation,
  settingInfo: SettingInfo,
  preDrugInfo: PreDrugInformation,
});

const store = createStore(reducers);

export default store;
