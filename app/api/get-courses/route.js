import { QdrantClient } from "@qdrant/js-client-rest";

export async function GET(req) {
  try {
    const client = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });

    // fetch all points with payload (metadata)
    const result = await client.getCollections();
    const details = [];

    for (const col of result.collections) {
      const info = await client.getCollection(col.name);
      details.push({
        name: col.name,
        info: info,
      });
    }
    console.log("data is:", details);

    return new Response(JSON.stringify(details), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
