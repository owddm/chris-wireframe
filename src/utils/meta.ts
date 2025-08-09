import metaData from "../../content/meta.json";

export interface MetaData {
  commitDate: string;
  commitHash: string;
  repository: string;
}

export const meta: MetaData = metaData;
