import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { useState } from "react";
import { Header } from "../components/head";
import { SEO } from "../components/seo";

export default function Home() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("example-room");

  return (
    <div>
      <SEO />

      <Head>
        <title>SyncRelay Next.js Demo</title>
        <meta name="description" content="SyncRelay Next.js Demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="grid place-items-center space-y-8">
        <p>
          Join a room to receive messages sent to the topic{" "}
          <span className="p-1 bg-gradient-to-r text-white from-indigo-500 to-blue-500 rounded-md">
            /rooms/{roomName}
          </span>
        </p>

        <form
          className="flex space-x-2"
          onSubmit={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <input
            className="p-2 border border-black rounded-md"
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Room Name"
          />

          <button
            type="submit"
            className="p-2 border border-black rounded-md"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              router.push(`/rooms/${roomName}`);
            }}
          >
            Join Room
          </button>
        </form>
      </main>
    </div>
  );
}
