"use client";

import ListboxSkeletonLoader from "@/components/ListboxSkeletonLoader";
import { Step, Steps } from "@/components/Steps";
import { Bot } from "@/util/providers/BotProvider";
import { Workspace } from "@/util/providers/WorkspaceProvider";
import { useWorkspacesContext } from "@/util/providers/WorkspacesProvider";
import getStripe from "@/util/stripe";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import * as Form from "@radix-ui/react-form";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { RESTAPIPartialCurrentUserGuild } from "discord-api-types/v10";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { Stripe } from "stripe";

export default function Create() {
  const [newWorkspace, setNewWorkspace] = useState<Partial<Workspace>>();
  const [newBot, setNewBot] = useState<Partial<Bot>>();
  const [userServers, setUserServers] =
    useState<RESTAPIPartialCurrentUserGuild[]>();
  const [canFetchServers, setCanFetchServers] = useState(false);

  const { session } = useSessionContext();
  const { workspaces } = useWorkspacesContext();

  useEffect(() => {
    if (session && workspaces) {
      fetch("https://discord.com/api/v10/users/@me/guilds", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.provider_token}`,
          "Content-Type": "application/json",
        },
      })
        .then((r) => r.json())
        .then((guilds: RESTAPIPartialCurrentUserGuild[]) => {
          const g = guilds
            .filter(
              (guild) =>
                !workspaces.some((w) => w.guild_id === guild.id) &&
                parseInt(guild.permissions) & 0x32
            )
            .reverse();

          setUserServers(g);
        });
    }
  }, [canFetchServers]);

  useEffect(() => {
    if (session && workspaces) {
      setCanFetchServers(true);
    }
  }, [session, workspaces]);

  const stepOneContinue: () => boolean = () => {
    if (newWorkspace && newBot) {
      return !!newWorkspace.name && !!newWorkspace.guild_id && !!newBot.token;
    } else {
      return false;
    }
  };

  const beforeStepTwo = async (): Promise<boolean> => {
    if (!newBot) {
      toast.error("No bot token provied.");
      return false;
    }
    return fetch(`/api/discord/users/@me`, {
      method: "GET",
      headers: {
        Authorization: `Bot ${newBot.token}`,
        "Content-Type": "application/json",
      },
    }).then((r) => {
      if (r.ok) {
        toast.success("Bot Token OK!");
        return true;
      } else {
        toast.error("Bot Token Invalid.");
        return false;
      }
    });
  };

  return (
    <div className="h-full p-6">
      <h1 className="pt-5 pb-2 text-4xl font-bold text-black dark:text-white animate-slideLeftAndFade">
        We&apos;re glad you&apos;re joining us! ✨
      </h1>
      <h3 className="flex pb-5 text-lg text-gray-800 dark:text-gray-200 animate-slideLeftAndFade">
        Let&apos;s get started.
      </h3>
      <Form.Root>
        <Steps>
          <Step
            title="Basic Details"
            canContinue={stepOneContinue()}
            beforeNext={beforeStepTwo}
          >
            <StepOne
              newWorkspace={newWorkspace}
              setNewWorkspace={setNewWorkspace}
              newBot={newBot}
              setNewBot={setNewBot}
              userServers={userServers}
            />
          </Step>
          <Step title="Payment">
            <StepTwo newWorkspace={newWorkspace} />
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
      </Form.Root>
    </div>
  );
}

function StepOne({
  newWorkspace,
  setNewWorkspace,
  newBot,
  setNewBot,
  userServers,
}: {
  newWorkspace: Partial<Workspace | undefined>;
  setNewWorkspace: Dispatch<SetStateAction<Partial<Workspace> | undefined>>;
  newBot: Partial<Bot | undefined>;
  setNewBot: Dispatch<SetStateAction<Partial<Bot> | undefined>>;
  userServers: RESTAPIPartialCurrentUserGuild[] | undefined;
}) {
  return (
    <>
      <Form.Field className="grid mb-[10px] w-full" name="name">
        <div className="flex items-baseline justify-between">
          <Form.Label className="text-[15px] font-medium leading-[35px] dark:text-white text-black">
            Workspace Name
          </Form.Label>
          <Form.Message
            className="text-[13px] text-white opacity-[0.8]"
            match="valueMissing"
          >
            Please enter a name
          </Form.Message>
          <Form.Message
            className="text-[13px] text-white opacity-[0.8]"
            match="typeMismatch"
          >
            Please provide a valid name
          </Form.Message>
        </div>

        <Form.Control asChild>
          <input
            className="w-full p-2 text-sm font-normal bg-white border border-gray-600 rounded-md shadow-sm outline-none resize-none focus:border-gray-300 dark:focus:border-gray-400 h-max dark:bg-black dark:text-white dark:shadow-none"
            placeholder="Enter a workspace name"
            type="text"
            required
            onChange={(e) =>
              setNewWorkspace((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </Form.Control>
      </Form.Field>

      <Form.Field className="grid mb-[10px] w-full" name="guild">
        <div className="flex items-baseline justify-between">
          <Form.Label className="text-[15px] font-medium leading-[35px] dark:text-white text-black">
            What server should this be attached to?
          </Form.Label>
          <Form.Message
            className="text-[13px] text-white opacity-[0.8]"
            match="valueMissing"
          >
            Please select a server
          </Form.Message>
          <Form.Message
            className="text-[13px] text-white opacity-[0.8]"
            match="typeMismatch"
          >
            Please select a valid server
          </Form.Message>
        </div>
        {userServers ? (
          <Listbox
            value={newWorkspace?.guild_id}
            onChange={(value) =>
              setNewWorkspace((prev) => ({
                ...prev,
                guild_id: value,
              }))
            }
          >
            <div className="relative col-span-6">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:border-gray-300 focus:dark:border-gray-400 dark:text-white dark:bg-black dark:border dark:border-gray-600 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">
                  {newWorkspace?.guild_id ? (
                    userServers.find(
                      (guild) => guild.id === newWorkspace.guild_id
                    )?.name
                  ) : (
                    <span className="text-gray-400">Select a guild</span>
                  )}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronUpDownIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-50 grid w-full gap-0 px-1 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg dark:bg-black dark:text-white dark:border dark:border-gray-600 max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {userServers.map((guild, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active, selected }) =>
                        `text-center relative cursor-default select-none rounded-md dark:text-white py-2 px-10 dark:hover:bg-zinc-700 hover:bg-gray-200 hover:rounded-md ${
                          active ? "bg-zinc-700 text-white" : "text-gray-900"
                        } ${
                          selected
                            ? "bg-zinc-900 text-white font-bold"
                            : "font-normal"
                        }`
                      }
                      value={guild.id}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {guild.name}
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
        ) : (
          // skeleton loader
          <ListboxSkeletonLoader />
        )}
      </Form.Field>

      <Form.Field className="grid mb-[10px] w-full" name="name">
        <div className="flex items-baseline justify-between">
          <Form.Label className="text-[15px] font-medium leading-[35px] dark:text-white text-black">
            Bot Token
          </Form.Label>
          <Form.Message
            className="text-[13px] text-white opacity-[0.8]"
            match="valueMissing"
          >
            Please enter a token
          </Form.Message>
          <Form.Message
            className="text-[13px] text-white opacity-[0.8]"
            match="typeMismatch"
          >
            Please provide a valid token
          </Form.Message>
        </div>
        <Form.Control asChild>
          <input
            className="w-full p-2 text-sm font-normal bg-white border border-gray-600 rounded-md shadow-sm outline-none resize-none focus:border-gray-300 dark:focus:border-gray-400 h-max dark:bg-black dark:text-white dark:shadow-none"
            placeholder="From the Discord Developer Portal"
            type="password"
            required
            onChange={(e) =>
              setNewBot((prev) => ({
                ...prev,
                token: e.target.value,
              }))
            }
          />
        </Form.Control>
      </Form.Field>
    </>
  );
}

function StepTwo({
  newWorkspace,
}: {
  newWorkspace: Partial<Workspace | undefined>;
}) {
  const [subscription, setSubscription] = useState<Stripe.Subscription>();
  const { session } = useSessionContext();
  useEffect(() => {
    async function createSubscription() {
      fetch("/api/stripe/createSubscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.access_token as string,
        },
        body: JSON.stringify({
          workspace: newWorkspace,
        }),
      })
        .then((r) => {
          if (r.ok) {
            return r.json();
          } else {
            throw new Error("Failed to create subscription");
          }
        })
        .then((data) => {
          setSubscription(data);
        });
    }

    createSubscription();
  }, []);

  return (
    <div>
      {subscription ? (
        <Elements
          stripe={getStripe()}
          options={{
            clientSecret: (subscription?.latest_invoice as any)?.payment_intent,
            mode: "subscription",
          }}
        >
          <PaymentElement />
        </Elements>
      ) : (
        <div>loading Stripe...</div>
      )}
    </div>
  );
}
