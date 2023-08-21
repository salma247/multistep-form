import { useState, createContext } from "react";

export const multiStepContext = createContext();



function StepContext(props) {
    const [currentStep, setCurrentStep] = useState(1);
    const [onboardingData, setOnboardingData] = useState({});

    return (
        <multiStepContext.Provider value={{ currentStep, setCurrentStep, onboardingData, setOnboardingData }}>
            {props.children}
        </multiStepContext.Provider>
    )
}

export default StepContext