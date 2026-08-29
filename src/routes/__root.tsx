import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import React from "react";

const RootLayout = () => (
  <React.Fragment>
    <Outlet />
    <TanStackRouterDevtools />
  </React.Fragment>
);

export const Route = createRootRoute({ component: RootLayout });
