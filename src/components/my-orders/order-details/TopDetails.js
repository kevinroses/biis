import React, { useEffect, useState } from "react";
import {
  alpha,
  Button,
  Grid,
  Skeleton,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { HeadingBox, OrderStatusButton, orderStatusButton } from "../myorders.style";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { CustomTypography } from "../../landing-page/hero-section/HeroSection.style";
import CustomFormatedDateTime from "../../date/CustomFormatedDateTime";
import { Stack } from "@mui/system";
import Divider from "@mui/material/Divider";
import CustomDivider from "../../CustomDivider";
import TrackSvg from "../assets/TrackSvg";
import Link from "next/link";
import { PrimaryButton } from "../../Map/map.style";
import { useQuery } from "react-query";
import { GoogleApi } from "../../../api-manage/hooks/react-query/googleApi";
import DigitalPaymentManage from "./DigitalPaymentManage";
import CustomModal from "../../modal";
import CancelOrder from "./CenacelOrder";
import usePostOrderCancel from "../../../api-manage/hooks/react-query/order/usePostOrderCancel";
import toast from "react-hot-toast";
import { useGetOrderCancelReason } from "../../../api-manage/hooks/react-query/order/useGetOrderCancelReason";
import { onErrorResponse } from "../../../api-manage/api-error-response/ErrorResponses";
import PaymentUpdate from "./other-order/PaymentUpdate";
import { format, differenceInMinutes } from 'date-fns';

const TopDetails = (props) => {
  const {
    data,
    trackData,
    currentTab,
    configData,
    id,
    openModal,
    setOpenModal,
    refetchOrderDetails,
    refetchTrackData,
    dataIsLoading,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();

  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [cancelOpenModal, setCancelOpenModal] = useState(false);
  const [openModalForPayment, setModalOpenForPayment] = useState();
  const [cancelReason, setCancelReason] = useState(null);

  const buttonBackgroundColor = () => {
    if (trackData?.order_status === "pending") {
      return theme.palette.info.main;
    }
    if (trackData?.order_status === "confirmed") {
      return theme.palette.footer.inputButtonHover;
    }
    if (trackData?.order_status === "processing") {
      return theme.palette.warning.dark;
    }
    if (trackData?.order_status === "delivered") {
      return theme.palette.primary.main;
    }
    if (trackData?.order_status === "canceled") {
      return theme.palette.error.main;
    }
    if (trackData?.order_status === "refund_requested") {
      return theme.palette.error.main;
    }
  };
  
  const fontColor = () => {
    if (trackData?.order_status === "pending") {
      return theme.palette.info.main;
    }
    if (trackData?.order_status === "processing") {
      return theme.palette.warning.dark;
    }
    if (trackData?.order_status === "delivered") {
      return theme.palette.primary.main;
    }
    if (trackData?.order_status === "canceled") {
      return theme.palette.error.main;
    }
  };

  const currentLatLng = JSON.parse(
    window.localStorage.getItem("currentLatLng")
  );

  const { data: zoneData } = useQuery(
    ["zoneId", location],
    async () => GoogleApi.getZoneId(currentLatLng),
    {
      retry: 1,
    }
  );

  const { data: cancelReasonsData, refetch } = useGetOrderCancelReason();
  
  useEffect(() => {
    refetch().then();
  }, []);

  const { mutate: orderCancelMutation, isLoading: orderLoading } =
    usePostOrderCancel();

  const handleOnSuccess = () => {
    if (!cancelReason) {
      toast.error("Please select a cancellation reason");
    } else {
      const handleSuccess = (response) => {
        refetchOrderDetails();
        refetchTrackData();
        setCancelOpenModal(false);
        toast.success(response.message);
      };
      const formData = {
        order_id: id,
        reason: cancelReason,
        _method: "put",
      };
      orderCancelMutation(formData, {
        onSuccess: handleSuccess,
        onError: onErrorResponse,
      });
    }
  };

  const today = new Date();

  const handleTime = () => {
    const minutesDiff = differenceInMinutes(today, new Date(trackData?.schedule_at || trackData?.created_at));
    if (minutesDiff > 5) {
      return `${minutesDiff - 5} - ${minutesDiff} `;
    } else {
      return `1-5`;
    }
  };

  return (
    <CustomStackFullWidth
      alignItems="center"
      justifyContent="space-between"
      direction="row"
      padding={{
        xs: "0px 0px 5px 0px",
        sm: "30px 20px 20px 25px",
        md: "30px 20px 20px 25px",
      }}
    >
      <Stack spacing={{ xs: 1, md: 1 }}>
        {dataIsLoading ? (
          <Skeleton variant="text" width="150px" />
        ) : (
          <Typography fontSize={{ xs: "12px", md: "16px" }} fontWeight="600">
            {t("Order ID:")}
            <Typography
              component="span"
              fontSize={{ xs: "12px", md: "16px" }}
              fontWeight="600"
              marginLeft="5px"
            >
              {data?.[0]?.order_id ? data?.[0]?.order_id : data?.id}
            </Typography>
            <Typography
              component="span"
              fontSize="12px"
              sx={{
                textTransform: "capitalize",
                padding: "4px",
                marginLeft: "15px",
                borderRadius: "3px",
                backgroundColor: buttonBackgroundColor(),
                color: (theme) => theme.palette.whiteContainer.main,
                fontWeight: "600",
              }}
            >
              {trackData?.order_status.replace("_", " ")}
            </Typography>
          </Typography>
        )}

        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={0.5}
        >
          <Typography
            fontSize={{ xs: "10px", md: "12px" }}
            fontWeight="600"
            color={theme.palette.neutral[500]}
            marginRight="1rem"
          >
            {t("Order date:")}
            <Typography
              component="span"
              fontSize={{ xs: "10px", md: "12px" }}
              fontWeight="500"
              marginLeft="5px"
              color={theme.palette.neutral[600]}
            >
              {format(new Date(trackData?.created_at), "dd MMM, yyyy")}
            </Typography>
          </Typography>

          {trackData?.module_type === "food" && (
            <Stack
              direction="row"
              borderLeft={!isSmall && `2px solid ${theme.palette.neutral[400]}`}
              paddingLeft={!isSmall && "1rem"}
              alignItems="center"
              spacing={1}
            >
              {" "}
              <TrackSvg />
              <Typography
                color={theme.palette.primary.main}
                fontSize={{ xs: "10px", md: "12px" }}
                fontWeight="500"
              >
                {t("Estimated delivery:")}{" "}
                <Typography
                  fontSize={{ xs: "10px", md: "12px" }}
                  fontWeight="500"
                  component="span"
                >
                  {handleTime()}
                </Typography>
                <Typography
                  color="primary"
                  fontSize={{ xs: "10px", md: "12px" }}
                  fontWeight="500"
                >
                  {t("min")}
                </Typography>
              </Typography>
            </Stack>
          )}
        </Stack>
        {configData?.order_delivery_verification ? (
          <Typography
            fontSize={{ xs: "10px", md: "14px" }}
            fontWeight="600"
            color={theme.palette.primary.main}
          >
            <Typography
              fontSize={{ xs: "10px", md: "14px" }}
              fontWeight="600"
              color={theme.palette.neutral[500]}
              component="span"
            >
              {t("Order OTP")}:{" "}
            </Typography>
            {trackData?.otp}
          </Typography>
        ) : null}
      </Stack>

      {trackData?.order_status === "refund_requested" && trackData?.refund && (
        <Stack>
          <OrderStatusButton
            background={
              trackData?.refund?.refund_status === "pending"
                ? theme.palette.info.main
                : theme.palette.error.main
            }
          >
            {trackData?.refund?.refund_status}
          </OrderStatusButton>
        </Stack>
      )}
      {trackData?.order_status === "refund_requested" &&
        trackData?.refund_cancellation_note && (
          <Stack>
            <OrderStatusButton
              background={alpha(theme.palette.error.light, 0.3)}
              onClick={() => setOpenModal(true)}
            >
              {trackData?.refund_cancellation_note}
            </OrderStatusButton>
          </Stack>
        )}

      {data &&
        !data?.[0]?.item_campaign_id &&
        trackData &&
        trackData?.order_status === "delivered" && (
          <Stack direction="row" spacing={0.5}>
            <Link href={`/rate-and-review/${id}`}>
              <Button
                variant="outlined"
                background={theme.palette.error.light}
                sx={{
                  [theme.breakpoints.down("md")]: {
                    padding: "5px 5px",
                    fontSize: "10px",
                  },
                }}
              >
                {" "}
                {isSmall ? t("review") : t("Give a review")}
              </Button>
            </Link>
            {configData?.refund_active_status && (
              <OrderStatusButton
                background={theme.palette.error.light}
                onClick={() => setOpenModal(true)}
              >
                {isSmall ? t("Refund") : t("Refund Request")}
              </OrderStatusButton>
            )}
          </Stack>
        )}
      {trackData &&
      trackData?.payment_method === "digital_payment" &&
      trackData?.payment_status === "unpaid" &&
      zoneData?.data?.zone_data?.[0]?.cash_on_delivery ? (
        <OrderStatusButton
          background={theme.palette.primary.main}
          onClick={() => setModalOpenForPayment(true)}
        >
          {isSmall ? t("Switch to COD") : t("Switch to cash on delivery")}
        </OrderStatusButton>
      ) : (
        <>
          {trackData && trackData?.order_status === "failed" ? (
            <PaymentUpdate
              id={id}
              refetchOrderDetails={refetch}
              refetchTrackData={refetchTrackOrder}
              trackData={trackData}
              isSmall={isSmall}
            />
          ) : (
            trackData?.order_status === "pending" && (
              <OrderStatusButton
                background={theme.palette.error.deepLight}
                onClick={() => setCancelOpenModal(true)}
              >
                {t("Cancel Order")}
              </OrderStatusButton>
            )
          )}
        </>
      )}
      <CustomModal
        openModal={cancelOpenModal}
        setModalOpen={setCancelOpenModal}
        handleClose={() => setCancelOpenModal(false)}
      >
        <CancelOrder
          cancelReason={cancelReason}
          setCancelReason={setCancelReason}
          cancelReasonsData={cancelReasonsData}
          setModalOpen={setCancelOpenModal}
          handleOnSuccess={handleOnSuccess}
          orderLoading={orderLoading}
        />
      </CustomModal>

      <CustomModal
        openModal={openModalForPayment}
        setModalOpen={setModalOpenForPayment}
        handleClose={() => setModalOpenForPayment(false)}
      >
        <DigitalPaymentManage
          setModalOpenForPayment={setModalOpenForPayment}
          setModalOpen={setOpenModal}
          refetchOrderDetails={refetchOrderDetails}
          refetchTrackData={refetchTrackData}
          id={trackData?.id}
        />
      </CustomModal>
    </CustomStackFullWidth>
  );
};

export default TopDetails;
