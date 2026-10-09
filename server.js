require('dotenv').config();
const app = require('./src/app.js');
const connectdb = require('./src/config/db.js');

async function startServer() {
    await connectdb();

    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}

startServer();
