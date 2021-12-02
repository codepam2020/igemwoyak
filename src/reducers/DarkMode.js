function DarkMode(state = initialState, action) {
  switch (action.type) {
    case "DARKMODE":
      return {
        ...state,
        darkmode: !state.darkmode,
      };
    default:
      return state;
  }
}

const initialState = {
  darkmode: false,
};
export { DarkMode, initialState };
