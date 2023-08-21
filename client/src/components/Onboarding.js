import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Paper,Stepper, StepLabel, Step } from "@material-ui/core";
import FirstStep from "./steps/FirstStep";
import SecondStep from "./steps/SecondStep";

import { multiStepContext } from "../StepContext";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(5),
    backgroundColor: "#F7F9FD",
    width: "50%",
    marginTop: theme.spacing(10),
  },
  stepper: {
    padding: theme.spacing(5),
    backgroundColor: "#F7F9FD",
  },
  formControl: { padding: theme.spacing(2) },
  error: { color: "red" },
  button: {
    marginTop: theme.spacing(4),
    alignContent: "right",
    backgroundColor: "#3A8DFF",
    padding: "5px 30px",
    color: "#ffffff",
    fontSize: "15px",
    "&:disabled": {
      color: "#ffffff",
      fontSize: "15px",
      backgroundColor: "lightgrey",
    },
    "&:hover": {
      color: "#ffffff",
      fontSize: "15px",
      backgroundColor: "#3A8DFF",
    },
  },
}));

const Onboarding = () => {
  const classes = useStyles();
  const history = useHistory();
  // const [step, setStep] = useState(1);
  const { currentStep, setCurrentStep, onboardingData ,setOnboardingData} = useContext(multiStepContext);


  const [onboardingForm, setOnboardingForm] = useState({
    isFetching: true,
  });


  useEffect(() => {
    const fetchOnboardingFormData = async () => {
      setOnboardingForm((prev) => ({ ...prev, isFetching: true }));
      try {
        const { data } = await axios.get("/api/onboarding");
        setOnboardingForm(data);
      } catch (error) {
        console.error(error);
      } finally {
        setOnboardingForm((prev) => ({ ...prev, isFetching: false }));
      }
    };

    fetchOnboardingFormData();
  }, []);

  const onInputChange = (event, type = "text") => {
    setOnboardingData((prevData) => {
      return {
        ...prevData,
        [event.target.name]:
          type === "checkbox" ? event.target.checked : event.target.value,
      };
    });
  };

  const renderButton = (text, onClick, disabled = false) => {
    return (
      <Button
        className={classes.button}
        type="submit"
        variant="contained"
        size="large"
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </Button>
    );
  };


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <FirstStep onInputChange={onInputChange} onboardingData={onboardingData} classes={classes} setStep={setCurrentStep} renderButton={renderButton} />;

      case 2:
        return <SecondStep onInputChange={onInputChange} onboardingData={onboardingData} classes={classes} setStep={setCurrentStep} history={history} renderButton={renderButton} />;

      default:
        return null;
    }
  }

  if (onboardingForm?.isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container justifyContent="center">
      <Paper className={classes.container}>
        <Stepper activeStep={currentStep - 1} alternativeLabel orientation="horizontal" className={classes.stepper}>
          <Step>
            <StepLabel>Step 1</StepLabel>
          </Step>
          <Step>
            <StepLabel>Step 2</StepLabel>
          </Step>
        </Stepper>
        {renderStep()}
      </Paper>
    </Grid>
  );
};

export default Onboarding;
