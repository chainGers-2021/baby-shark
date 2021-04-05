import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";

import {
  OwnershipTransferred,
  newDeposit,
  newPoolCreated,
  newTokenAdded,
  newWithdrawal,
  totalPoolDeposit,
  totalPoolScaledDeposit,
  verified,
  totalUserScaledDeposit,
} from "../generated/PrivatePools/PrivatePools";

import { Pool, User, UserPool } from "../generated/schema";

//not to implement
export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

//not to implement
export function handlenewDeposit(event: newDeposit): void {}

export function handlenewPoolCreated(event: newPoolCreated): void {
  let pool = new Pool(event.params._poolName.toHexString());
  pool.owner = event.params._owner.toHexString();
  pool.symbol = event.params.symbol;
  pool.totalDeposit = BigInt.fromI32(75);
  pool.users = [];
  pool.history = [];

  pool.save();
}

//not to implement
export function handlenewTokenAdded(event: newTokenAdded): void {}

//not to implement
export function handlenewWithdrawal(event: newWithdrawal): void {}

export function handletotalPoolDeposit(event: totalPoolDeposit): void {
  let pool = Pool.load(event.params._poolName.toHexString());
  pool.totalDeposit = event.params._amount;
  let history = pool.history;
  history.push(event.params._amount);
  pool.history = history;

  pool.save();
}

//not to implement
export function handletotalPoolScaledDeposit(
  event: totalPoolScaledDeposit
): void {}

export function handletotalUserScaledDeposit(
  event: totalUserScaledDeposit
): void {
  let user = User.load(event.params._sender.toHexString());
  let pool = Pool.load(event.params._poolName.toHexString());

  //checks if the user exists
  if (!user) {
    // if user doesn't exists creates a new user
    let user = new User(event.params._sender.toHexString());
    user.pools = [pool.id];
    user.pools.push(pool.id);
    user.save();

    let users = pool.users;
    users.push(user.id);
    pool.users = users;
    pool.save();
  } else if (user.pools.indexOf(pool.id) === -1) {
    // checks if the pool exists for user
    // adds the pool for user if doesn't
    let pools = user.pools;
    pools.push(pool.id);
    user.pools = pools;
    user.save();
  }

  // loads a userpool entity for user
  let userPoolID = createKey(event.params._sender, event.params._poolName);
  let userPool = UserPool.load(userPoolID);
  if (!userPool) {
    let userPool = new UserPool(userPoolID);
    userPool.user = event.params._sender.toHexString();
    userPool.pool = pool.id;
    userPool.totalDeposit = event.params._amount;

    userPool.save();
  } else {
    userPool.totalDeposit = event.params._amount;
    userPool.save();
  }
}

//not to implement
export function handleverified(event: verified): void {}

const createKey = (user: Address, pool: Bytes): string => {
  return user
    .toHexString()
    .concat("-")
    .concat(pool.toHexString());
};
