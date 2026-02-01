import { error, log } from "console";
import readline from "readline";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Global variables to store fetched posts and API call times
let posts = [];
let apiCallTimes = [];

// Function to display menu
function displayMenu() {
  console.log("\n=== MENU ===");
  console.log("1. Fetch 10 Posts");
  console.log("2. Display Post Statistics");
  console.log("3. Display API Performance Statistics");
  console.log("4. Exit");
  console.log("============\n");
}

// Helper function to get user input
function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Option 1: Fetch posts
async function fetchPosts() {
  const start = Date.now();
  let count = 0;
  const l1 = [];
  for (let index = 0; index < 10; index++) {
    const post = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${index}`,
    )
      .then((response) => response.json())
      .then((json) => {
        l1.push(json);
        count++;
        console.log(json.title);
      });
  }
  console.log(Date.now() - start);
  console.log(count);

  return l1;
}
// fetchPosts();
// Option 2: Display post statistics
async function displayPostStatistics() {
  let avg = 0;
  let count = 0;
  for (let index = 0; index < 10; index++) {
    const start = Date.now();
    await fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => count++)
      .catch(error=>console.log(error));
      ;

    const end = Date.now();
    avg += end - start;
  }
  console.log("avg for fetch is:", avg / count);
  console.log("number posts", count);
  
}

// Option 3: Display API performance statistics
function displayApiPerformance() {
  // TODO: Implement this function
}

// Main function to run the application
async function main() {
  let running = true;

  while (running) {
    displayMenu();
    const choice = await promptUser("Enter your choice (1-4): ");

    switch (choice) {
      case "1":
        await fetchPosts();
        break;
      case "2":
        displayPostStatistics();
        break;
      case "3":
        displayApiPerformance();
        break;
      case "4":
        console.log("Goodbye!");
        running = false;
        rl.close();
        break;
      default:
        console.log("Invalid choice. Please enter 1, 2, 3, or 4.");
    }
  }
}

// Run the application
main();
