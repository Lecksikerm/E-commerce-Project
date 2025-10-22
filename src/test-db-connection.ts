import "reflect-metadata";
import { dataSource } from "./data-source";

async function testConnection() {
  try {
    await dataSource.initialize();
    console.log("✅ Database connected successfully!");
    await dataSource.destroy();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

testConnection();
