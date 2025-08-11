import OGDefault from "../components/OG/OGDefault";
import { createOGImageRoute } from "../utils/og";

export const GET = createOGImageRoute(async () => {
  return {
    component: OGDefault,
    cacheKeyData: { page: "default" },
    props: {},
  };
});
