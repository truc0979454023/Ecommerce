"use strict";

const { promisify } = require("util");

const { getRedis } = require("../dbs/init.redis");
const { instanceConnect: redisClient } = getRedis();

// const redis = require("redis");
// const redisClient = redis.createClient();

const pexpire = promisify(redisClient?.pexpire).bind(redisClient);
const setnsAsync = promisify(redisClient?.setnx).bind(redisClient);

//khóa bi quan và khóa lạc quan khi người kia vào mua hàng
// thì sẽ nhận 1 khóa chờ người đó mua xong trả khóa cho người tiếp theo
const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v203_${productId}`;
  const retryTimes = 10; //cho phép thử lại
  const expireTime = 3000; // tạm lock

  for (let i = 0; i < retryTimes.length; i++) {
    //tạo 1 key, thàng nào nắm thì được vào thanh toán
    const result = await setnsAsync(key, expireTime);
    console.log(`result::`, result);
    if (result === 1) {
      //thao tác inventory
      const isReversation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReversation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }

      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50)); // thử lại đc retryTimes lần mỗi lần cách nhau 50ms
    }
  }
};

//giải phóng khóa
const releaseLock = async (keyLock) => {
  const deleteAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await deleteAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
