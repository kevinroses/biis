import { format } from "date-fns";

function getCurrentTime() {
  const currentTime = format(new Date(), "HH:mm");
  return currentTime;
}

export const currentTime = getCurrentTime();

export const INITIAL_STATE = {
  scheduleMonth: "",
  scheduleTime: currentTime ? currentTime : "",
  ampm: "pm",
};
export const scheduleReducer = (state, action) => {
  switch (action.type) {
    case "SET_SCHEDULE_MONTH":
      return {
        ...state,
        scheduleMonth: action.payload,
      };
    case "SET_SCHEDULE_TIME":
      return {
        ...state,
        scheduleTime: action.payload,
      };
    case "SET_AMPM":
      return {
        ...state,
        ampm: action.payload,
      };

    default:
      return state;
  }
};
