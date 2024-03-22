const mongoose = require('mongoose');
const User = require('../model/schema/user');
const Apikey = require('../model/schema/apikey');

const bcrypt = require('bcrypt');

const connectDB = async (DATABASE_URL, DATABASE) => {
    try {
        const DB_OPTIONS = {
            dbName: DATABASE
        }

        mongoose.set("strictQuery", false);
        await mongoose.connect(DATABASE_URL, DB_OPTIONS);

        let adminExisting = await User.find({ role: 'admin' });
        console.log(adminExisting)

        if (adminExisting.length <= 0) {
            
            const phoneNumber = 7874263694
            const firstName = 'GRP Leads'
            const lastName = 'Info'
            const username = 'admin123@gmail.com'
            const password = 'admin$123'
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            // Create a new user
            const user = new User({ _id: new mongoose.Types.ObjectId('65d33173fd7ff3fa0924a119'), username, password: hashedPassword, firstName, lastName, phoneNumber, role: 'admin' });
            
            // Save the user to the database
            await user.save();
            console.log("Admin created successfully..");
        } else if (adminExisting[0].deleted === true) {
            await User.findByIdAndUpdate(adminExisting[0]._id, { deleted: false });
            console.log("Admin Update successfully..");
        }else{
            console.log("not configured")
        }

        console.log("Database Connected Successfully..");
    } catch (err) {
        console.log("Database Not connected", err.message);
    }
}
module.exports = connectDB