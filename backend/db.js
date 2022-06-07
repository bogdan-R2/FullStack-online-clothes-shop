const {MongoClient} = require('mongodb');
async function connect() {
    const uri = "mongodb+srv://doadmin:CybUJ0125FgD6839@db-mongodb-fra1-19525-f7705d60.mongo.ondigitalocean.com/admin?authSource=admin&tls=true&tlsCAFile=ca-certificate.crt";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("successfully connected");
    } catch (e) {
        console.error(e);
    }
    finally {
        return client;
    }
}
const client = connect();

module.exports = {
    client
}
