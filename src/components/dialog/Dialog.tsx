// @ts-nocheck

import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { LittleMap } from "..";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Stack,
} from "@mui/material";
import Iran from "../../images/iranFlag.png";
import data from "../../services/servers.json";
import { useEffect, useState, useCallback } from "react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Echart2 from "../chart/Chart2";

const colorArr = ["red", "blue", "black", "green", "purple"];

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
  console.log(findCenter, "center");
  const FindLatiude = data.find((item) => item.id === centerId)?.location
    .latitude;
  const FindeLongitude = data.find((item) => item.id === centerId)?.location
    .longitude;
  const [nearPoints, setNearPoints] = useState([]);
  const [selectedPointsCount, setSelectedPointsCount] = useState(1);

  const [availableColors, setAvailableColors] = useState([
    "blue",
    "black",
    "green",
    "purple",
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
        // console.log({ point });
        return {
          ...point,
          selected: point.id === fId,
          fillColor: point.id === fId ? "red" : "#A6A7A6",
        };
      })
    );
  }, [data, isOpen]);

  const handleIdNumberChange = (newIdNumber) => {
    console.log("Id Number changed:", newIdNumber);
    setLittleMapId(newIdNumber);
  };

  const style = {
    p: 0,
    width: "100%",
    maxWidth: 282,
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
    const changeCheck = {
      ...nearPoints.find((point) => point.id == event.target.id),
    };
    const filteredPoints = nearPoints.filter(
      (point) => point.id != event.target.id
    );
    changeCheck.selected = event.target.checked;
    if (event.target.checked) {
      changeCheck.fillColor = availableColors[0];
      setAvailableColors(
        [...availableColors].filter((color) => color !== availableColors[0])
      );
      // setSelectedPointsCount((prev) => (prev += 1));
    } else {
      setAvailableColors([...availableColors, changeCheck.fillColor]);
      changeCheck.fillColor = "#A6A7A6";
      // setSelectedPointsCount((prev) => (prev -= 1));
    }
    setNearPoints([...filteredPoints, changeCheck]);
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
      // if (selectedPointsCount < 5) {
      // }
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
        sx={{ width: "100%", height: "100%" }}
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
                  onIdNumberChange={handleIdNumberChange}
                  centerId={centerId}
                  onSelectedChange={handleOnSelectedChange}
                  nearPoints={nearPoints}
                  setNearPoints={setNearPoints}
                  selectedPointsCount={selectedPointsCount}
                  setSelectedPointsCount={setSelectedPointsCount}
                />
              </Box>
              <Box sx={{ flexGrow: 1, position: "relative" }}>
                <Box
                  sx={{ height: "100%", maxHeight: "100%", overflowY: "auto" }}
                >
                  <FormControl sx={style} aria-label="mailbox folders">
                    <FormGroup>
                      {nearPoints
                        .sort((a, b) => a.id - b.id)
                        .map((item) => {
                          return (
                            <>
                              <FormControlLabel
                                label={
                                  <Stack direction="row">
                                    <img
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
                                    checked={item.selected}
                                    onChange={(event) => {
                                      // handleOnSelectedChange(event?.target.id);
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
                                    sx={{
                                      color: item.fillColor,
                                      "&.Mui-checked": {
                                        color: item.fillColor,
                                      },
                                    }}
                                    name={item.title}
                                    id={item.id.toString()}
                                  />
                                }
                              />
                            </>
                          );
                        })}
                    </FormGroup>
                  </FormControl>
                </Box>
              </Box>
            </Grid2>
            <Grid2 xs={9}>
              <Echart2
                // style={{ height: "500px" }}
                timeSeries={timeSeries}
                fId={fId}
                onIdNumberChange={onIdNumberChange}
                littleMapId={littleMapId}
                nearPoints={nearPoints}
              />
    
            </Grid2>
          </Grid2>

          {/* <Typography gutterBottom>sadsa</Typography> */}
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};
export default Dialogs;
