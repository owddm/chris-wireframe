import type { APIRoute } from "astro";

import OGDefault from "../components/OG/OGDefault";
import { createOGImageHandler } from "../utils/og";

export const GET: APIRoute = async () => {
  return createOGImageHandler({
    component: OGDefault,
    props: {},
  });
};
