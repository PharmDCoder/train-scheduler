$(document).ready(function () {
    //play music
    //set flag equal to false so that music only plays once on loop
    var rowRemoval;
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
    // $("#top-video-src").attr("src", "assets")

    //hides screens other than current train schedule once current-schedule nav button is clicked
    $("#current-schedule-nav").on("click", function () {
        playGif("assets/images/tYorkPeekingOver.gif", 6500, "view-schedule");
        $("#top-image").hide();
        $("#remove-train-btn").hide();
    })

    //hides screens other than current train schedule once add-train nav button is clicked
    $("#add-train-nav").on("click", function () {
        workFlow("assets/images/train-people.gif");
        $("#add-train").show();
        $("#current-train-schedule").hide();
        $("#remove-train-btn").hide();
    })

    //
    $("#remove-train-nav").on("click", function () {
        workFlow("assets/images/train-people.gif");
        $("#add-train").hide();
        $("#current-train-schedule").show();
        $("#remove-train-btn").show();
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
    $("#add-train-btn").on("click", function () {
        playGif("assets/images/adding-train.gif", 3000, "add-train");
        $("#current-train-schedule").show();
        //prevents the default action to run back to the top of the code
        event.preventDefault();
        //declaring variables for each key of data and assigning the value to dispay on DOM
        var nameInput = $("#train-name-input").val();
        var destinationInput = $("#destination-input").val();
        var frequencyInput = $("#frequency-input").val();
        var firstArrivalInput = $("#first-arrival-input").val();

        //function to reference database and push the information into firebase
        database.ref("/trains").child(nameInput).set({
            nameInput: nameInput,
            destinationInput: destinationInput,
            frequencyInput: frequencyInput,
            firstArrivalInput: firstArrivalInput
        })
        $("tbody tr:first").addClass("table-success");
        setTimeout(() => {
            $("tbody tr:first").removeClass("table-success");
        }, 3000);
    });

    $("#remove-train-btn").on("click", function() {  
        database.ref("/trains").child($(this).attr("selectedTrain")).remove();
        $(rowRemoval).addClass("table-danger");
        playGif("assets/images/removing-train.gif", 2000, "remove-train");
    });

    $(document.body).on("click","tbody tr", function() {  
        console.log($(this).children().eq(0).text());
        $("#remove-train-btn").attr("selectedTrain", $(this).children().eq(0).text());
        rowRemoval = $(this);
        $(this).addClass("table-secondary");
    });

    // Firebase watcher + initial loader 
    database.ref("/trains").on("child_added", function (childSnapshot) {
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

        // endTime = moment(firstArrivalInput, 'HH:mm').add(frequencyInput, 'minutes').format('HH:mm');
        var nextArrivalTime = getNextArrival(childSnapshot.val().firstArrivalInput, childSnapshot.val().frequencyInput);
        function getNextArrival(start, frequencyInput) {
            var startTime = moment(start, 'HH:mm');
            var nextArrivalTime = [];

            while (startTime <= moment().add(frequencyInput, "minutes")) {
                nextArrivalTime.push(new moment(startTime).format('HH:mm'));
                startTime.add(frequencyInput, 'minutes');
            }
            return nextArrivalTime[nextArrivalTime.length - 1];
        }
        nextArrival.append(nextArrivalTime);

        //using JS to capture the date to new variable dateHold
        var dateHold = new Date();
        //using JS function to generate the date in proper format to be recognized by moment JS
        var currentDate = (dateHold.getMonth() + 1) + "/" + dateHold.getDate() + "/" + dateHold.getFullYear() + " ";
        //using moment JS to assign the date + time of next arrival to new timeStamp variable 
        var timeStamp = moment(currentDate + nextArrivalTime);

        //assinging value to minutesAway variable to pass through moment JS calculation of time from next arrival to now
        minutesAway.append(timeStamp.toNow(true));

        //appending all of the td's to the tr, trainData
        trainData.append(trainName);
        trainData.append(destination);
        trainData.append(frequency);
        trainData.append(nextArrival);
        trainData.append(minutesAway);

        //adding the trainData rows to the tbody div on the DOM
        $("tbody").prepend(trainData);


    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    database.ref("/trains").on("child_removed", function (childSnapshot) {
        
    });

    function playGif(gifSrc, gifTime, navInput) {
        $("#top-img").show();
        $("#top-img").attr("src", gifSrc);
        $("#intro-screen").hide();
        $("#current-train-schedule").show();
        $("#add-train").hide();
        setTimeout(() => {
            if (navInput === "view-schedule") {
                $("#top-img").hide();
            }
            if (navInput === "add-train") {
                $("#top-img").attr("src", "assets/images/train-people.gif");
                $("#add-train").show();
                $("#current-train-schedule").hide();
            }
            if (navInput === "remove-train") {
                $("#top-img").attr("src", "assets/images/train-people.gif");
                rowRemoval.remove();
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