

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNzIyMDkzZS05YTIzLTQ5NTMtODg0Yi1jYmFhMDMzZjZjYWYiLCJpZCI6MzY0MTgwLCJpYXQiOjE3NjQxNzM0NTR9.eQY3m8DgGHfEm_FgAlRFSeYroJGlItIEMwyxudp-JtE';


let viewer;
let selectedCountries = [];
let currentRoundIndex = 0;
let totalScore = 0;
const MAX_ROUNDS = 5;


function initGame() {

    let savedHighScore = localStorage.getItem('squareGuesserHighScore');
    
    if (savedHighScore === null) {
        savedHighScore = 0;
    }
    
    document.getElementById('highScoreDisplay').innerText = savedHighScore;


    
    viewer = new Cesium.Viewer('cesiumContainer', {
        terrain: Cesium.Terrain.fromWorldTerrain(), 
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        timeline: false,
        animation: false,
       
        contextOptions: {
            webgl: {
                alpha: true,
                antialias: true
            }
        }
    });

    
    viewer.resolutionScale = window.devicePixelRatio; 
    viewer.scene.postProcessStages.fxaa.enabled = true; 
    viewer.scene.globe.maximumScreenSpaceError = 1.5; 

    
    viewer.scene.globe.depthTestAgainstTerrain = true;

    
    selectedCountries = getRandomSubarray(gameData, MAX_ROUNDS);
    loadRound();
}

function loadRound() {
    if (currentRoundIndex >= MAX_ROUNDS) {
        endGame();
        return;
    }

    const country = selectedCountries[currentRoundIndex];
    
    
    document.getElementById('questionDisplay').innerText = currentRoundIndex + 1;
    document.getElementById('countryNameDisplay').innerText = country.name;
    document.getElementById('areaInput').value = "";
    document.getElementById('areaInput').focus();

   
    viewer.entities.removeAll(); 
    


    viewer.entities.removeAll(); 
    
   viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(country.lon, country.lat),
        point: { 
            pixelSize: 20, 
            color: Cesium.Color.fromCssColorString('#ff4757'),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 4,
            disableDepthTestDistance: Number.POSITIVE_INFINITY 
        },
        label: {
            text: country.name,
            font: 'bold 18px Poppins, sans-serif',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 4,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -20),
            disableDepthTestDistance: Number.POSITIVE_INFINITY 
        }
    });

    

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(country.lon, country.lat, 5000000), 
        duration: 2.0
    });
}

function submitGuess() {
    const input = document.getElementById('areaInput');
    const guess = parseInt(input.value);
    
    if (isNaN(guess) || guess <= 0) {
        alert("Please enter a valid number.");
        return;
    }

    
    const currentCountry = selectedCountries[currentRoundIndex];
    const actual = currentCountry.area;
    
    const diff = Math.abs(guess - actual);
    const percentError = diff / actual; 
    
    let points = 0;
    if (percentError < 1.0) {
        points = Math.floor(1000 * (1 - percentError));
    }
    
    
    totalScore += points;
    
    
    updateFeedbackPanel(currentCountry.name, guess, actual, points);
    document.getElementById('scoreDisplay').innerText = totalScore;

    
    currentRoundIndex++;
    loadRound();
}

function updateFeedbackPanel(name, guess, actual, points) {
    const panel = document.getElementById('feedbackBox');
    panel.style.visibility = "visible";
    
    document.getElementById('fbCountry').innerText = name;
    document.getElementById('fbGuess').innerText = guess.toLocaleString() + " km²";
    document.getElementById('fbReal').innerText = actual.toLocaleString() + " km²";
    document.getElementById('fbPoints').innerText = "+" + points;

    if(points > 800) panel.style.borderLeftColor = "#2ecc71";
    else if(points > 400) panel.style.borderLeftColor = "#f1c40f";
    else panel.style.borderLeftColor = "#e74c3c";
}

function endGame() {
    document.getElementById('gameOverModal').style.display = "flex";
    
    
    let currentHighScore = localStorage.getItem('squareGuesserHighScore') || 0;
    
    
    if (totalScore > currentHighScore) {
        
        localStorage.setItem('squareGuesserHighScore', totalScore);
        
       
        document.getElementById('finalScore').innerHTML = 
            "New High Score! 🏆<br>Total Score: " + totalScore;
            
        
        document.getElementById('highScoreDisplay').innerText = totalScore;
    } else {
        
        document.getElementById('finalScore').innerText = "Total Score: " + totalScore;
    }
}

function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor(Math.random() * (i + 1));
        temp = shuffled[i];
        shuffled[i] = shuffled[index];
        shuffled[index] = temp;
    }
    return shuffled.slice(0, size);
}


window.onload = initGame;