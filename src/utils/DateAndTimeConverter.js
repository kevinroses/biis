import moment from "moment";

export const dateAndTimeConverter = {
  dateWithTime: function (value, time) {
    const formatted12Time = moment(value, "YYYY-MM-DD HH:mm").format("hh:mm a");
    const formatted24Time = moment(value, "YYYY-MM-DD HH:mm").format("HH:mm");
    return time === "12" ? formatted12Time : formatted24Time;
  },
};
