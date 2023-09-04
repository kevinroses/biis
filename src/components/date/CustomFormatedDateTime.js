import React from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const CustomFormatedDateTime = ({ date }) => {
  const { configData } = useSelector((state) => state.configData);
  let timeFormat = configData?.timeformat;

  if (timeFormat === "12") {
    return format(new Date(date), "PPP hh:mm a");
  } else {
    return format(new Date(date), "PPP HH:mm");
  }
};

export default CustomFormatedDateTime;
