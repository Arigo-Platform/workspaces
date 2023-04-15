"use client";

import Button from "@/components/Button";
import useBotSettings from "@/util/useBotSettings";
import useWorkspace from "@/util/useWorkspace";
import { APIRole } from "discord-api-types/v10";
import { Fragment, useEffect, useReducer, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import {
  ArrowTopRightOnSquareIcon,
  ChevronUpDownIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";
import { Database } from "@/types/supabase";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import ChipInput from "@/components/ChipInput";
import Link from "next/link";
import { toast } from "sonner";
import Tooltip from "@/components/Tooltip";
import * as Separator from "@radix-ui/react-separator";
import Switch from "@/components/Switch";

type PermissionsSet =
  Database["public"]["Tables"]["workspace_permissions"]["Row"];

type Permission = Database["public"]["Tables"]["permissions"]["Row"];
export default function PemissionsPage({ params }: { params: { id: string } }) {
  const { workspace } = useWorkspace(params.id);
  const { botSettings } = useBotSettings(params.id);
  const [roles, setRoles] = useState<APIRole[]>([]);
  const [availableRoles, setAvailableRoles] = useState<APIRole[]>([]);
  const [currentPermissions, setCurrentPermissions] = useState<
    PermissionsSet[]
  >([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<PermissionsSet>();

  const [permissionsList, setPermissionsList] = useState<Permission[]>([]);

  const supabase = useSupabaseClient<Database>();

  const getRoles = async () => {
    if (!workspace || !botSettings) return;
    const c: APIRole[] = await fetch(
      `/api/discord/guilds/${workspace.guild_id}/roles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bot ${botSettings.token}`,
        },
      }
    ).then((res) => res.json());

    const filtered = c
      .filter((role) => {
        return role.name !== "@everyone";
      })
      .sort((a, b) => {
        return b.position - a.position;
      });

    setRoles(filtered);
  };

  const getCurrentPermissions = async () => {
    const { data, error } = await supabase
      .from("workspace_permissions")
      .select("*")
      .eq("workspace", workspace!.id);

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setCurrentPermissions(data);

      const available = roles.filter((role) => {
        return !data.some((perm) => perm.role === role.id);
      });

      setAvailableRoles(available);
    }
  };

  const getPermissionsList = async () => {
    const { data, error } = await supabase.from("permissions").select("*");

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setPermissionsList(data);
    }
  };

  const createNewPermissionSet = async (
    p: Partial<PermissionsSet>,
    existing?: boolean
  ) => {
    if (!workspace) return;

    if (existing) {
      const { error } = await supabase
        .from("workspace_permissions")
        .update({
          permissions: p.permissions!,
        })
        .eq("workspace", workspace.id)
        .eq("role", p.role!);

      if (error) {
        console.error(error);
        return;
      }

      setCurrentPermissions((prev) => {
        const index = prev.findIndex((perm) => perm.role === p.role!);
        prev[index].permissions = p.permissions!;
        console.log(index);
        return [...prev];
      });
    } else {
      const { error } = await supabase.from("workspace_permissions").insert({
        workspace: workspace.id,
        role: p.role!,
        permissions: p.permissions!,
      });

      if (error) {
        console.error(error);
        return;
      }

      const perm = {
        workspace: workspace.id,
        role: p.role!,
        permissions: p.permissions!,
      };

      setCurrentPermissions((prev) => [...prev, perm]);
    }
  };

  const deletePermissionSet = async (p: PermissionsSet) => {
    if (!workspace) return;

    const { error } = await supabase
      .from("workspace_permissions")
      .delete()
      .eq("workspace", workspace.id)
      .eq("role", p.role);

    if (error) {
      console.error(error);
      return;
    }

    setCurrentPermissions((prev) => {
      return prev.filter((perm) => perm.role !== p.role);
    });
  };

  useEffect(() => {
    getPermissionsList();
  }, []);

  useEffect(() => {
    getRoles();
  }, [workspace, botSettings]);

  useEffect(() => {
    if (workspace) {
      getCurrentPermissions();
    }
  }, [roles, workspace]);

  return (
    <section id="permissions">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-6">
        <header className="col-span-full">
          <p className="text-2xl font-medium dark:text-white animate-slideRightAndFade">
            Permissions
          </p>
        </header>

        <div className="col-span-full">
          <Button
            className="flex justify-center w-full "
            onClick={() => {
              setSelectedPermission(undefined);
              setModalOpen(true);
            }}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add Permission Set
          </Button>
        </div>

        <ul className="grid grid-cols-1 gap-2 col-span-full">
          {currentPermissions.length === 0 && (
            <div>
              <Separator.Root className="my-6 bg-gray-300 dark:bg-zinc-700 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px" />
              <p className="font-medium text-center dark:text-gray-400">
                There's nothing to show right now, add a permission above to get
                started
              </p>
            </div>
          )}
          {roles.length > 0 &&
            currentPermissions.map((perm) => {
              const role = roles.find((r) => r.id === perm.role);
              return (
                <li key={perm.role}>
                  <div className="flex items-center justify-between p-2 space-x-2 border rounded-lg dark:border-zinc-700 dark:bg-black">
                    <div className="flex items-center pl-2 space-x-2">
                      <Tooltip content={role?.id}>
                        <span className="text-sm font-medium dark:text-white">
                          {role?.name}
                        </span>
                      </Tooltip>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {perm.permissions.length} permission
                        {perm.permissions.length > 1 ? "s" : ""}
                      </span>
                      <Button
                        className="flex items-center justify-center"
                        onClick={() => {
                          setSelectedPermission(perm);
                          setModalOpen(true);
                        }}
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Button>
                      <Button
                        className="flex items-center justify-center"
                        onClick={() => {
                          deletePermissionSet(perm);
                        }}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </section>

      <PermissionsDialog
        open={modalOpen}
        setOpen={setModalOpen}
        onClose={(p, e) =>
          toast.promise(createNewPermissionSet(p, e), {
            loading: e
              ? "Updating permission set..."
              : "Creating permission set...",
            success: e ? "Updated permission set!" : "Created permission set!",
            error: e
              ? "Failed to update permission set."
              : "Failed to create permission set.",
          })
        }
        roles={availableRoles}
        existing={selectedPermission}
        permissionsList={permissionsList}
      />
    </section>
  );
}

function PermissionsDialog({
  open,
  setOpen,
  onClose,
  roles,
  existing,
  permissionsList,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose: (p: Partial<PermissionsSet>, existing?: boolean) => void;
  roles: APIRole[];
  existing?: PermissionsSet;
  permissionsList: Permission[];
}) {
  const [selectedRole, setSelectedRole] = useState<string>();
  const [permissions, setPermissions] = useState<string[]>([]);

  const [errors, setErrors] = useState<{
    role?: string;
    permissions?: string;
  }>({});

  useEffect(() => {
    if (existing) {
      setSelectedRole(existing.role);
      setPermissions(existing.permissions);
    } else {
      setSelectedRole(undefined);
      setPermissions([]);
    }
  }, [existing]);

  const handleOnClose = () => {
    setErrors({});
    if (selectedRole && permissions.length > 0) {
      onClose(
        {
          role: selectedRole,
          permissions,
        },
        !!existing
      );

      setOpen(false);

      setSelectedRole(undefined);
      setPermissions([]);
    } else {
      setErrors({
        role: selectedRole ? undefined : "Role is required",
        permissions:
          permissions.length > 0
            ? undefined
            : "At least one permission is required",
      });
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] space-y-2 left-[50%] max-h-[85vh] w-[90vw] max-w-5xl translate-x-[-50%] translate-y-[-50%] rounded-[6px] dark:bg-zinc-900 bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 dark:text-white m-0 text-[17px] font-medium pb-2">
            {existing ? "Modify" : "New"} Permission Set
          </Dialog.Title>

          {!existing && (
            <fieldset>
              <label
                className="text-zinc-700 dark:text-gray-100 w-[90px] text-right text-[15px]"
                htmlFor="role"
              >
                Role
              </label>

              <Listbox onChange={(value) => setSelectedRole(value)}>
                <div className="relative col-span-6">
                  <Listbox.Button className="relative w-full px-10 py-2 pl-3 text-left bg-white rounded-lg shadow-md cursor-default focus:border-gray-300 focus:dark:border-gray-400 dark:text-white dark:bg-black dark:border dark:border-gray-600 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">
                      {selectedRole
                        ? roles
                            .filter((role) => {
                              return role.id === selectedRole;
                            })
                            .map((role) => role.name)[0]
                        : "Select role"}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronUpDownIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>

                  {errors.role && (
                    <p className="mt-2 text-sm text-red-600" id="role-error">
                      {errors.role}
                    </p>
                  )}

                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-50 grid w-full gap-0 px-1 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg dark:bg-black dark:text-white dark:border dark:border-gray-600 max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {roles.map((role, index) => (
                        <Listbox.Option
                          key={role.id}
                          className={({ active, selected }) =>
                            `text-center relative cursor-default select-none rounded-md dark:text-white py-2 px-10 dark:hover:bg-zinc-700 hover:bg-gray-200 hover:rounded-md ${
                              active
                                ? "bg-zinc-700 text-white"
                                : "text-gray-900"
                            } ${
                              selected
                                ? "bg-zinc-900 text-white font-bold"
                                : "font-normal"
                            }`
                          }
                          value={role.id}
                          id={role.id}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {role.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800 dark:text-gray-200">
                                  <CheckIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </fieldset>
          )}

          <fieldset className="space-y-2">
            <label
              className="text-zinc-700 dark:text-gray-100 w-[90px] text-right text-[15px]"
              htmlFor="permissions"
            >
              Permissions
            </label>

            {errors.permissions && (
              <p className="mt-2 text-sm text-red-600" id="permissions-errorr">
                {errors.permissions}
              </p>
            )}

            {/* TODO: Permission Templates */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* separate permissions by the second item when the id is split by "." */}
              {permissionsList
                .reduce((acc: Permission[][], curr: Permission) => {
                  const key = curr.id.split(".")[1];
                  const index = acc.findIndex(
                    (a) => a[0].id.split(".")[1] === key
                  );
                  if (index === -1) {
                    acc.push([curr]);
                  } else {
                    acc[index].push(curr);
                  }
                  return acc;
                }, [])
                .map((ps: Permission[], index: number) => (
                  <div key={index}>
                    <p className="text-gray-500 dark:text-gray-400 capitalize text-[15px] font-medium">
                      {ps[0].id.split(".")[1]}
                    </p>
                    <div className="flex flex-col space-y-2">
                      {ps.map((permission) => (
                        <div
                          key={index}
                          className="flex items-center justify-between w-full"
                        >
                          <Switch
                            label={permission.name || permission.id}
                            defaultChecked={permissions.includes(permission.id)}
                            checked={permissions.includes(permission.id)}
                            onChange={(e) => {
                              if (e) {
                                setPermissions([...permissions, permission.id]);
                              } else {
                                setPermissions(
                                  permissions.filter((p) => p !== permission.id)
                                );
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </fieldset>

          <div className="mt-[25px] flex w-full justify-between items-center pt-5">
            <p className="text-sm font-normal text-gray-700 dark:text-white">
              <Link
                href="https://google.com"
                className="flex items-center space-x-1 text-blue-400 gap-x-1"
                target="_blank"
              >
                Learn more about permissions
                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </Link>
            </p>
            <div className="col-span-full">
              <Button
                className="flex items-center justify-center w-full px-4 py-2"
                onClick={handleOnClose}
              >
                {existing ? "Save" : "Create"}
              </Button>
            </div>
          </div>
          <Dialog.Close asChild>
            <button
              className="dark:text-black dark:hover:bg-zinc-300 hover:bg-violet4 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
