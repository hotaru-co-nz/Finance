import * as Realm from "realm-web";
const {
    BSON: { ObjectId },
} = Realm;

const config = {
    appId: "hotaru_app-ygcyd",
    appUrl: "https://services.cloud.mongodb.com/groups/66160bee62131f7b08ed2cac/apps/6617a0f263d94d53574d4aab",
    baseUrl: "https://services.cloud.mongodb.com",
    clientApiBaseUrl: "https://ap-southeast-2.aws.services.cloud.mongodb.com",
    dataApiBaseUrl: "https://ap-southeast-2.aws.data.mongodb-api.com",
    dataExplorerLink:
        "https://cloud.mongodb.com/links/66160bee62131f7b08ed2cac/explorer/Hotaru/database/collection/find",
    dataSourceName: "mongodb-atlas",
    databaseName: "HOTARU_APP",
};

export default class Database {
    app;
    user;
    db;
    token;
    constructor() {
        this.app = new Realm.App({ id: config.appId, baseUrl: config.baseUrl });
    }

    async logIn(credential = { username: "lhinxue@gmail.com", password: "lhc1130" }) {
        try {
            const user = await this.app.logIn(
                Realm.Credentials.emailPassword(credential.username, credential.password)
            );
            return true;
        } catch (error) {
            return false;
        }
    }

    useCollection(collection) {
        return this.app.currentUser.mongoClient(config.dataSourceName).db(config.databaseName).collection(collection);
    }

    async find(table, query = {}) {
        const { condition, projection, sort, limit } = query;
        return await this.useCollection(table).find(condition, { projection, sort, limit });
    }

    async insert(table, data) {
        return await this.useCollection(table).insertMany(data);
    }

    async import(table, data) {
        const collection = this.useCollection(table);

        await collection.deleteMany({});
        await collection.insertMany(data);
    }

    async getUserData() {
        const id = this.app.currentUser.id;
        const users = this.useCollection("Users");
        const user = await users.find({ UID: id });
        if (user.length > 0) {
            return user[0];
        } else {
            await users.insertOne({ UID: id });
            return (await users.find({ UID: id }))[0];
        }
    }
}
