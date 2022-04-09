const mongoose = require('mongoose');
const redis=require('redis');
const keys=require('../config/keys')
const client=redis.createClient(keys.redisUrl);
const util=require('util');
client.hget=util.promisify(client.hget)

const exec=mongoose.Query.prototype.exec;


mongoose.Query.prototype.exec= async function () {
    if(!this._doCache){
        return await exec.apply(this,arguments);
    }
    const cacheObject=Object.assign({}, this.getQuery(),{
        collection:this.mongooseCollection.name
    })
    const cacheKey=JSON.stringify(cacheObject);
    const cachedContent=await client.hget(this._hashKey,cacheKey);
    if(cachedContent){
        const doc=JSON.parse(cachedContent)

        return Array.isArray(doc) ?
            doc.map(d=>new this.model(d)) :
            new this.model(doc)
    }
    const content=await exec.apply(this,arguments);
    client.hset(this._hashKey,cacheKey,JSON.stringify(content))

    return content;
}

mongoose.Query.prototype.cache= function (options={}) {
    this._doCache=true;
    this._hashKey=JSON.stringify(options.key || '');
    return this;
}

module.exports={
    clearHash(key){
        console.log('clear cache was called');
        console.log(key);
        client.del(JSON.stringify(key))
    }
}