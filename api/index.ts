import { createApplication } from "../server/application";
import { createBlobStore } from "../server/storage";

export default { fetch: createApplication(createBlobStore()) };
