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
  const { workspaces } = useWorkspaces();
  const [workspaceSelectorOpen, setWorkspaceSelectorOpen] = useState(false);
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <img
              className="w-8 h-8 rounded-full"
              src={user?.user_metadata.avatar_url}
              alt="User avatar"
            />
          </div>
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="dark:border dark:border-gray-600 min-w-[220px] dark:bg-black dark:text-white bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
          align="end"
        >
          {/* <p className="px-4 py-2 text-xs text-gray-600 outline-none select-none dark:text-gray-300">
            Hey, {user?.user_metadata.full_name}
          </p> */}
          {/* Seperator / Divider */}
          {/* <DropdownMenu.Separator className="h-[1px] bg-gray-600 bg-opacity-10 dark:bg-opacity-40 m-[5px]" /> */}
          <div className="py-1">
            {/* User Profile */}
            <DropdownMenu.Item className="outline-none">
              <Link
                href="/profile"
                className="dark:text-white dark:hover:bg-zinc-700 block px-4 py-2 text-sm hover:bg-gray-200 text-gray-700 outline-none select-none rounded-md data-[highlighted]:bg-gray-200 data-[highlighted]:rounded"
                // className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Your Profile
              </Link>
            </DropdownMenu.Item>
            {/* Settings */}
            <DropdownMenu.Item className="outline-none">
              <Link
                href="/settings"
                className="dark:text-white dark:hover:bg-zinc-700 block px-4 py-2 text-sm hover:bg-gray-200 rounded-md text-gray-700 outline-none select-none data-[highlighted]:bg-gray-200 data-[highlighted]:rounded"
                // className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
            </DropdownMenu.Item>
            {/* Seperator / Divider */}
            <DropdownMenu.Separator className="h-[1px] bg-gray-500 bg-opacity-10 dark:bg-opacity-40 m-[5px]" />
            {/* Workspace Selector */}
            <DropdownMenu.Sub onOpenChange={setWorkspaceSelectorOpen}>
              <DropdownMenu.SubTrigger className="dark:text-white dark:hover:bg-zinc-700 py-2 px-3 gap-x-2 text-sm text-gray-700 flex items-center select-none outline-none data-[disabled]:pointer-events-none hover:bg-gray-200 rounded-md data-[highlighted]:bg-gray-200 data-[highlighted]:rounded-md data-[highlighted]:data-[state=open]:bg-gray-200">
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
                  className="dark:border dark:border-gray-600 dark:text-white dark:bg-black min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                  sideOffset={10}
                  alignOffset={-4}
                >
                  {workspaces &&
                    workspaces.map((workspace) => (
                      <DropdownMenu.Item
                        key={workspace.id}
                        className="rounded-md outline-none hover:bg-gray-200 dark:hover:bg-black"
                      >
                        <Link
                          href={`/workspace/${workspace.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 rounded-md outline-none select-none dark:text-white dark:hover:bg-zinc-700"
                        >
                          {workspace.name}
                        </Link>
                      </DropdownMenu.Item>
                    ))}
                  {/* Seperator / Divider */}
                  <DropdownMenu.Separator className="h-[1px] bg-gray-500 bg-opacity-10 dark:bg-opacity-40 m-[5px]" />
                  {/* Create Workspace Button */}
                  <DropdownMenu.Item className="outline-none">
                    <Link
                      href="/create"
                      className="dark:text-white dark:hover:bg-zinc-700 flex justify-between items-center px-4 py-2 text-sm hover:bg-gray-200 rounded-md text-gray-700 outline-none select-none data-[highlighted]:bg-gray-200 data-[highlighted]:rounded-md"
                    >
                      Create new
                      <PlusIcon />
                    </Link>
                  </DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
            {/* Seperator / Divider */}
            <DropdownMenu.Separator className="h-[1px] bg-gray-500 bg-opacity-10 dark:bg-opacity-40 m-[5px]" />
            {/* Dark Mode Switch */}
            <DropdownMenu.Item
              disabled
              onClick={() => {}}
              className="dark:text-white h-min dark:hover:bg-zinc-700 flex justify-between px-4 py-2 text-sm hover:bg-gray-100 rounded-md text-gray-700 select-none outline-none data-[highlighted]:bg-gray-200 data-[highlighted]:rounded"
            >
              <span>Dark Mode</span>
              <DarkModeSwitch />
            </DropdownMenu.Item>
            {/* Sign Out */}
            <DropdownMenu.Item
              className="dark:text-white dark:hover:bg-zinc-700 block px-4 py-2 text-sm hover:bg-gray-100 rounded-md text-gray-700 select-none outline-none data-[highlighted]:bg-gray-200 data-[highlighted]:rounded"
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
