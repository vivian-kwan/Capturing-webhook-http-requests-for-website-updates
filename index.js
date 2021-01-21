let express = require('express')
let bodyParser = require('body-parser');
const dbHelper = require('./dbHelper');

const subscriptionIdAdd = '600020d34c3723284ca1b22b'
const subscriptionIdRemove = '5fbfc14d0d9f0b17c6091c17'
const baseURL = "https://phillipinesapp.azurewebsites.net"

let app = express()

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

app.use(bodyParser.json());

app.get('/', async (req, res) => {
	res.render("index", {
		baseURL: baseURL
	});
})

app.post('/', async (req, res) => {
	if (req.body) {

		console.log(req.body);
		try {
			if (req.body.subscriptionDetails.subscriptionId == subscriptionIdRemove) {
				console.log(req.body.payload.channelMessageId)
        dbHelper.connect().then(async () => {
          // Remove the posts
          await dbHelper.deleteRecord(req.body.payload.channelMessageId)
        }).catch((error) => {
          console.log("Unable to connect to database: " + error);
        })
			}
			else if (req.body.subscriptionDetails.subscriptionId == subscriptionIdAdd) {
        dbHelper.connect().then(async () => {
          // Add the post
  				let count = await dbHelper.recordsCount()
  				if (count >= 10) {
  					await dbHelper.deleteFirstRecord()
  				}
  				dbHelper.insertRecord(req.body)

        }).catch((error) => {
          console.log("Unable to connect to database: " + error);
        })
			}
		}
		catch (err) {
			console.log("Unknown error: " + err)
		}
	}

  res.send("Done")
})

app.get('/getdata', async (req, res) => {

	dbHelper.connect().then(async () => {
		console.log("Connected to database");

		try {
			let records = await dbHelper.getLatest(10)
			res.send(records)
		}
		catch (err) {
			console.log("Error while fetching latest records: " + err)
			res.send(err)
		}
	}).catch((error) => {
		console.log("Unable to connect to database")
		res.send("Unable to connect to database")
	});
})

let port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("Server started on port " + port)
})
