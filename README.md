# how to use and develop this group project

regular POST and GET requests should be done in the +server.ts files

any websocket stuff should be done in the websocket.ts file

you shouldn't have to change the server.ts file

## get started with development

- clone this repo
- run `npm i` (only required the first time you clone it, and whenever dependencies change)
- when that's finished, run `npm run dev`
- this should start a server. there are instructions in the terminal for how to use the server

## building

- `npm run testbuildandprod` will create a build and run it (to test what the website will be like in production)
- `npm run properbuildandprod` will create a build and run it, this time everything that is required fo the website will be in the dist directory. all that needs to be run is `node dist/server.js` to run the project

## the database

- this has not been added yet and will need to be run alongside the app
- e.g. pocketbase, mysql, sqllite, or something