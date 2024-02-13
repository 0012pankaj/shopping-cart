const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        trim:true,
        required:true
    }, role:{
        type:String,
        required:true
    },  wishList:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ],
    cart:[
        {
            type: mongoose.Schema.Types.ObjectId , 
            ref: 'Product' //file name of model
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);