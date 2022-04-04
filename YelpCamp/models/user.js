const mongoose = require('mongoose');
const Schema = mongoose.Schema; // to samo co const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
    email: {
        type: String, 
        required: true,
        unique: true
    }
});

//***********************
// Tutaj dadawany jest z automatu username, password do modelu
// Wszystko pochodzi z passporta, https://github.com/saintedlama/passport-local-mongoose
// You're free to define your User how you like. Passport-Local Mongoose will add a username, 
// hash and salt field to store the username, the hashed password and the salt value.
//***********************
UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", UserSchema);