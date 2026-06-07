const dns = require("dns");
try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
    console.warn("Could not set DNS servers:", e.message);
}

const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected ${conn.connection.host}`);
    }
    catch (error) {
        console.error("MongoDB Connection Failed!");
        console.error(error.message);
        console.log("Server will continue running so non-database features (like Resume Analysis) can still be used. Please whitelist your IP in MongoDB Atlas to use database features.");
    }
};

module.exports = connectDB;
