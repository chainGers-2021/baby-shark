import {
  OwnershipTransferred,
  newDeposit,
  newPoolCreated,
  newTokenAdded,
  newWithdrawal,
  totalPoolDeposit,
  totalPoolScaledDeposit,
  totalUserScaledDeposit,
  verified,
} from "../generated/PublicPools/PublicPools";

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlenewDeposit(event: newDeposit): void {}

export function handlenewPoolCreated(event: newPoolCreated): void {}

export function handlenewTokenAdded(event: newTokenAdded): void {}

export function handlenewWithdrawal(event: newWithdrawal): void {}

export function handletotalPoolDeposit(event: totalPoolDeposit): void {}

export function handletotalPoolScaledDeposit(
  event: totalPoolScaledDeposit
): void {}

export function handletotalUserScaledDeposit(
  event: totalUserScaledDeposit
): void {}

export function handleverified(event: verified): void {}
