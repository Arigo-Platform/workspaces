import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";

export default function UserMenu() {
  const supabase = useSupabaseClient();
  const user = useUser();
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
          className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg outline-none"
          sideOffset={5}
          align="end"
        >
          <div className="py-1">
            <DropdownMenu.Item>
              <Link
                href="/profile"
                className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Your Profile
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Link
                href="/settings"
                className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Settings
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => supabase.auth.signOut()}
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:cursor-pointer"
            >
              Sign out
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
