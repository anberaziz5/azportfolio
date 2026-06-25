import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import ws from 'ws';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const JINA_API_KEY = process.env.JINA_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    realtime: { transport: ws }
});

// --- 1. Chunk the knowledge base ---
function chunkText(text, chunkSize = 500, overlap = 80) {
    const chunks = [];
    let i = 0;
    while (i < text.length) {
        chunks.push(text.slice(i, i + chunkSize));
        i += chunkSize - overlap;
    }
    return chunks;
}

const rawText = fs.readFileSync('./knowledgebase/anber_rag_knowledge_base.md', 'utf8');
const chunks = chunkText(rawText);
console.log(`Total chunks: ${chunks.length}`);

// --- 2. Embed via Jina AI ---
async function embedText(text) {
    const response = await fetch('https://api.jina.ai/v1/embeddings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JINA_API_KEY}`,
        },
        body: JSON.stringify({
            input: [text],
            model: 'jina-embeddings-v2-base-en',
        }),
    });
    const data = await response.json();
    if (!data.data) throw new Error(JSON.stringify(data));
    return data.data[0].embedding; // 768-dimensional
}

// --- 3. Ingest all chunks ---
async function ingest() {
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        console.log(`Embedding chunk ${i + 1}/${chunks.length}...`);

        try {
            const embedding = await embedText(chunk);

            const { error } = await supabase
                .from('knowledge_chunks')
                .insert({
                    content: chunk,
                    embedding,
                    metadata: { chunk_index: i, source: 'anber_rag_knowledge_base.md' }
                });

            if (error) throw error;

            await new Promise(r => setTimeout(r, 200));
        } catch (err) {
            console.error(`Failed on chunk ${i}:`, err.message);
        }
    }
    console.log('✅ Ingestion complete!');
}

ingest();