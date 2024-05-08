import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const Route = createRootRoute({
    component: () => (
        <>
            {import.meta.env.DEV && (
                <div>
                    <div className="fixed bottom-0 left-0 p-2 bg-black text-white z-50">
                        <p className="font-bold text-xl">
                            Running in Development Mode
                        </p>
                        <p>
                            See routes @ <pre>src/routes/*</pre>
                        </p>
                        <p>
                            Edit this file at <pre>src/routes/__root.tsx</pre>
                        </p>
                        <div className="flex flex-row gap-4">
                            <Link className="bg-gray-500" to="/">
                                Home
                            </Link>
                            <Link className="bg-gray-500" to="/game">
                                Game
                            </Link>
                            <Link className="bg-gray-500" to="/render">
                                Render Demo
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            <Outlet />
            {/* <ReactQueryDevtools /> */}
            {/* <TanStackRouterDevtools /> */}
        </>
    ),
});
