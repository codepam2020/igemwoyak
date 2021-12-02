function DrugInfomation(state = [], action) {
  switch (action.type) {
    case 'ADD_DRUGINFO':
      return [action.drugInfo, ...state];

    case 'REMOVE_DRUGINFO':
      nextState = state.filter(drugInfo => drugInfo.id !== action.id);
      return nextState;

    default:
      return state;
  }
}

export { DrugInfomation };
