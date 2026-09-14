const queryInput = document.getElementById("query");

const generateBtn = document.getElementById("generateBtn");

const buttonText = document.getElementById("buttonText");

const loader = document.getElementById("loader");

const responseSection =
    document.getElementById("responseSection");

const responseBox =
    document.getElementById("response");

const errorBox =
    document.getElementById("errorBox");

const charCount =
    document.getElementById("charCount");


// Character counter

queryInput.addEventListener("input", function () {

    const length = queryInput.value.length;

    charCount.textContent =
        `${length} / 2000`;

});


// Generate response

async function generateResponse() {

    const query = queryInput.value.trim();


    // Clear previous error

    errorBox.classList.add("hidden");

    errorBox.textContent = "";


    // Validate

    if (!query) {

        showError(
            "Please enter a medical question first."
        );

        return;
    }


    // Loading state

    generateBtn.disabled = true;

    buttonText.textContent =
        "Analyzing...";

    loader.classList.remove("hidden");

    responseSection.classList.add("hidden");


    try {

        const response = await fetch("/ask", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                query: query
            })

        });


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Something went wrong."
            );

        }


        // Show response

        responseBox.textContent =
            data.response;

        responseSection.classList.remove(
            "hidden"
        );


        // Scroll to response

        setTimeout(() => {

            responseSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);


    } catch (error) {

        console.error(error);

        showError(
            error.message ||
            "Unable to generate response."
        );

    } finally {

        generateBtn.disabled = false;

        buttonText.textContent =
            "Generate Response";

        loader.classList.add("hidden");

    }
}


// Show error

function showError(message) {

    errorBox.textContent = message;

    errorBox.classList.remove("hidden");

}


// Example question

function useExample(button) {

    let text = button.textContent;

    // Remove emoji from example

    text = text.replace(
        /^[^\w]+/,
        ""
    ).trim();

    queryInput.value = text;

    charCount.textContent =
        `${text.length} / 2000`;

    queryInput.focus();

}


// Copy response

async function copyResponse() {

    const text =
        responseBox.textContent;

    if (!text) {
        return;
    }

    try {

        await navigator.clipboard.writeText(text);

        alert("Response copied!");

    } catch (error) {

        console.error(error);

    }

}


// Clear response

function clearResponse() {

    responseBox.textContent = "";

    responseSection.classList.add(
        "hidden"
    );

    queryInput.value = "";

    charCount.textContent =
        "0 / 2000";

}


// Dark mode

function toggleTheme() {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    const themeBtn =
        document.getElementById("themeBtn");

    themeBtn.textContent =
        isDark ? "☀️" : "🌙";

    localStorage.setItem(
        "medai-theme",
        isDark ? "dark" : "light"
    );

}


// Remember theme

const savedTheme =
    localStorage.getItem("medai-theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    document.getElementById(
        "themeBtn"
    ).textContent = "☀️";

}


// Enter shortcut

queryInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            event.ctrlKey
        ) {

            generateResponse();

        }

    }
);