const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Load .env.local manually
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
let mongoUri = "";
envContent.split("\n").forEach(line => {
  if (line.startsWith("MONGODB_URI=")) {
    mongoUri = line.substring(line.indexOf("=") + 1).trim();
  }
});

if (!mongoUri) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

console.log("Connecting to MongoDB...");
const client = new MongoClient(mongoUri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully!");
    const db = client.db("default");
    const usersCol = db.collection("users");
    
    console.log("Fetching all users...");
    const users = await usersCol.find({}).toArray();
    console.log(`Found ${users.length} users total.`);
    users.forEach(u => {
      console.log(`- ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, isPaid: ${u.isPaid}`);
    });
  } catch (err) {
    console.error("Error running query:", err);
  } finally {
    await client.close();
  }
}

run();
