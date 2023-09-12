//Stepper
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const CustomStepper = (props) => {
  console.log(`stepper.js step is ${props.activeStep}`)
  return (
    <Stepper activeStep={props.activeStep}>
      {props.steps.map((label, index) => {
        const stepProps = {};
        const labelProps = {};
        if (isStepOptional(index) && index != 2) {
          labelProps.optional = (
            <Typography variant="caption">Optional</Typography>
          );
        }
        if (isStepSkipped(index)) {
          stepProps.completed = false;
        }
        return (
          <Step key={label} {...stepProps}>
            <StepLabel {...labelProps}>{label}</StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};

const isStepOptional = (step) => {
  // return step === 0;
  return null;
};

const isStepSkipped = (step) => {
  //   return skipped.has(step);
};

export default CustomStepper;
