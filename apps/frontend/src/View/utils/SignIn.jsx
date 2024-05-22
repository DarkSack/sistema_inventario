import { Stepper } from "@mantine/core";
import { useState } from "react";
import { CreateAccountView } from "./SiginViews/CreateAccountPassInfo";
import { CreateAccountPersonalInfoView } from "./SiginViews/CreateAccountPersonalInfo";
import { VerifyInfoToAccount } from "./SiginViews/VerifyInfo";
// import supabase from "./supabaseClient";

export const SignInView = () => {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  return (
    <div>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="First step" description="Create an account">
          <CreateAccountView prevStep={prevStep} nextStep={nextStep} />
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Verify email">
          <CreateAccountPersonalInfoView
            prevStep={prevStep}
            nextStep={nextStep}
          />
        </Stepper.Step>
        <Stepper.Step label="Final step" description="Get full access">
          <VerifyInfoToAccount prevStep={prevStep} nextStep={nextStep} />
        </Stepper.Step>
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>
    </div>
  );
};
