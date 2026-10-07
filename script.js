// ======================================
// CH FUTURE PREDICTOR AI
// SERVER CONNECTED VERSION
// ======================================


// ======================================
// MAKE PREDICTION
// ======================================

async function makePrediction() {

    const type =
        document.getElementById("predictionType").value;

    const input =
        document.getElementById("dataInput").value.trim();

    const predictionText =
        document.getElementById("predictionText");

    const probability =
        document.getElementById("probability");

    const confidence =
        document.getElementById("confidence");


    // Data yoo duwwaa ta'e
    if (input === "") {

        predictionText.textContent =
            "⚠️ Mee dura data galchi.";

        probability.textContent =
            "--%";

        confidence.textContent =
            "--";

        return;
    }


    // Lakkoofsota input keessaa baasuu
    const matches =
        input.match(/-?\d+(\.\d+)?/g);


    const numbers =
        matches
            ? matches.map(Number)
            : [];


    // Yoo lakkoofsi 3 gadi ta'e
    if (numbers.length < 3) {

        predictionText.textContent =
            "⚠️ Yoo xiqqaate lakkoofsa 3 galchi.";

        probability.textContent =
            "--%";

        confidence.textContent =
            "--";

        return;
    }


    // Server irraa prediction gaafachuu
    predictionText.textContent =
        "⏳ Server irraa prediction argachaa jira...";

    probability.textContent =
        "--%";

    confidence.textContent =
        "--";


    try {

        const response =
            await fetch("/api/predict", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    type: type,

                    numbers: numbers

                })

            });


        const data =
            await response.json();


        // Server error yoo ta'e
        if (!response.ok) {

            throw new Error(
                data.error ||
                "Server error"
            );

        }


        // ======================================
        // SERVER RESULT
        // ======================================

        predictionText.textContent =
            data.prediction;

        probability.textContent =
            data.probability + "%";

        confidence.textContent =
            data.confidence;


        // History keessatti kuusuu
        savePrediction(

            type,

            data.prediction,

            data.probability,

            data.confidence

        );


    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );


        predictionText.textContent =
            "❌ Server waliin wal qunnamuun hin danda'amne.";

        probability.textContent =
            "--%";

        confidence.textContent =
            "Error";

    }

}


// ======================================
// SAVE PREDICTION
// ======================================

function savePrediction(
    type,
    prediction,
    chance,
    level
) {

    let history = [];


    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    "predictionHistory"
                )
            ) || [];

    } catch (error) {

        history = [];

    }


    const item = {

        type: type,

        prediction: prediction,

        probability: chance,

        confidence: level,

        date:
            new Date().toLocaleString()

    };


    history.unshift(item);


    // History 20 qofa haa qabaatu
    if (history.length > 20) {

        history.pop();

    }


    localStorage.setItem(

        "predictionHistory",

        JSON.stringify(history)

    );


    displayHistory();

    updateDashboard();

}


// ======================================
// DISPLAY HISTORY
// ======================================

function displayHistory() {

    const historyBox =
        document.getElementById("history");


    if (!historyBox) {

        return;

    }


    let history = [];


    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    "predictionHistory"
                )
            ) || [];

    } catch (error) {

        history = [];

    }


    if (history.length === 0) {

        historyBox.innerHTML =
            "<p>No predictions yet.</p>";

        return;
    }


    historyBox.innerHTML = "";


    history.forEach(function(item) {

        const div =
            document.createElement("div");


        div.style.padding =
            "14px";

        div.style.marginBottom =
            "10px";

        div.style.background =
            "#0a122