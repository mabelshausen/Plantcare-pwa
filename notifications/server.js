const http = require("http");
const webpush = require("web-push");

const pushKeys = {
    publicKey: 'BIuCnGhIL7_peUkT7MTVcjYn97MqSR3ye-7_c6p3McLP0Sg9g3Z1IU_Nrl8sdUh081AgGSI7SdbP57u-dqRy6XE',
    privateKey: 'QOI0g4-l7BtzfvIid0dCqOt_XoPXErxtHdQ-WwoZTwM'
};
  
webpush.setVapidDetails(
    'mailto:marijn.abelshausen@student.howest.be',
    pushKeys.publicKey,
    pushKeys.privateKey
);

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({extended: false}));

let subscription = {}

server.listen(8001, () => {
    console.log("Listening on port ", 8001);
});


app.post("/register", (req, res) => {
    subscription = req.body;
    res.end();
});

app.post("/water", (req, res) => {
    const data = { plant: req.body["plant"], timestamp: req.body["timestamp"] };
    sendNotification(data);
    res.end();
});

function sendNotification(data) {
    webpush.sendNotification(subscription, JSON.stringify(data));
}
