import React, { useCallback, useState } from "react";
import { arrayOf, string, func } from "prop-types";
import {
  TextField,
  FormGroup,
  InputAdornment,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useInterval } from "react-use";
import { useTranslation } from "react-i18next";
import { ClearButton, ClearDataDialog, Button } from "../components";
import bells from "../images/bells.svg";

const useTextFieldStyles = makeStyles(() => ({
  InputLabel: {
    position: "relative",
  },
  Input: {
    "label + &": {
      marginTop: 0,
    },
  },
}));

const calculateCurrentPriceIndex = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  return ((day + 6) % 7) * 2 + +(hour >= 12) + 1;
};

const Filter = ({ filters, onChange, openShareDialog }) => {
  const [clearDataDialogOpen, setClearDataDialogOpen] = useState(false);
  const { t } = useTranslation();
  const TextFieldClasses = useTextFieldStyles();
  const [currentPriceIndex, setCurrentPriceIndex] = useState(
    calculateCurrentPriceIndex
  );

  useInterval(() => {
    // It will not re-render the component if didn't change.
    const newPriceIndex = calculateCurrentPriceIndex();
    setCurrentPriceIndex(newPriceIndex);
  }, 1000);

  const handleChange = useCallback(
    (index) => ({
      target: {
        value,
        validity: { valid },
      },
    }) => {
      if (!valid) return;
      const newFilters = Array.from({ length: 13 }, (v, i) =>
        index === i ? value : filters[i]
      );
      onChange(newFilters);
    },
    [filters, onChange]
  );

  const names = [
    t("Buy Price"),
    ...t("Mon Tue Wed Thu Fri Sat")
      .split(" ")
      .reduce(
        (curr, day) => [...curr, ...[`${day} ${t("AM")}`, `${day} ${t("PM")}`]],
        []
      ),
  ];

  const fields = Array.from({ length: 13 }, (v, i) => i).map((index) => (
    <TextField
      key={`value-${index}`}
      type="tel"
      variant="standard"
      color="secondary"
      label={names[index]}
      fullWidth
      inputProps={{ pattern: "[0-9]*", tabIndex: 0 }}
      InputLabelProps={{
        shrink: true,
        classes: { root: TextFieldClasses.InputLabel },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <img src={bells} alt="Bag of bells" />
          </InputAdornment>
        ),
        classes: {
          root: TextFieldClasses.Input,
        },
      }}
      value={filters[index] || ""}
      placeholder={currentPriceIndex === index ? t("Now") : ""}
      onChange={handleChange(index)}
    />
  ));

  return (
    <>
      <ClearDataDialog
        open={clearDataDialogOpen}
        dismiss={() => setClearDataDialogOpen(false)}
        confirm={() => {
          setClearDataDialogOpen(false);
          onChange([]);
        }}
      />
      <Box
        borderRadius={4}
        bgcolor="primary.light"
        display="flex"
        flexDirection="column"
      >
        <FormGroup>
          <Box
            m={2}
            p={2}
            mb={-1}
            borderRadius={4}
            bgcolor="bkgs.mainAlt"
            display="flex"
          >
            {fields[0]}
          </Box>
          <Box
            m={2}
            ml={1}
            mr={1}
            display="flex"
            flexWrap="wrap"
            alignItems="stretch"
          >
            {fields.slice(1).reduce(
              (prev, curr, index) =>
                index % 2
                  ? [
                      ...prev.slice(0, -1),
                      <Box
                        display="flex"
                        key={index}
                        p={1}
                        width={{ xs: 0.5, sm: 1 / 3, md: 1 / 6 }}
                      >
                        <Box
                          p={2}
                          bgcolor="bkgs.mainAlt"
                          borderRadius={4}
                          display="flex"
                          flexDirection="column"
                          justifyContent="space-between"
                        >
                          <Box m={1}>{prev.slice(-1)}</Box>
                          <Box m={1}>{curr}</Box>
                        </Box>
                      </Box>,
                    ]
                  : [...prev, curr],
              []
            )}
          </Box>
        </FormGroup>
        <Box alignSelf="flex-end" mt={-2} display="flex">
          <Box mx={1}>
            <Button onClick={openShareDialog}>{t("shareButton")}</Button>
          </Box>
          <ClearButton onClick={() => setClearDataDialogOpen(true)} />
        </Box>
      </Box>
    </>
  );
};

Filter.propTypes = {
  filters: arrayOf(string).isRequired,
  onChange: func.isRequired,
  openShareDialog: func.isRequired,
};

export default Filter;
