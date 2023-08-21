import React, { useState, useEffect } from 'react'
import Toggle from "../Inputs/Toggle";
import TextInput from "../Inputs/TextInput";
import { FormControl, Grid, Typography } from "@material-ui/core";



function SecondStep({ onboardingData, onInputChange, classes, setStep, history, renderButton }) {
    const [error, setError] = useState(false);

    useEffect(() => {
        if (onboardingData?.country) {
            setError(false);
        }
        else {
            setError(true);
        }
    }, [onboardingData]);

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    const saveOnboarding = () => {
        history.push({
            pathname: "/home",
            state: { onboarding: true },
        });
    };

    return (
        <>
            <FormControl fullWidth className={classes.formControl}>
                <TextInput
                    label={"Country"}
                    name={"country"}
                    required={true}
                    onboardingData={onboardingData}
                    onChange={onInputChange}
                />
            </FormControl>

            <FormControl fullWidth className={classes.formControl}>
                <Toggle
                    label={"I would like to receive email notifications for new messages when I'm logged out"}
                    name={"receiveNotifications"}
                    onChange={onInputChange}
                    onboardingData={onboardingData}
                />
            </FormControl>

            <FormControl fullWidth className={classes.formControl}>
                <Toggle
                    label={"I would like to receive updates"}
                    name={"receiveUpdates"}
                    onChange={onInputChange}
                    onboardingData={onboardingData}
                />
            </FormControl>

            <FormControl fullWidth className={classes.formControl}>
                {/* error message */}
                {error && (
                    <Typography variant="body2" color="error" className={classes.error}>
                        Please fill out all required fields
                    </Typography>
                )}

                <Grid justifyContent="space-between" container>
                    <Grid item >
                        {renderButton("Back", handleBack)}
                    </Grid>

                    <Grid item>
                        {renderButton("Finish", saveOnboarding, error)}
                    </Grid>
                </Grid>
            </FormControl>
        </>
    )
}

export default SecondStep