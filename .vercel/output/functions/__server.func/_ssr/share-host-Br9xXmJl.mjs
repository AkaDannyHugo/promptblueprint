import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/share-host-Br9xXmJl.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getShareHost_createServerFn_handler = createServerRpc({
	id: "7f28a29e7d37bf13e303c5bec4358d18da820f2ca2b6fbbb96e791f11f12a40d",
	name: "getShareHost",
	filename: "src/lib/og/share-host.ts"
}, (opts) => getShareHost.__executeServer(opts));
var getShareHost = createServerFn({ method: "GET" }).handler(getShareHost_createServerFn_handler, async () => {
	const { shareHostFromRequest } = await import("./share-host.server-qRnVvEYk.mjs");
	return shareHostFromRequest();
});
//#endregion
export { getShareHost_createServerFn_handler };
