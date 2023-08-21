import { useState, useEffect, useContext } from 'react'
import TextInput from "../Inputs/TextInput";
import { FormControl, Grid, Typography } from "@material-ui/core";

import { multiStepContext } from '../../StepContext';

function FirstStep({ onboardingData, onInputChange, classes, setStep, renderButton }) {
    const [error, setError] = useState(false);
    const { setCurrentStep } = useContext(multiStepContext);

    useEffect(() => {
        if (onboardingData?.firstName) {
            setError(false);
        }
        else {
            setError(true);
        }
    }, [onboardingData]);


    const handleNext = () => {
        setCurrentStep(2);
    };



    return (
        <>
            <FormControl fullWidth className={classes.formControl}>
                <TextInput
                    label={"First Name"}
                    name={"firstName"}
                    required={true}
                    onboardingData={onboardingData}
                    onChange={onInputChange}
                />
            </FormControl>

            <FormControl fullWidth className={classes.formControl}>
                <TextInput
                    label={"Last Name"}
                    name={"lastName"}
                    required={true}
                    onboardingData={onboardingData}
                    onChange={onInputChange}
                />
            </FormControl>


            <FormControl fullWidth className={classes.formControl}>
                <TextInput
                    label={"Bio"}
                    name={"bio"}
                    required={true}
                    onboardingData={onboardingData}
                    onChange={onInputChange}
                    textarea={true}
                />
            </FormControl>

            <FormControl fullWidth className={classes.formControl}>
                {/* error message */}
                {error && (
                    <Typography variant="body2" color="error" className={classes.error}>
                        Please fill out all fields
                    </Typography>
                )}

                <Grid justifyContent="space-between" container>
                    <Grid item>
                        {renderButton("Next", handleNext, error)}
                    </Grid>
                </Grid>
            </FormControl>
        </>
    )
}

export default FirstStep