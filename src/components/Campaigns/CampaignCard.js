import React from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { CustomPaperCard } from "../../styled-components/CustomCards.style";
import CustomImageContainer from "../CustomImageContainer";
import { Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { useSelector } from "react-redux";
import { getModuleId } from "../../helper-functions/getModuleId";
import { useRouter } from "next/router";
import { format } from "date-fns"; // Importa format de date-fns

const CampaignCard = ({ data }) => {
  const router = useRouter();
  const { configData } = useSelector((state) => state.configData);

  const theme = useTheme();
  const camImage = `${configData?.base_urls?.campaign_image_url}/${data?.image}`;

  const handleClick = (campId) => {
    router.push(
      {
        pathname: "/campaigns/[id]",
        query: { id: `${campId}-${getModuleId()}` },
      },
      undefined,
      { shallow: true }
    );
  };

  const formatDate = (date) => {
    return format(new Date(date), "MMMM do yyyy");
  };

  const formatTime = (time) => {
    return format(new Date(`2000-01-01T${time}`), "hh:mm a");
  };

  return (
    <CustomStackFullWidth sx={{ height: "100%", cursor: "pointer" }}>
      <CustomPaperCard>
        <CustomStackFullWidth spacing={1} onClick={() => handleClick(data?.id)}>
          <CustomImageContainer src={camImage} height="200px" />
          <Typography
            variant="h5"
            textAlign="left"
            fontWeight="600"
            color={theme.palette.primary.main}
            textTransform="capitalize"
          >
            {data?.title}
          </Typography>
          <Typography textAlign="left">{data?.description}</Typography>
          <Typography textAlign="left" fontWeight="500" variant="subtitle2">
            {"Start Date"}: {formatDate(data?.available_date_starts)}
          </Typography>
          <Typography textAlign="left" fontWeight="500" variant="subtitle2">
            {"Start Date"}: {formatDate(data?.available_date_ends)}
          </Typography>
          <Typography variant="subtitle2" textAlign="left">
            {t("Daily time: ")}
            <Typography
              component="span"
              fontWeight="600"
              variant="h6"
              color={theme.palette.primary.main}
            >
              {formatTime(data?.start_time)} - {formatTime(data?.end_time)}
            </Typography>
          </Typography>
        </CustomStackFullWidth>
      </CustomPaperCard>
    </CustomStackFullWidth>
  );
};

export default CampaignCard;
