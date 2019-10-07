$(document).ready(function () {
    //play music
    //set flag equal to false so that music only plays once on loop
    var flag = false;
    if (!flag) {
        $(".nav-item").on("click", function play() {
            var audio = document.getElementById("audio-src");
            audio.play();
            flag = true;
        });
    }

    //hides screens other than start screen
    $("#add-train").hide();
    $("#current-train-schedule").hide();
    $("#top-img").hide();

    //hides screens other than current train schedule once current-schedule nav button is clicked
    $("#current-schedule-nav").on("click", function () {
        playGif("assets/images/tYorkPeekingOver.gif", 6500, "view-schedule");
        $("#top-image").hide();
    })

    //hides screens other than current train schedule once add-train nav button is clicked
    $("#add-train-nav").on("click", function () {
        workFlow("assets/images/train-people.gif");
        $("#add-train").show();
        $("#current-train-schedule").hide();
    })

    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyDskBS60gQ6KLoYBY9Y5ZR5jLF5554pw14",
        authDomain: "train-scheduler-152bb.firebaseapp.com",
        databaseURL: "https://train-scheduler-152bb.firebaseio.com",
        projectId: "train-scheduler-152bb",
        storageBucket: "",
        messagingSenderId: "129715708394",
        appId: "1:129715708394:web:1f3d07e4063dad23a41293"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Create a variable to reference the database.
    var database = firebase.database();

    //When add a train submit button is clicked
    $("button").on("click", function () {
        playGif("assets/images/adding-train.gif", 3000, "add-train");
        $("#current-train-schedule").show();
        //prevents the default action to run back to the top of the code
        event.preventDefault();
        //declaring variables for each key of data and assigning the value to dispay on DOM
        var nameInput = $("#train-name-input").val();
        var destinationInput = $("#destination-input").val();
        var frequencyInput = $("#frequency-input").val();
        var firstArrivalInput = $("#first-arrival-input").val();

        //function to find next arrival


        //function to reference database and push the information into firebase
        database.ref().push({
            nameInput: nameInput,
            destinationInput: destinationInput,
            frequencyInput: frequencyInput,
            nextArrivalInput: nextArrivalInput
        })
    })

    // Firebase watcher + initial loader 
    database.ref().on("child_added", function (childSnapshot) {
        //creating a variable that generates a new row in DOM for each scheduled train
        var trainData = $("<tr>");
        // Setting variables for all properties to have a column dynamically added to DOM (no actual values - just the space)
        var trainName = $("<td class='train-name'>");
        var destination = $("<td class='destination'>");
        var frequency = $("<td class='frequency'>");
        var nextArrival = $("<td class='next-arrival'>");
        var minutesAway = $("<td>");

        //assigning values to variables that are properties in firebase
        trainName.append(childSnapshot.val().nameInput);
        destination.append(childSnapshot.val().destinationInput);
        frequency.append(childSnapshot.val().frequencyInput);
        nextArrival.append(childSnapshot.val().nextArrivalInput);

        //using JS to capture the date to new variable dateHold
        var dateHold = new Date();
        //using JS function to generate the date in proper format to be recognized by moment JS
        var currentDate = (dateHold.getMonth() + 1) + "/" + dateHold.getDate() + "/" + dateHold.getFullYear() + " ";
        //using moment JS to assign the date + time of next arrival to new timeStamp variable 
        var timeStamp = moment(currentDate + childSnapshot.val().nextArrivalInput)

        //assinging value to minutesAway variable to pass through moment JS calculation of time from next arrival to now
        minutesAway.append(timeStamp.toNow());

        //appending all of the td's to the tr, trainData
        trainData.append(trainName);
        trainData.append(destination);
        trainData.append(frequency);
        trainData.append(nextArrival);
        trainData.append(minutesAway);

        //adding the trainData rows to the tbody div on the DOM
        $("tbody").append(trainData);


    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    function playGif(gifSrc, gifTime, navInput) {
        $("#top-img").show();
        $("#top-img").attr("src", gifSrc);
        $("#intro-screen").hide();
        $("#current-train-schedule").show();
        setTimeout(() => {
            if (navInput === "view-schedule") {    
                $("#current-train-schedule").show();
                $("#top-img").hide();
                $("#add-train").hide();
            } 
            if (navInput === "add-train") {
                $("#top-img").show();
                $("#top-img").attr("src", "assets/images/train-people.gif");
                $("#add-train").show();
                $("#current-train-schedule").hide();
            }
        }, gifTime);
    }

    function workFlow(gifSrc) {
        $("#top-img").show();
        $("#top-img").attr("src", gifSrc);
        $("#nav-bar").show();
        $("#intro-screen").hide();
    }

});