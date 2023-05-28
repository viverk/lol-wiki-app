const initialState = [];

const championReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_CHAMPION":
      return [...state, action.payload];
    case "REMOVE_CHAMPION":
      return state.filter((champion) => champion.id !== action.payload.id);
    case "INIT_CHAMPIONS":
      return action.payload;
    default:
      return state;
  }
};

export default championReducer;
