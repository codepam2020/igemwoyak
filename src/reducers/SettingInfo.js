function SettingInfo(state = initialState, action) {
  switch (action.type) {
    case 'DARKMODE':
      return {
        ...state,
        darkmode: !state.darkmode,
      };

    case 'SCANVIBRATION':
      return {
        ...state,
        vibration: !state.vibration,
      };

    case 'BIGTEXTMODEACTION':
      return {
        ...state,
        bigTextMode: !state.bigTextMode,
      };

    case 'CHILDCAUTIONACTION':
      return {
        ...state,
        ChildCaution: !state.ChildCaution,
      };

    case 'ELDERCAUTIONACTION':
      return {
        ...state,
        ElderCaution: !state.ElderCaution,
      };

    case 'PREGNANTCAUTIONACTION':
      return {
        ...state,
        PregnantCaution: !state.PregnantCaution,
      };

    case 'COMBCAUTIONACTION':
      return {
        ...state,
        CombCaution: !state.CombCaution,
      };

    default:
      return state;
  }
}

const initialState = {
  darkmode: false,
  vibration: true,
  bigTextMode: false,
  ChildCaution: true,
  ElderCaution: true,
  PregnantCaution: true,
  CombCaution: true,
};
export { SettingInfo, initialState };
