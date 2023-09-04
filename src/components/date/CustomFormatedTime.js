import { useSelector } from "react-redux";
import { format } from "date-fns";

const CustomFormatedTime = ({ date }) => {
  const { configData } = useSelector((state) => state.configData);
  let timeFormat = configData?.timeformat;
  
  const timeFormatString = timeFormat === "12" ? "hh:mm a" : "HH:mm";
  return format(new Date(date), timeFormatString);
};

export default CustomFormatedTime;
