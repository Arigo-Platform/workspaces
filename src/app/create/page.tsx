"use client";

import { Step, Steps } from "@/components/Steps";

export default function Create() {
  return (
    <div className="h-full p-6">
      <Steps>
        <Step title="Create a Workspace" status="current">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          </p>
        </Step>
        <Step title="Invite Members" status="upcoming">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            quos quia, voluptatum, quod, voluptates quibusdam quae doloribus
            voluptatibus quas quidem natus. Quisquam quos quia, voluptatum,
            quod,
          </p>
        </Step>
      </Steps>
    </div>
  );
}
