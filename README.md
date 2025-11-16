# GeoGuesser: The Area Challenge

**GeoGuesser** is a fast-paced web game that tests your ability to estimate the surface area of countries. The game challenges you to guess a country's area (in square kilometers) in **one single guess**. The game uses a 3D Cesium globe for visualization and consists of 5 questions.

---

## Project Requirements

### 1. Functional Requirements
* **3D Globe:** The application must render an interactive 3D model of the Earth using **Cesium.js**.
* **Country Highlighting:** The system must be able to fetch and display the geographical boundaries of a specific country, highlighting it on the globe.
* **Game State Management:** The application must manage the game's state, including:
    * The `totalScore` (cumulative across all rounds).
    * The `currentQuestionNumber` (from 1 to 5).
* **User Input:** The user must have a simple input field to submit a **single numerical guess** (in km²) for each country.
* **Data Source:** A static data source (e.g., a JSON file) is required to store:
    * A list of country names.
    * The corresponding **actual surface area** (in km²) for each country.
    * Data (e.g., GeoJSON) for rendering the country's boundaries.
* **Core Game Loop:**
    * The game must present a total of **5 questions** (5 different countries).
    * For each country, the user gets **only one guess**.
* **Feedback Mechanism:** After the single guess is submitted, the UI must immediately provide final feedback for that round, showing:
    * The user's guess.
    * The correct, actual area.
    * The points awarded for that guess.
* **Scoring System:**
    * Points are awarded after the single guess is submitted.
    * The scoring formula must reward proximity. The closer the guess is to the real number, the more points it receives.
* **Game Over:** The game ends after the user submits their guess for the 5th country. A final screen will display the `totalScore`.

### 2. Technical Requirements
* **Frontend:** HTML5, CSS3, JavaScript (ES6+).
* **Core Library:** **Cesium.js** (for the 3D globe).
* **Data Format:** **GeoJSON** or **TopoJSON** for country boundaries. A simple **JSON** file for the country area data (`{ "country": "Turkey", "area": 783562 }`).
* **Environment:** Must be a client-side application that runs in modern web browsers.

---

## Frontend Layout & Sketch

The UI will be a single-page application, divided into two main sections: the interactive **Globe View** and the **Game UI Panel**.

```
+----------------------------------------------------------------------+
|                       GeoGuesser: The Area Challenge                 |
+--------------------------------------+-------------------------------+
|                                      |                               |
|                                      |  Total Score: 1250            |
|                                      |  Question: 2 / 5              |
|                                      |                               |
|                                      |  ---------------------------  |
|                                      |                               |
|         [  CESIUM 3D GLOBE ]          |  What is the area of:         |
|         [                          ]  |  < Country Name > ?           |
|         [  (Country Highlighted)   ]  |                               |
|         [                          ]  |  [ Enter area in km² ]        |
|                                      |  [     Submit Guess    ]        |
|                                      |                               |
|                                      |  ---------------------------  |
|                                      |                               |
|                                      |  Last Round Result:           |
|                                      |  Country: (Previous Country)  |
|                                      |  Your Guess: 800,000 km²      |
|                                      |  Real Area:  783,562 km²      |
|                                      |  Score: +850 points           |
|                                      |                               |
+--------------------------------------+-------------------------------+
```

### Layout Components:
1.  **Header:** Contains the game title.
2.  **Globe View (Left Pane):** A large pane (~70% viewport) containing the Cesium canvas. It zooms to and highlights the target country for the current question.
3.  **Game UI Panel (Right Pane):**
    * **Status Display:** Shows the user's cumulative **Total Score** and their progress (e.g., **Question: 2 / 5**).
    * **Question Prompt:** Clearly asks the user for the area of the displayed country.
    * **Input Form:** A number input field and a "Submit Guess" button.
    * **Feedback Box:** This area shows the detailed results from the *previous* round (their guess vs. the real answer and points awarded) so they can see how they did while they move on to the next question.

---

## Game Design & Progression

### How the game will progress
The game is a simple quiz in 5 rounds.

* **Game Start:** The user starts the game. The `totalScore` is 0. The game loads Question 1.
* **Round (e.g., Question 1):**
    1.  A country is **randomly selected** from the database.
    2.  The country is highlighted on the Cesium globe.
    3.  The user is prompted for their **one and only guess**.
    4.  The user submits the guess.
    5.  The game immediately calculates the points based on the guess's proximity to the correct answer.
    6.  The `totalScore` is updated.
    7.  The UI updates the "Last Round Result" panel to show the user's guess, the real answer, and the points awarded.
    8.  The game automatically proceeds to the next question (e.g., Question 2).
* **Difficulty:** The difficulty is consistent. Countries are selected randomly. The scoring logic is the same for all questions.
* **Game End:** The game ends after the 5th guess is submitted for the 5th country. A final "Game Over" screen displays the `totalScore`.

### How many questions will there be
There will be a fixed total of **5 questions** (5 countries).

### How many lives, if any, does a user have?
There is **no live structure**. The user plays through all 5 questions, and the final score is the only measure of success.