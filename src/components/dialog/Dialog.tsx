// @ts-nocheck
import { styled } from "@mui/material/styles";
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { RadioButtonUnchecked, RadioButtonChecked } from "@mui/icons-material";
import { LittleMap } from "..";
import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Stack,
  Tooltip,
} from "@mui/material";
import Iran from "../../assets/images/iranFlag.png";
import data from "../../services/servers.json";
import { useEffect, useState, useCallback } from "react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Echart from "../chart/Chart";

const colorArr = ["#ff595e", "#1982c4", "#ffca3a", "#8ac926", "#6a4c93"];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const Dialogs = ({
  isOpen,
  handleClose,
  fId,
  center,
  onIdNumberChange,
  centerId,
  timeSeries,
  littleMapId,
  setLittleMapId,
}) => {
  const y = 0.01324773;
  const x = 2.16 * y;
  const findCenter = data.find((item) => item.id === centerId);
  const FindLatiude = data.find((item) => item.id === centerId)?.location
    .latitude;
  const FindeLongitude = data.find((item) => item.id === centerId)?.location
    .longitude;
  const [nearPoints, setNearPoints] = useState([]);
  const [selectedPointsCount, setSelectedPointsCount] = useState(1);

  console.log("nearPoints", nearPoints.length);
  const [availableColors, setAvailableColors] = useState([
    "#1982c4",
    "#ffca3a",
    "#8ac926",
    "#6a4c93",
  ]);

  useEffect(() => {
    const filteredPoints = data.filter(
      (item) =>
        // find latitude betveen FindLatiude-y & FindLatiude+y
        Math.abs(FindLatiude - item.location.latitude) <= y &&
        Math.abs(FindeLongitude - item.location.longitude) <= x
    );

    setNearPoints(
      filteredPoints.map((point) => {
        return {
          ...point,
          selected: point.id === fId,
          fillColor: point.id === fId ? "#ff595e" : "#A6A7A6",
        };
      })
    );
  }, [data, isOpen]);

  const style = {
    p: 0,
    width: "100%",
    maxWidth: 282,
    height: "150px",
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
    borderStyle: "dashed",
  };
  useEffect(() => {
    if (!isOpen) {
      setAvailableColors([...colorArr]);
    }
  }, [isOpen]);

  const handleChange = (event) => {
    const selectedCheack = {
      ...nearPoints.find((point) => point.id == event.target.id),
    };
    console.log(selectedCheack);
    const filteredPoints = nearPoints.filter(
      (point) => point.id != event.target.id
    );
    selectedCheack.selected = event.target.checked;
    if (event.target.checked) {
      selectedCheack.fillColor = availableColors[0];
      setAvailableColors(
        [...availableColors].filter((color) => color !== availableColors[0])
      );
    } else {
      setAvailableColors([...availableColors, selectedCheack.fillColor]);
      selectedCheack.fillColor = "#A6A7A6";
    }
    setNearPoints([...filteredPoints, selectedCheack]);
  };

  const handleOnSelectedChange = useCallback(
    (id) => {
      const selectedPoint = { ...nearPoints.find((point) => point.id == id) };

      const otherPoints = nearPoints.filter((point) => point.id != id);
      if (!selectedPoint.selected) {
        selectedPoint.fillColor = availableColors[0];
        setAvailableColors(
          [...availableColors].filter((color) => color !== availableColors[0])
        );
        setSelectedPointsCount((prev) => (prev += 1));
      } else {
        setAvailableColors([...availableColors, selectedPoint.fillColor]);
        selectedPoint.fillColor = "#A6A7A6";
        setSelectedPointsCount((prev) => (prev -= 1));
      }
      selectedPoint.selected = !selectedPoint.selected;

      setNearPoints([...otherPoints, selectedPoint]);
    },
    [availableColors, nearPoints, selectedPointsCount]
  );

  return (
    <div className="min-w-[1000px]">
      <BootstrapDialog
        fullWidth
        maxWidth="lg"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
        sx={{
          width: "100%",
          height: "100%",
          "& .MuiDialogContent-root": { overflow: "hidden" },
        }}
      >
        <DialogTitle
          id="customized-dialog-title"
          sx={{ bgcolor: "rgb(0,101,162)" }}
        >
          Time Series
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers>
          <Grid2 container spacing={1}>
            <Grid2 xs={3} sx={{ display: "flex", flexDirection: "column" }}>
              <Box>
                <LittleMap
                  center={center}
                  centerId={centerId}
                  onSelectedChange={handleOnSelectedChange}
                  nearPoints={nearPoints}
                  selectedPointsCount={selectedPointsCount}
                  setSelectedPointsCount={setSelectedPointsCount}
                />
              </Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ m: 1 }}
              >
                <div className="flex justify-between items-center   w-full ">
                  <Typography variant="caption" sx={{ fontSize: "20px" }}>
                    {nearPoints.length}
                  </Typography>
                  <Tooltip>
                    <Typography variant="caption">
                      <span className="text-[14px]">
                        تعداد کل نقاط در این محدوده
                      </span>
                    </Typography>
                  </Tooltip>
                </div>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ m: 1 }}
              >
                <Typography variant="caption" sx={{ fontSize: "20px" }}>{selectedPointsCount}</Typography>
                <Tooltip title="امکان انتخاب حداکثر 5 نقطه">
                  <Typography variant="caption" >
                    <span className="text-[14px]">نقاط انتخاب شده</span>
                  </Typography>
                </Tooltip>
              </Stack>

              <Box sx={{ flexGrow: 1, position: "relative" }}>
                <Box className="h-full max-h-full overflow-y-auto items-baseline">
                  <FormControl sx={style} aria-label="mailbox folders">
                    <FormGroup sx={{ px: 1, height: "500px" }}>
                      {nearPoints
                        .sort((a, b) => a.id - b.id)
                        .map((item) => {
                          return (
                            <div key={item.id}>
                              <FormControlLabel
                                key={item}
                                label={
                                  <Stack direction="row">
                                    <img
                                      className="my-auto"
                                      style={{
                                        width: "32px",
                                        height: "24px",
                                        marginRight: "10px",
                                      }}
                                      src={Iran}
                                      alt="iran"
                                    />
                                    <Typography>{item.title}</Typography>
                                  </Stack>
                                }
                                control={
                                  <Checkbox
                                    name={item.title}
                                    id={item.id.toString()}
                                    checked={item.selected}
                                    onChange={(event) => {
                                      handleChange(event);
                                      setSelectedPointsCount(
                                        (prev) =>
                                          (prev += event?.target?.checked
                                            ? 1
                                            : -1)
                                      );
                                    }}
                                    disabled={
                                      selectedPointsCount >= 5 && !item.selected
                                    }
                                    icon={<RadioButtonUnchecked />}
                                    checkedIcon={
                                      <RadioButtonChecked
                                        sx={{
                                          color: item.fillColor,
                                        }}
                                      />
                                    }
                                  />
                                }
                              />
                              <Divider light sx={{ borderStyle: "dashed" }} />
                            </div>
                          );
                        })}
                    </FormGroup>
                  </FormControl>
                </Box>
              </Box>
            </Grid2>
            <Grid2 xs={9}>
              <Echart
                timeSeries={timeSeries}
                fId={fId}
                onIdNumberChange={onIdNumberChange}
                littleMapId={littleMapId}
                nearPoints={nearPoints}
              />
            </Grid2>
          </Grid2>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};
export default Dialogs;
