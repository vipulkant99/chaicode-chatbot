import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { query, currentCourse, chatHistory } = await req.json();
    chatHistory.pop();

    if (!query || query.trim() === "") {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    const SYSTEM_PROMPT_QUERY = `
    User might have different courses sometimes it might not specify you about which course itt is talking about. If user doest give you any refrence about the course you use always ${currentCourse}. You have to give context about this topic only.

  You are and AI assistant who helps in enhancing user queries quality. User will give you a quality you have to correct its grammar give more context to it and it should be the context should be around user query only. Your motive is to make user query more better and more meaningful by doing all grammar and spelling checks. And you can add more context to it as well like about the topic what it is just little a line or two nor more. If you feel user query is already really good need no ore enhancement just return the same query.
  `;

    const currentResponse = await openAIQueries(
      SYSTEM_PROMPT_QUERY,
      chatHistory,
      false
    );
    let new_query = currentResponse.choices[0].message.content;

    console.log("enhanced query is: ", new_query);
    chatHistory.push({ role: "assistant", content: new_query });
    console.log("chat history is: ", chatHistory);

    //1. Load embeddings
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-large",
    });

    //2. Connect to existing Qdrant collection
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY,
        collectionName: currentCourse,
      }
    );

    // 3. Setup retriever
    const retriever = vectorStore.asRetriever({ k: 3 });

    // 4. Fetch relevant chunks
    const relevantChunk = await retriever.invoke(new_query);

    console.log("current course is:", currentCourse);

    // 5. Build system prompt
    const SYSTEM_PROMPT = `
      You are and AI assistant who helps in resolving user query based on the context available to you from the vector database. You can be little more friendly to user if it asking something related to the data you have. You can give starting timestamp and if you have code you can give code as an example as well. You will only solve questions about current course/context you have. There are multiple courses but you have to respond in the reference of currently seleted course only and the context you have.

      For your refrence this willl give you current selected course: ${currentCourse}

      For example:
      when in node if user is asking about you should not answer about it until and unless in the current context you have anything about python be sweet and say something like in node you have no context about python.

      just if query is totally out of content you have then only ask to ask something from the related content you have/\. You can give a table of content as well to the user like you just helping what he/she can ask.


      Context:
      ${JSON.stringify(relevantChunk)}
      `;

    const stream = await openAIQueries(SYSTEM_PROMPT, chatHistory, true);

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
            );
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });

    // return Response.json({
    //   answer: response.content,
    //   context: relevantChunk, // optional: send context back for debugging
    // });
  } catch (err) {
    console.error("Chat RAG Error:", err);
    return new Response({ error: err.message }, { status: 500 });
  }
}

async function openAIQueries(SYSTEM_PROMPT, query, stream) {
  const response = await client.chat.completions.create({
    model: "gpt-4.1",
    stream: stream,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...query],
  });

  return response;
}
