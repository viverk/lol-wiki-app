// championActions.js

export const addChampion = (champion) => {
  return {
    type: "ADD_CHAMPION",
    payload: champion,
  };
};

export const removeChampion = (champion) => {
  return {
    type: "REMOVE_CHAMPION",
    payload: champion,
  };
};

export const initChampions = (champions) => {
  return {
    type: "INIT_CHAMPIONS",
    payload: champions,
  };
};
