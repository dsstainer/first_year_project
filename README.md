# how to use and develop this group project

regular POST and GET requests should be done in the +server.ts files

any websocket stuff should be done in the websocket.ts file

you shouldn't have to change the server.ts file

## get started with development

- clone this repo
- run `npm i -y` (only required the first time you clone it, and whenever dependencies change)
- when that's finished, run `npm run all-dev`, this will start the database, the svelte website, and the websockets server
- you can see instructions for the servers in the terminal
- you can start the porcesses in different terminals if you want with: `npm run pb-start`, `npm run es-dev`, and `npm run svelte-dev`
- you'll know its working when the websockets page shows connected, gets a record from the database, and sends some messages

## important notes

- you may have to set set a rule in pocketbase to allow acess to the database.
- To do this, start the pb database with `npm run pb-start` or `npm run all-dev`.
- Then navifate to the collection (table) you want to use, click settings -> API rules -> set custom rule on eveything.
- This remove the need for authentication.
- We might add authentication into the app in the future.

## building (you can ignore this for now)

- `npm run build` will build the website in a build folder which can be previewed with `npm run preview`
- `npm run ws-start` will run the ws server in a non-development mode
- `npm run pb-start` will run the pb server (same as development)