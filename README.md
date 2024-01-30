# how to use and develop this group project

regular POST and GET requests can be done in the +server.ts files

any websocket stuff can be done in the websocket.ts file

## get started with development

- clone this repo
- run `npm i -y` (only required the first time you clone it, and whenever dependencies change)
- when that's finished, run `npm run all-dev`, this will start the database, the svelte website, and the websockets server
- you can see instructions for the servers in the terminal
- you can start the porcesses in different terminals if you want with: `npm run pb-start`, `npm run es-dev`, and `npm run svelte-dev`
- you'll know its working when the websockets page shows connected, gets a record from the database, and sends some messages

## important notes

- if you create a new table, you may have to set set a rule in pocketbase to allow acess to the database.
- To do this, start the pb database with `npm run pb-start` or `npm run all-dev`.
- Then navigate to the collection (table) you want to use, click settings -> API rules -> set custom rule on eveything.
- We might add authentication into the app in the future

## dev

- create your branch with `git branch <your name>`
- please make changes on your branch
- then push with `git push origin <your name>`
- once you've finished a page/feature you can click on the create merge request button
- make sure to uncheck "delete source branch"
- create the merge request and get someone else to check it if its a big change
- if you want to update your local main branch to the one on gitlab you can do `git pull` when on your local main branch

## group members

- Jonathan Wilson

to get started, can everyone:
- clone this repo
- branch to your own branch
- add your name to the list above
- push to your branch on gitlab with `git push origin <your name>`
- create a merge request (there whould be a button at the top of gitlab after you pushed)
