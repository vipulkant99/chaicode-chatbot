import { QdrantClient } from "@qdrant/js-client-rest";

export default async function handler(req, res) {
  console.log("we here");

  try {
    const client = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });

    // fetch all points with payload (metadata)
    const result = await client.scroll("rag-assignment", {
      with_payload: true,
      with_vector: false,
      limit: 100, // adjust if you want more
    });

    res.status(200).json(result.points); // send courses back
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
}
