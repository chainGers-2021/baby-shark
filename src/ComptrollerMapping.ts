import {
  OwnershipTransferred,
  newTokenAdded,
} from "../generated/Comptroller/Comptroller";

import { Token } from "../generated/schema";

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlenewTokenAdded(event: newTokenAdded): void {
  let token = new Token(event.params._symbol);
  token.address = event.params._token.toHexString();

  token.save();
}
