document.addEventListener("DOMContentLoaded", function () {

    // ── DOM References ──────────────────────────────────────
    const searchButton         = document.getElementById("search-btn");
    const usernameInput        = document.getElementById("user-input");
    const statsContainer       = document.querySelector(".stats-container");
    const easyProgressCircle   = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle   = document.querySelector(".hard-progress");
    const easyLabel            = document.getElementById("easy-label");
    const mediumLabel          = document.getElementById("medium-label");
    const hardLabel            = document.getElementById("hard-label");
    const cardStatsContainer   = document.querySelector(".stats-card");

    // ── Hardcoded LeetCode total available questions ────────
    const TOTAL_EASY   = 886;
    const TOTAL_MEDIUM = 1878;
    const TOTAL_HARD   = 821;

    // ── Regex for username validation ───────────────────────
    const regex = /^[a-zA-Z0-9_-]+$/;

    // ── Validate Username ───────────────────────────────────
    function validateusername(username) {
        if (regex.test(username)) {
            return true;
        } else {
            alert("Invalid username");
            return false;
        }
    }

    // ── Update Circle Progress ──────────────────────────────
    function updateCircle(solved, total, label, circle) {
        const progressDegree = total > 0 ? Math.round((solved / total) * 100) : 0;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved} / ${total}`;
    }

    // ── Display All User Data ───────────────────────────────
    function displayUserData(data) {

        // ── Update circles: solved / total available ──
        updateCircle(data.easySolved,   TOTAL_EASY,   easyLabel,   easyProgressCircle);
        updateCircle(data.mediumSolved, TOTAL_MEDIUM, mediumLabel, mediumProgressCircle);
        updateCircle(data.hardSolved,   TOTAL_HARD,   hardLabel,   hardProgressCircle);

        // ── Submission counts from API ──
        // totalSubmissionNum[0] = All, [1] = Easy, [2] = Medium, [3] = Hard
        const totalAll    = data.totalSubmissionNum[0].count;
        const totalEasy   = data.totalSubmissionNum[1].count;
        const totalMedium = data.totalSubmissionNum[2].count;
        const totalHard   = data.totalSubmissionNum[3].count;

        // ── Render submissions card ──
        cardStatsContainer.innerHTML = `
            <div class="card-item">
                <p class="card-title">Overall Submissions</p>
                <p class="card-value">${totalAll}</p>
            </div>
            <div class="card-item">
                <p class="card-title">Easy Submissions</p>
                <p class="card-value">${totalEasy}</p>
            </div>
            <div class="card-item">
                <p class="card-title">Medium Submissions</p>
                <p class="card-value">${totalMedium}</p>
            </div>
            <div class="card-item">
                <p class="card-title">Hard Submissions</p>
                <p class="card-value">${totalHard}</p>
            </div>
        `;
    }

    // ── Fetch User Details ──────────────────────────────────
    async function fetchUserDetails(username) {
        const url = `https://alfa-leetcode-api.onrender.com/${username}/solved`;

        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled    = true;

            const response = await fetch(url);
            const data     = await response.json();
            console.log("User Data:", data);

            // Check if valid user
            if (!data.easySolved && !data.mediumSolved && !data.hardSolved) {
                throw new Error("User not found");
            }

            // Check submission data exists
            if (!data.totalSubmissionNum || data.totalSubmissionNum.length < 4) {
                throw new Error("Submission data unavailable");
            }

            displayUserData(data);

        } catch (error) {
            statsContainer.innerHTML = `<p style="color:red; padding: 10px;">No data Found. Please check the username.</p>`;
            console.log(error);
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled    = false;
        }
    }

    // ── Search Button Click ─────────────────────────────────
    searchButton.addEventListener("click", function () {
        const username = usernameInput.value.trim();
        if (validateusername(username)) {
            fetchUserDetails(username);
        }
    });

    // ── Enter Key Support ───────────────────────────────────
    usernameInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") searchButton.click();
    });

});