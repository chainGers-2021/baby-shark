import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";

import {
  OwnershipTransferred,
  newDeposit,
  newPoolCreated,
  newWithdrawal,
  totalPoolDeposit,
  totalPoolScaledDeposit,
  verified,
  totalUserScaledDeposit,
} from "../generated/PrivatePools/PrivatePools";

import { Pool, Symbol, User, UserPool } from "../generated/schema";

//not to implement
export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

//not to implement
export function handlenewDeposit(event: newDeposit): void {
  let pool = Pool.load(event.params._poolName);

  const ID = event.params._sender
    .toHexString()
    .concat("-")
    .concat(pool.symbol);
  let symbol = Symbol.load(ID);

  if (!symbol) {
    let symbol = new Symbol(ID);
    symbol.totalDeposit = event.params._amount;
    symbol.symbol = pool.symbol;
    symbol.user = event.params._sender.toHexString();
    symbol.eligibleForNFT = true;

    symbol.save();
  } else {
    let totalDeposit = symbol.totalDeposit;
    totalDeposit = totalDeposit.plus(event.params._amount);
    symbol.totalDeposit = totalDeposit;
    symbol.eligibleForNFT = true;

    symbol.save();
  }
}

export function handlenewPoolCreated(event: newPoolCreated): void {
  let pool = new Pool(event.params._poolName);
  pool.owner = event.params._owner.toHexString();
  pool.symbol = event.params.symbol;
  pool.totalDeposit = BigInt.fromI32(0);
  pool.users = [];
  pool.history = [BigInt.fromI32(0)];
  pool.timestamps = [event.params._timestamp];
  pool.privatePool = true;
  pool.targetPrice = event.params._targetPrice;

  pool.save();
}

//not to implement
export function handlenewWithdrawal(event: newWithdrawal): void {
  let pool = Pool.load(event.params._poolName);
  const ID = event.params._sender
    .toHexString()
    .concat("-")
    .concat(pool.symbol);
  let symbol = Symbol.load(ID);

  let totalDeposit = symbol.totalDeposit;
  totalDeposit = totalDeposit.minus(event.params._amount);
  symbol.totalDeposit = totalDeposit;

  if (totalDeposit.equals(BigInt.fromI32(0))) {
    symbol.eligibleForNFT = false;
  }

  symbol.save();
}

export function handletotalPoolDeposit(event: totalPoolDeposit): void {
  let pool = Pool.load(event.params._poolName);
  pool.totalDeposit = event.params._amount;

  let history = pool.history;
  history.push(event.params._amount);
  pool.history = history;

  let timestamps = pool.timestamps;
  timestamps.push(event.params._timestamp);
  pool.timestamps = timestamps;

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
  let pool = Pool.load(event.params._poolName);

  //checks if the user exists
  if (!user) {
    // if user doesn't exists creates a new user
    let user = new User(event.params._sender.toHexString());
    user.pools = [pool.id];
    user.eligibleForNFT = true;
    user.save();
  } else if (user.pools.indexOf(pool.id) === -1) {
    // checks if the pool exists for user
    // adds the pool for user if doesn't
    let pools = user.pools;
    pools.push(pool.id);
    user.pools = pools;
    user.eligibleForNFT = true;
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

    userPool.history = [event.params._amount];
    userPool.timestamps = [event.params._timestamp];

    userPool.save();
  } else {
    userPool.totalDeposit = event.params._amount;

    let history = userPool.history;
    history.push(event.params._amount);
    userPool.history = history;

    let timestamps = userPool.timestamps;
    timestamps.push(event.params._timestamp);
    userPool.timestamps = timestamps;

    userPool.save();
  }
}

export function handleverified(event: verified): void {
  let pool = Pool.load(event.params._poolName);

  let users = pool.users;
  users.push(event.params._sender.toHexString());
  pool.users = users;
  pool.save();
}

const createKey = (user: Address, pool: string): string => {
  return user
    .toHexString()
    .concat("-")
    .concat(pool);
};
