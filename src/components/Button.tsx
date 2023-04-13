import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Button({
  saving,
  className,
  children,
  onClick,
}: {
  saving?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className={`transition-colors disabled:opacity-75 disabled:cursor-not-allowed disabled:dark:hover:bg-white duration-150 border hover:outline-none border-black disabled:dark:border-black dark:border-white ml-auto font-medium dark:text-black disabled:dark:hover:text-black dark:hover:text-white dark:bg-white dark:hover:bg-opacity-0 hover:bg-opacity-0 bg-black text-white hover:text-black px-5 py-2 text-sm outline-none select-none rounded-md data-[highlighted]:bg-gray-200 data-[highlighted]:rounded ${className}`}
    >
      {!saving ? (
        children
      ) : (
        <span className="flex justify-center items-center w-[31.1px] h-[18.3333px]">
          <ArrowPathIcon className="w-5 h-5 animate-spin" />
        </span>
      )}
    </button>
  );
}
