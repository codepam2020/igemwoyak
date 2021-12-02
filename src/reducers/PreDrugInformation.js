function PreDrugInformation(state = [], action) {
  switch (action.type) {
    case 'ADD_PREDRUGINFO':
      return [action.preDrugInfo, ...state];

    case 'REMOVE_PREDRUGINFO':
      nextState = state.filter(drugInfo => drugInfo.id !== action.id);
      return nextState;

    default:
      return state;
  }
}

export { PreDrugInformation };
