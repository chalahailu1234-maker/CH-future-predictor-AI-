const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

    // =========================
    // HOME
    // =========================

    if (req.url === "/" || req.url === "/index.html") {

        const filePath = path.join(__dirname, "index.html");

        fs.readFile(filePath, (error, data) => {

            if (error) {
                res.writeHead(500);
                res.end("index.html not found");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });

        return;
    }


    // =========================
    // CSS
    // =========================

    if (req.url === "/style.css") {

        const filePath = path.join(__dirname, "style.css");

        fs.readFile(filePath, (error, data) => {

            if (error) {
                res.writeHead(404);
                res.end("style.css not found");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/css"
            });

            res.end(data);
        });

        return;
    }


    // =========================
    // JAVASCRIPT
    // =========================

    if (req.url === "/script.js") {

        const filePath = path.join(__dirname, "script.js");

        fs.readFile(filePath, (error, data) => {

            if (error) {
                res.writeHead(404);
                res.end("script.js not found");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "application/javascript"
            });

            res.end(data);
        });

        return;
    }


    // =========================
    // SERVER STATUS
    // =========================

    if (req.url === "/api/status") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            online: true,
            app: "CH Future Predictor AI",
            message: "Server is connected"
        }));

        return;
    }


    // =========================
    // PREDICTION API
    // =========================

    if (req.url === "/api/predict" && req.method === "POST") {

        let body = "";

        req.on("data", chunk => {

            body += chunk;

        });


        req.on("end", () => {

            try {

                const data = JSON.parse(body);

                const type = data.type;

                const numbers = Array.isArray(data.numbers)
                    ? data.numbers.map(Number)
                    : [];


                if (numbers.length < 3) {

                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        error: "At least 3 numbers are required."
                    }));

                    return;
                }


                let increases = 0;

                let decreases = 0;

                const changes = [];


                for (let i = 1; i < numbers.length; i++) {

                    const change =
                        numbers[i] - numbers[i - 1];

                    changes.push(change);


                    if (change > 0) {
                        increases++;
                    }

                    if (change < 0) {
                        decreases++;
                    }

                }


                const totalChanges = changes.length;

                const increaseRate =
                    increases / totalChanges;

                const decreaseRate =
                    decreases / totalChanges;


                const averageChange =
                    changes.reduce(
                        (sum, value) => sum + value,
                        0
                    ) / totalChanges;


                let prediction =
                    "➡️ Trend ifa ta'e hin mul'anne.";

                let chance = 50;

                let level = "Medium";


                if (
                    increaseRate >= 0.65 &&
                    averageChange > 0
                ) {

                    prediction =
                        "📈 Trend gara olka'iinsaatti deema.";

                    chance =
                        Math.round(
                            60 + increaseRate * 30
                        );

                    level = "High";


                } else if (
                    decreaseRate >= 0.65 &&
                    averageChange < 0
                ) {

                    prediction =
                        "📉 Trend gara gadi bu'iinsaatti deema.";

                    chance =
                        Math.round(
                            60 + decreaseRate * 30
                        );

                    level = "High";
                }


                chance = Math.min(chance, 95);


                res.writeHead(200, {
                    "Content-Type": "application/json"
                });


                res.end(JSON.stringify({

                    success: true,

                    type: type,

                    prediction: prediction,

                    probability: chance,

                    confidence: level

                }));


            } catch (error) {

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    error: "Invalid request."
                }));

            }

        });

        return;
    }


    // =========================
    // 404
    // =========================

    res.writeHead(404);

    res.end("404 - Not Found");

});


server.listen(PORT, "0.0.0.0", () => {

    console.log(
        "CH Future Predictor AI server running on port " +
        PORT
    );

});