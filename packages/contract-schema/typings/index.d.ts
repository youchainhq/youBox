declare module "@youbox/contract-schema" {
  import { ContractObject } from "@youbox/contract-schema/spec";
  export { ContractObject } from "@youbox/contract-schema/spec";

  namespace Schema {
    export function normalize(dirtyObj: object, opts?: object): ContractObject;
  }

  export default Schema;
}
