import { sveltekit } from '@sveltejs/kit/vite';
// import { defineConfig } from 'vitest/config';

import { type ViteDevServer, defineConfig } from 'vite'
// import { Server } from 'socket.io'
// import { setupConnections } from "./websockets.js";

// const webSocketServer = {
// 	name: 'webSocketServer',
// 	configureServer(server: ViteDevServer) {
// 		if (!server.httpServer) return

// 		const io = new Server(server.httpServer)

// 		setupConnections(io);
// 	}
// }

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
