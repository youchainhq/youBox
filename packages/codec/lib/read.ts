import * as StorageRead from "@youbox/codec/storage/read";
import * as StackRead from "@youbox/codec/stack/read";
import * as BytesRead from "@youbox/codec/bytes/read";
import * as AstConstantRead from "@youbox/codec/ast-constant/read";
import * as TopicRead from "@youbox/codec/topic/read";
import * as SpecialRead from "@youbox/codec/special/read";
import * as Pointer from "@youbox/codec/pointer";
import { DecoderRequest } from "@youbox/codec/types";
import * as Evm from "@youbox/codec/evm";

export default function* read(
  pointer: Pointer.DataPointer,
  state: Evm.EvmState
): Generator<DecoderRequest, Uint8Array, Uint8Array> {
  switch (pointer.location) {
    case "stack":
      return StackRead.readStack(pointer, state);

    case "storage":
      return yield* StorageRead.readStorage(pointer, state);

    case "memory":
    case "calldata":
    case "eventdata":
    case "returndata":
      return BytesRead.readBytes(pointer, state);

    case "stackliteral":
      return StackRead.readStackLiteral(pointer);

    case "definition":
      return AstConstantRead.readDefinition(pointer);

    case "special":
      return SpecialRead.readSpecial(pointer, state);

    case "eventtopic":
      return TopicRead.readTopic(pointer, state);
  }
}
