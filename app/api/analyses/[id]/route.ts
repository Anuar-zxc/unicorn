import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: analysis, error: findError } = await supabase
    .from("analyses")
    .select("id,file_path")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (findError) {
    return NextResponse.json({ error: findError.message }, { status: 500 });
  }
  if (!analysis) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const { error: deleteError } = await supabase
    .from("analyses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  if (analysis.file_path) {
    await supabase.storage.from("contracts").remove([analysis.file_path]);
  }

  return NextResponse.json({ ok: true });
}
