const mongoose = require('mongoose');
const User=mongoose.model('User')
module.exports = async ()=>{
    const user = await new User({
        googleId: 'randomId',
        displayName: 'random name'
    }).save();
    return user;
}