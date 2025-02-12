
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}

const newtraincommands = {
    // Fill Train Number
    'set train number *number': function (number) {
      document.getElementById('trainNumber').value = number;
      speak('what is the train name');
    },

    // Fill Train Name
    'set train name *name': function (name) {
      document.getElementById('name').value = name;
      speak(`Train name set to ${name}`);
    },

    // Fill Route (JSON format)
    'set route *route': function (route) {
      document.getElementById('route').value = route;
      speak(`Route set to ${route}`);
    },

    // Fill Sleeper Seats
    'Number of sleeper seats are *n': function (n) {
      document.getElementById('sleeper').value = n;
      speak('Tell me the number of AC seat');
    },

    // Fill AC Seats
    'number of AC seats are *s': function (s) {
      document.getElementById('ac').value = s;
      speak('Tell me the number of general seat');
    },

    // Fill General Seats
    'number of generl seats are *g': function (g) {
      document.getElementById('general').value = g;
      speak('Tell me the price of the sleeper seats');
    },

    // Fill Sleeper Fare
    'set sleeper fare to *fare': function (fare) {
      document.getElementById('sleeperFare').value = fare;
      speak('Tell me the price of the AC seats');
    },

    // Fill AC Fare
    'set AC fare to *fare': function (fare) {
      document.getElementById('acFare').value = fare;
      speak('Tell me the price of the general seats');
    },

    // Fill General Fare
    'set general fare to *fare': function (fare) {
      document.getElementById('generalFare').value = fare;
      speak('Submit the form');
    },

    // Submit the form
    'submit form': function () {
      document.getElementById('newtrainform').submit();
      speak('Form submitted');
    },
  };

    const navigationcommands = {
        'go to home': () => window.location.href = '/',
        'go to booking': () => window.location.href = '/bookings/history',
        'go to login': () => window.location.href = '/login',
        'go to register': () => window.location.href = '/register',
        'view all train' : ()=>window.location.href='/trains',
        'logout': () => window.location.href = '/logout'
    };
    const searchcommands={
        'Starting station is *from':function(from){
            document.getElementById('from').value=from;
            console.log("starting is"+from);
            speak("Tell me the final destination")
        },
        'Final station is *to':function(to){
            document.getElementById('to').value=to;
            console.log("final is"+to);
            speak("Search the train")
        },
        'Train Number is *t':function(t){
            document.getElementById('trainNumber').value=t;
            console.log("Train Number is"+t);
            speak("Search the train")
        },
        'Find the train': function() {
            document.getElementById('searchform').submit();
        }
    }
    const commands = {
        'Login name is *n': function(n) {
            document.getElementById('username').value = n;
            console.log("login name is set")
            speak('Username set to ' + n);
            console.log("next field is spoken")
            speak("what's the password")  // Voice feedback
        },
        'My password is *p':function(p){
            document.getElementById('password').value=p;
            speak('password set');
            speak("submit the form") 
        },
        'Login': function() {
            document.getElementById('loginForm').submit();
            speak('You are Logined Succesfully');  // Voice feedback
        }
    };
    var registercommands = {
        'set username to *name': function(name) {
            document.getElementById('newusername').value = name;
            console.log(name);
            speak('Username set to ' + name); 
            console.log("next field is spoken")
            speak("what's the email") // Voice feedback
        },
        'set email to *email': function(email) {
            document.getElementById('email').value = email;
            console.log(email)
            speak('Email set to ' + email); 
            console.log("next field is spoken")
            speak("what's the password") 
        },
        'set password to *password': function(password) {
            document.getElementById('newpassword').value = password;
            console.log(password)
            speak('Password set to ' + password);
            speak("submi the form") 
        },
        'submit registration form': function() {
            document.getElementById('registerForm').submit();
            speak('Registration form submitted');  // Voice feedback
        }
    };
    const bookingCommands = {
        'set from station to *fromStation': function(fromStation) {
            const standardizedFrom = stationMapping[fromStation.toLowerCase()];
            if (standardizedFrom) {
                document.getElementById('from').value = standardizedFrom;
                speak(`From station is set to` + fromStation)
                speak('whats the destination')
            } else {
                speak(`Sorry, I did not recognize the station "${fromStation}". Please specify again.`);
            }
        },
        'set destination to *toStation': function(toStation) {
            const standardizedTo = stationMapping[toStation.toLowerCase()];
            if (standardizedTo) {
                document.getElementById('to').value = standardizedTo;
                speak(`destinnation station is set to` + toStation);
                speak(`whats the date`);
            } else {
                speak(`Sorry, I did not recognize the station "${toStation}". Please specify again.`);
            }
        },
        'set date to *date': function(date) {
            document.getElementById('date').value = date;
            speak(`Date set to ${date}`);
            speak('what is the class preference')
        },
        'set class preference to *preference': function(preference) {
            const classMapping = {
                'first AC': '1A',
                'second AC': '2A',
                'third AC': '3A',
                'sleeper': 'SL',
                'chair car': 'CC',
                'all classes': ''
            };
            document.getElementById('preference').value = classMapping[preference.toLowerCase()] || '';
            speak(`Class preference set to ${preference}`);
            speak('Submit the form')
        },
        'submit booking form': function() {
            document.querySelector('form').submit();
            speak('Booking form submitted');
        }
    };
if(annyang){
    window.onload=()=>{
    const path = window.location.pathname;
    annyang.addCommands(navigationcommands);
        if (path === '/login') {
            annyang.addCommands(commands);
            speak("What is your login name?");
        } else if (path === '/register') {
            annyang.addCommands(registercommands);
            speak("What is your username?");
        }
        else if (path === '/book') {
            annyang.addCommands(bookingCommands);
            speak("What is the starting point?");
        }
        else if (path === '/admin/new'){
            annyang.addCommands(newtraincommands);
        }
        else if (path === '/') {
            annyang.addCommands(searchcommands);
            // speak("Tell when u want to start recording");
        }
    annyang.start();
    }
}else {
    console.log('Annyang is not supported in this browser.');
}