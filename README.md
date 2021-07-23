# SyncRelay x Next.js Demo

This repository showcases an example application implementing [SyncRelay](https://syncrelay.com) for updates to its user interface. An API route takes care of provisioning consumer tokens using the [SyncRelay SDK for Node.js](https://www.npmjs.com/package/@syncrelay/node), while the client establishes a connection to the Live Endpoint using the [SDK for React](https://www.npmjs.com/package/@syncrelay/react).

## Getting started

Create an `.env.local` file containing the following variables

```
# Used by the API route (backend)
SYNCRELAY_ACCESS_TOKEN=<Your Access Token>
SYNCRELAY_PROJECT_ID=<Your Project ID>

# Used by the frontend
NEXT_PUBLIC_SYNCRELAY_LIVE_ENDPOINT=<Your Live Endpoint>
```

After setting this, simply start up the site

```
yarn dev
```

You can then enter a room name, or use the prefilled value, then submit or click the button to join the room. Once in the room, your browser will send a request to the `/api/token` route, requesting a consumer token. This is handled by using the SyncRelay SDK for Node.js and will simply perform an `authorizeConsumer` request to the SyncRelay API.

The obtained token is then returned to the client, which will connect to the configured live endpoint (this must match the project you obtained the consumer token for). Once connected, all received messages will be displayed in a list.

To send a message, either use the SDK or go into your project and send a message to the topic displayed in your room (`/rooms/<room Name>`).

While this application showcases the basic implementation of SyncRelay for reactive front-end applications, you would need to extend it for production use cases, for example to check if the user is allowed to receive messages in a given room.
