const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({

    name: {
        type:String,
        required:[true,"please enter your name"],
        maxLength:[30,"name cannot exceed 30 character"],
        minLength:[4,"name should be greater than 4 character"]
    },

    email:{
        type:String,
        required:[true,"please enter your email"],
        unique:true,
        validator:[validator.isEmail,"please enter valid email"]
    },
    password:{
        type:String,
        required:[true,"please enter valid password"],
        minLength:[8,"password should be greater than 8 character"],
        select:false
    },
    avatar:{

            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
    },
    role:{
        type:String,
        default:"user"
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date
}
)

const dotenv = require("dotenv");
dotenv.config({path:"backend/config/config.env"});

userSchema.pre("save", async function(next){
    
    if(!this.isModified("password"))
    {
        next();
    }

    this.password = await bcrypt.hash(this.password,10);
})

//JWT Token
userSchema.methods.getJWTToken = function () {

    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

//compare password
userSchema.methods.comparePassword = async function(enteredPassword){

    return await bcrypt.compare(enteredPassword,this.password);
};

//generating password reset token

userSchema.methods.getResetPasswordToken = function() {

    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding reset reset password token to userSchema

    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire = Date.now + 15*60*1000;

    return resetToken;
}

module.exports = mongoose.model("user",userSchema);