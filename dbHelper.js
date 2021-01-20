const MongoClient = require('mongodb').MongoClient
const mongoClientOptions = { useUnifiedTopology: true, useNewUrlParser: true }

const uri = 'mongodb+srv://ukel-user-20:ukel-user-20@cluster0.mvr46.mongodb.net/sprinklr_db?retryWrites=true&w=majority'
const dbName = 'sprinklr_db'
var db = undefined

module.exports.connect = async () => {
	try {
        let client = await MongoClient.connect(uri, mongoClientOptions);
        db = client.db(dbName)
    }
    catch (error) {
    	console.log(error)
        throw new Error(error)
    }
}

module.exports.recordsCount = async () => {
	if (!db) {
		throw new Error('No connection to database')
	}

	try {
		let count = await db.collection("news").countDocuments({})
		return count;
	}
	catch (err) {
		return err
	}
}

module.exports.deleteFirstRecord = async () => {
	if (!db) {
		throw new Error('No connection to database');
	}

	try {
		var firstDoc = await db.collection("news").findOne()
		console.log(firstDoc["_id"])
		await db.collection("news").deleteOne({"_id": firstDoc["_id"]})
	}
	catch (err) {
		return err
	}
}

module.exports.deleteRecord = async (channelMessageId) => {
	if (!db) {
		throw new Error('No connection to database');
	}

	try {
		await db.collection("news").remove({ 'payload.channelMessageId': channelMessageId })
	}
	catch (err) {
		return err
	}
}

module.exports.insertRecord = async (record) => {
	if (!db) {
		throw new Error('No connection to database')
	}

	db.collection("news").insertOne(record, function(err, res) {
	    if (err) 
	    	throw err

	    console.log("1 document inserted")
	});
}

module.exports.getLatest = async (count) => {
	if (!db) {
		throw new Error('No connection to database');
	}

	let res = await db.collection("news").find({}).limit(count).sort({'payload.createdTime': -1}).toArray()
	return res
}

module.exports.insertGroup = async (groupId) => {
	if (!db) {
		throw new Error('No connection to database');
	}

	db.collection("groups").insertOne({"groupId": groupId}, function(err, res) {
	    if (err) 
	    	throw err

	    console.log("1 document inserted")
	});
}

module.exports.getGroups = async () => {
	if (!db) {
		throw new Error('No connection to database');
	}

	let res = await db.collection("groups").find({}).toArray()
	return res
}
