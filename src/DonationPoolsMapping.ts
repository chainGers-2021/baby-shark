import {
  OwnershipTransferred,
  newDonation,
  newDonationWithdrawal,
  newRecipientAdded,
  recipientDeactivated,
  recipientReactivated,
} from "../generated/DonationPools/DonationPools";

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlenewDonation(event: newDonation): void {}

export function handlenewDonationWithdrawal(
  event: newDonationWithdrawal
): void {}

export function handlenewRecipientAdded(event: newRecipientAdded): void {}

export function handlerecipientDeactivated(event: recipientDeactivated): void {}

export function handlerecipientReactivated(event: recipientReactivated): void {}
