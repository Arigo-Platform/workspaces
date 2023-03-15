import React, { useEffect } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  HamburgerMenuIcon,
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
  CaretSortIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { Database } from "@/types/supabase";
import useWorkspaces from "@/util/useWorkspaces";
import Link from "next/link";

const DropdownMenuDemo = () => {
  const workspaces = useWorkspaces();

  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState("pedro");
  const [workspace, setWorkspace] =
    React.useState<Database["public"]["Tables"]["workspaces"]["Row"]>();

  if (!workspaces) {
    return <p>loading...</p>;
  }

  const handleWorkspaceChange = (
    workspace: Database["public"]["Tables"]["workspaces"]["Row"]
  ) => {
    setWorkspace(workspace);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="flex items-center space-x-1 hover:bg-gray-900 px-2 rounded-md py-1 cursor-pointer">
          <div>
            <p className="text-white font-bold">
              {workspace ? workspace.name : "Select a workspace..."}
            </p>
          </div>
          <button className="text-white" aria-label="Select a workspace">
            <CaretSortIcon />
          </button>
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
          align="start"
        >
          {workspaces.map((workspace) => (
            <DropdownMenu.Item
              onClick={() => handleWorkspaceChange(workspace)}
              className="group text-md text-semibold leading-none text-violet11 rounded-[3px] flex items-center p-[5px] relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
            >
              <Link
                href={`/workspaces/${workspace.id}`}
                className="flex items-center"
              >
                <div className="w-12 h-12 flex font-semibold items-center justify-center rounded-sm bg-blue-400 text-blue-50">
                  {workspace.name?.at(0)?.toUpperCase()}
                </div>
                <div className="ml-4">{workspace.name}</div>
              </Link>
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator className="h-[1px] bg-violet6 m-[5px]" />

          <DropdownMenu.Item className="group text-md text-semibold leading-none text-violet11 rounded-[3px] p-[5px] relative select-none outline-none disabled:text-mauve8 disabled:pointer-events-none hover:bg-violet9 hover:text-violet1">
            <Link href="/new" className="flex items-center">
              <div className="w-12 h-12 flex font-semibold items-center justify-center rounded-sm bg-green-400 text-green-50">
                <PlusIcon />
              </div>
              <div className="ml-4">Create new</div>
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default DropdownMenuDemo;
