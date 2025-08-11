import { analyzeText } from "./model.ts";

async function testModel() {
  try {
    console.log("Starting model test...");
    
    // Test cases with different sentiments
    const testCases = [
      "This product is amazing! I love it!",
      "The service was terrible and the staff was rude.",
      "The weather is okay today.",
      "I'm not sure about this.",
      "This is the best thing ever!",
      "I really dislike this.",
      "It's just average.",
    ];

    console.log("\nTesting model with different inputs:");
    console.log("----------------------------------------");

    for (const text of testCases) {
      console.log(`\nInput: "${text}"`);
      const result = await analyzeText(text);
      console.log("Result:", JSON.stringify(result, null, 2));
    }

    console.log("\nTest completed successfully!");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
testModel(); 