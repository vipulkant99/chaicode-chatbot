import { parse } from "node-webvtt";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { headers } from "next/headers";

export async function POST(req) {
  const formData = await req.formData();
  const files = formData.getAll("files");
  const name = formData.get("name");
  const url = formData.get("url");

  console.log("file data is:", files[0]);

  const allDocs = await loadVttFolder(files);

  console.log("length is", allDocs.length);

  //console.log("all docs done", allDocs, Array.isArray(allDocs), allDocs.length);
  // allDocs.forEach((doc, idx) => {
  //   if (!doc.pageContent || typeof doc.pageContent !== "string") {
  //     console.error("Invalid doc at index", idx, doc);
  //   } else if (doc.pageContent.length > 10000) {
  //     console.warn("Doc too long", idx, doc.pageContent.length);
  //   } else {
  //     console.log("hehehehe");
  //   }
  // });

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });

  const BATCH_SIZE = 50;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for (let i = 0; i < allDocs.length; i += BATCH_SIZE) {
          const batch = allDocs.slice(i, i + BATCH_SIZE);
          console.log(`Processing batch ${i / BATCH_SIZE + 1}`);
          await QdrantVectorStore.fromDocuments(batch, embeddings, {
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_API_KEY,
            collectionName: url,
          });
          const percentage = Math.round((i / allDocs.length) * 100);
          console.log(`percentage is: ${percentage}`);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ percentage })}\n\n`)
          );
        }
        controller.close();
      } catch (err) {
        console.error("Problem we have", err);
      }
    },
  });

  // await QdrantVectorStore.fromDocuments(allDocs, embeddings, {
  //   url: process.env.QDRANT_URL,
  //   apiKey: process.env.QDRANT_API_KEY,
  //   collectionName: url,
  // });

  console.log("Indexing of documents done");

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

async function loadVttFolder(files) {
  let allDocs = [];

  for (const file of files) {
    //console.log("Processing file:", file.name);

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = buffer.toString("utf-8");

    const parsed = parse(text);

    //console.log(`Parsed ${parsed.cues.length} cues from ${file.name}`);

    const docs = parsed.cues.map(
      (cue, i) =>
        new Document({
          pageContent: cue.text,
          metadata: {
            index: i,
            start: cue.start,
            end: cue.end,
            source: file.name, // file name as source
          },
        })
    );

    allDocs = allDocs.concat(docs);
    //console.log("main docs are", allDocs);
  }

  return allDocs;
}
