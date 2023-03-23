import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import useWorkspaces from "@/util/useWorkspaces";
import DarkModeSwitch from "./DarkModeSwitch";
import classNames from "classnames";

export default function UserMenu() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const workspaces = useWorkspaces();
  const [workspaceSelectorOpen, setWorkspaceSelectorOpen] = useState(false);
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <img
              className="w-8 h-8 rounded-full"
              src={user?.user_metadata.avatar_url}
            />
          </div>
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
          align="end"
        >
          <div className="py-1">
            {/* User Profile */}
            <DropdownMenu.Item className="outline-none">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 outline-none select-none data-[highlighted]:bg-gray-200 data-[highlighted]:rounded"
                // className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Your Profile
              </Link>
            </DropdownMenu.Item>
            {/* Settings */}
            <DropdownMenu.Item className="outline-none">
              <Link
                href="/settings"
                className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 outline-none select-none data-[highlighted]:bg-gray-200 data-[highlighted]:rounded"
                // className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
            </DropdownMenu.Item>
            {/* Seperator / Divider */}
            <DropdownMenu.Separator className="h-[1px] bg-[#4F66C2] bg-opacity-10 m-[5px]" />
            {/* Workspace Selector */}
            <DropdownMenu.Sub onOpenChange={setWorkspaceSelectorOpen}>
              <DropdownMenu.SubTrigger className="py-2 px-3 gap-x-2 text-sm hover:bg-gray-100 text-gray-700 flex items-center select-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:rounded data-[highlighted]:data-[state=open]:bg-gray-200 ">
                <ChevronLeftIcon
                  className={classNames(
                    workspaceSelectorOpen && "-rotate-90",
                    "transition duration-100"
                  )}
                />
                Change Workspace
              </DropdownMenu.SubTrigger>
              <DropdownMenu.Portal>
                <DropdownMenu.SubContent
                  className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                  sideOffset={2}
                  alignOffset={-5}
                >
                  {workspaces &&
                    workspaces.map((workspace) => (
                      <DropdownMenu.Item className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
                        {workspace.name}
                      </DropdownMenu.Item>
                    ))}
                  {/* Seperator / Divider */}
                  <DropdownMenu.Separator className="h-[1px] bg-violet6 m-[5px]" />
                  {/* Create Workspace Button */}
                  <DropdownMenu.Item className="group text-[13px] leading-none text-violet11 rounded-[3px] h-[25px] relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
                    <Link
                      href="/create"
                      className="group text-[13px] leading-none text-violet11 rounded-[3px] flex justify-between items-center h-[25px] px-[25px] relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                    >
                      Create new
                      <PlusIcon />
                    </Link>
                  </DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
            {/* Seperator / Divider */}
            <DropdownMenu.Separator className="h-[1px] bg-[#4F66C2] bg-opacity-10 m-[5px]" />
            {/* Dark Mode Switch */}
            <DropdownMenu.Item
              disabled
              className="flex justify-between items-center px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 select-none outline-none data-[highlighted]:bg-gray-200 data-[highlighted]:rounded"
            >
              Dark Mode
              <DarkModeSwitch />
            </DropdownMenu.Item>
            {/* Sign Out */}
            <DropdownMenu.Item
              className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 select-none outline-none data-[highlighted]:bg-gray-200 data-[highlighted]:rounded"
              onClick={() => supabase.auth.signOut()}
              // className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
            >
              Sign Out
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
