import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request) {
  const body = await request.json();
  const { source_id, payload } = body;

  const { data, error } = await sb
    .from("raw_ingestion")
    .insert({
      source_id,
      raw_payload: payload,
      status: "pending",
      pipeline_step: "collect",
    })
    .select()
    .single();

  if (error)
    return Response.json(
      { error: error.message },
      { status: 500 }
    );

  await triggerPipeline(data.id);

  return Response.json({
    id: data.id,
    status: "ingested",
  });
}