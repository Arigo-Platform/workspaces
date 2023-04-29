import { CheckIcon } from "@heroicons/react/24/solid";
import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import Button from "./Button";

type StepStatus = "complete" | "current" | "upcoming";

type StepProps = {
  id?: string | number;
  title: string;
  status?: StepStatus;
  children: ReactNode;
  canContinue?: boolean | (() => boolean);
};

const Step = ({ id, title, status }: StepProps) => {
  return (
    <>
      {status === "complete" ? (
        <div className="flex items-center w-full group">
          <span className="flex items-center px-6 py-4 text-sm font-medium">
            <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full group-hover:bg-indigo-800">
              <CheckIcon className="w-6 h-6 text-white" aria-hidden="true" />
            </span>
            <span className="ml-4 text-sm font-medium text-gray-900 dark:text-gray-300">
              {title}
            </span>
          </span>
        </div>
      ) : status === "current" ? (
        <div
          className="flex items-center px-6 py-4 text-sm font-medium"
          aria-current="step"
        >
          <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 border-indigo-600 rounded-full dark:border-indigo-300">
            <span className="text-indigo-600 dark:text-indigo-300">{id}</span>
          </span>
          <span className="ml-4 text-sm font-medium text-indigo-600 dark:text-indigo-300">
            {title}
          </span>
        </div>
      ) : (
        <div className="flex items-center group">
          <span className="flex items-center px-6 py-4 text-sm font-medium">
            <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 border-gray-300 rounded-full">
              <span className="text-gray-500">{id}</span>
            </span>
            <span className="ml-4 text-sm font-medium text-gray-500">
              {title}
            </span>
          </span>
        </div>
      )}
    </>
  );
};

const Steps = ({ children }: { children: ReactNode[] }) => {
  const [currentStepContent, setCurrentStepContent] = useState<ReactNode>();
  const [currentStep, setCurrentStep] = useState(0);

  const childrenWithProps = Children.map(children, (child, index) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        id: (index + 1).toString().padStart(2, "0"),

        ...child.props,
        status:
          index < currentStep
            ? "complete"
            : index === currentStep
            ? "current"
            : "upcoming",
      } as any);
    }
  });

  useEffect(() => {
    setCurrentStepContent(
      (childrenWithProps![currentStep].props as StepProps).children
    );
  }, [currentStep]);

  const handleCanContinue = () => {
    const step = childrenWithProps![currentStep].props as StepProps;
    if (typeof step.canContinue === "function") {
      return step.canContinue();
    }
    return step.canContinue;
  };

  return (
    <div className="flex flex-col h-full">
      <nav aria-label="Progress">
        <ol
          role="list"
          className="border border-gray-300 divide-y divide-gray-300 rounded-md md:flex md:divide-y-0"
        >
          {childrenWithProps?.map((child, index) => (
            <li key={index} className="relative md:flex md:flex-1">
              {child}
              {index !== children.length - 1 ? (
                <>
                  {/* Arrow separator for lg screens and up */}
                  <div
                    className="absolute top-0 right-0 hidden w-5 h-full md:block"
                    aria-hidden="true"
                  >
                    <svg
                      className="w-full h-full text-gray-300"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>

      <div className="grow">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between h-full py-4">
            <div className="space-y-4">{currentStepContent}</div>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          onClick={() => {
            if (currentStep > 0) {
              setCurrentStep(currentStep - 1);
            }
          }}
          disabled={currentStep === 0}
          aria-label="Previous Step"
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            if (handleCanContinue()) {
              return;
            }
            if (currentStep < children.length - 1) {
              setCurrentStep(currentStep + 1);
            }
          }}
          disabled={currentStep === children.length - 1}
          aria-label="Next Step"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export { Steps, Step };
