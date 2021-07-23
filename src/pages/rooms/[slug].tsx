import {
  useSyncRelay,
  ReceivedMessage,
  ConnectionState,
} from "@syncrelay/react";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Header } from "../../components/head";
import { SEO } from "../../components/seo";

const liveUrl = process.env.NEXT_PUBLIC_SYNCRELAY_LIVE_ENDPOINT;

export default function Room() {
  const router = useRouter();

  const room = router.query["slug"];

  return (
    <div>
      <SEO />

      <Head>
        <title>Room {room} - SyncRelay Next.js Demo</title>
        <meta name="description" content="SyncRelay Next.js Demo" />
      </Head>

      <Header />

      <main className="grid place-items-center">
        {liveUrl ? (
          typeof room === "string" ? (
            <WithConsumerToken liveUrl={liveUrl} room={room} />
          ) : (
            <p>Missing room name from URL</p>
          )
        ) : (
          <p>Missing NEXT_PUBLIC_SYNCRELAY_LIVE_ENDPOINT in environment</p>
        )}
      </main>
    </div>
  );
}

export function WithConsumerToken({
  room,
  liveUrl,
}: {
  room: string;
  liveUrl: string;
}) {
  const [consumerToken, setConsumerToken] = useState<string | null>(null);

  useEffect(() => {
    if (consumerToken) {
      return;
    }

    (async () => {
      const res = await fetch(`/api/token?room=${room}`);
      const body = await res.json();
      setConsumerToken(body.consumerToken);
    })();
  }, [consumerToken, room]);

  if (!consumerToken) {
    return null;
  }

  return (
    <LiveView room={room} consumerToken={consumerToken} liveUrl={liveUrl} />
  );
}

export function LiveView({
  consumerToken,
  room,
  liveUrl,
}: {
  consumerToken: string;
  room: string;
  liveUrl: string;
}) {
  const [messages, setMessages] = useState<ReceivedMessage<unknown>[]>([]);
  const [connectionState] = useSyncRelay(
    {
      receivedMessage: (message) => {
        setMessages((prev) => [message, ...prev]);
      },
    },
    {
      liveUrl,
      subscribeTo: [`/rooms/${room}`],
      consumerToken,
    }
  );

  return (
    <div className="grid place-items-center space-y-4">
      {connectionState === ConnectionState.Ready ? (
        <span className="text-green-500">✅ Connected</span>
      ) : connectionState === ConnectionState.Connecting ||
        connectionState === ConnectionState.Connected ? (
        <span className="text-yellow-500">⏱ Connecting</span>
      ) : connectionState === ConnectionState.Disconnected ? (
        <span className="text-red-500">❌ Disconnected</span>
      ) : null}

      {
        <p>
          Go on, send a message to{" "}
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(`/rooms/${room}`);
            }}
            className="cursor-pointer p-1 bg-gradient-to-r text-white from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 active:from-indigo-700 active:to-blue-700 rounded-md"
          >
            /rooms/{room} ✂️
          </button>{" "}
          and watch it appear below.
        </p>
      }

      <ul>
        {messages.map((m) => (
          <li key={m.id}>
            {new Date(m.sentAt).toLocaleString()}: {JSON.stringify(m.payload)}
          </li>
        ))}
      </ul>
    </div>
  );
}
