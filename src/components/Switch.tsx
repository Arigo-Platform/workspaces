import * as RadixSwitch from "@radix-ui/react-switch";
export default function Switch({
  label,
  defaultChecked,
  onChange,
  checked,
}: {
  label: string;
  defaultChecked: boolean;
  onChange: (checked: boolean) => void;
  checked?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between w-full"
      style={{ display: "flex", alignItems: "center" }}
    >
      <label
        className="dark:text-white font-medium text-black text-[15px] leading-none pr-[15px]"
        htmlFor={`switch-${label.split(" ").join("-").toLowerCase()}`}
      >
        {label}
      </label>
      <RadixSwitch.Root
        defaultChecked={defaultChecked}
        onCheckedChange={onChange}
        checked={checked}
        className="w-[42px] h-[25px] bg-blackA9 rounded-full relative shadow-[0_2px_10px] shadow-blackA7 dark:shadow-none focus:ring-1 ring-blue-500 data-[state=checked]:bg-green-500 outline-none cursor-default"
        id={`switch-${label.split(" ").join("-").toLowerCase()}`}
      >
        <RadixSwitch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA7 transition-transform duration-200 ease-out translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
      </RadixSwitch.Root>
    </div>
  );
}
