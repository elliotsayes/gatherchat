import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GatherContactEvents } from "@/features/ao/components/GatherContractLoader";
import { useState } from "react";
import { SetupForm } from "./SetupForm";

interface RegisterProps {
  // state: GatherContractState;
  events: GatherContactEvents;
}

export const Register = ({
  // state: contractState,
  events: contractEvents,
}: RegisterProps) => {
  const [registerClicked, setRegisterClicked] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-xl pb-8">Welcome to Gather Chat!</p>
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Set up your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <SetupForm
            onSubmit={(s) => {
              setRegisterClicked(true);
              contractEvents.register({
                name: s.username,
                avatar: s.avatarSeed,
                status: "Hello Gather Chat!",
                currentWorldId: "LlamaFED",
                following: {},
              });
            }}
            submitDisabled={registerClicked}
          />
        </CardContent>
      </Card>
    </div>
  );
};
