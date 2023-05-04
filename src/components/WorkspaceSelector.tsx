import { Database } from "@/types/supabase";
import useWorkspaces from "@/util/useWorkspaces";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretSortIcon, PlusIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const DropdownMenuDemo = () => {
  const workspaces = useWorkspaces();
  const pathname = usePathname();

  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState("pedro");
  const [workspace, setWorkspace] =
    React.useState<Database["public"]["Tables"]["workspaces"]["Row"]>();

  useEffect(() => {
    const p = pathname.split("/");

    if (p[1] === "workspace" && workspaces) {
      const w = workspaces.find((ws) => ws.id === p[2]);
      setWorkspace(w);
    }
  }, [pathname, workspaces]);

  if (!workspaces) {
    return <p>Loading...</p>;
  }

  const handleWorkspaceChange = (
    workspace: Database["public"]["Tables"]["workspaces"]["Row"]
  ) => {
    setWorkspace(workspace);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="items-center hidden px-2 py-1 space-x-1 rounded-md cursor-pointer md:flex hover:bg-slate-300 dark:hover:bg-zinc-800">
          <div>
            <p className="font-bold dark:text-white">
              {workspace ? workspace.name : "Select a workspace..."}
            </p>
          </div>
          <button className="dark:text-white" aria-label="Select a workspace">
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
              key={workspace.id}
              onClick={() => handleWorkspaceChange(workspace)}
              className="group text-md text-semibold leading-none text-violet11 rounded-[3px] flex items-center p-[5px] relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
            >
              <Link
                href={`/workspace/${workspace.id}`}
                className="flex items-center"
              >
                {workspace.icon === null ? (
                  <div className="flex items-center justify-center w-12 h-12 font-semibold bg-blue-400 rounded-md text-blue-50">
                    {workspace.name?.at(0)?.toUpperCase()}
                  </div>
                ) : (
                  <Image
                    src={workspace.icon}
                    alt="Server Icon"
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                )}
                <div className="ml-4">{workspace.name}</div>
              </Link>
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator className="h-[1px] bg-violet6 m-[5px]" />

          <DropdownMenu.Item className="group text-md text-semibold leading-none text-violet11 rounded-[3px] p-[5px] relative select-none outline-none disabled:text-mauve8 disabled:pointer-events-none hover:bg-violet9 hover:text-violet1">
            <Link href="/create" className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 font-semibold bg-green-400 rounded-md text-green-50">
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
