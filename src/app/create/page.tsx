"use client";

import { Step, Steps } from "@/components/Steps";

export default function Create() {
  return (
    <div className="h-full p-6">
      <Steps>
        <Step title="Basic Details">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          </p>
        </Step>
        <Step title="Choose a Plan">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            quos quia, voluptatum, quod, voluptates quibusdam quae doloribus
          </p>
        </Step>
        <Step title="Invite Members">
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
