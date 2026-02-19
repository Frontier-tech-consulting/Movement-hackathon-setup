import { ECOSYSTEM_APPS, getAppsByCategory } from "@/lib/ecosystem-data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const search = searchParams.get("search")?.toLowerCase() ?? "";

    let apps = getAppsByCategory(category);

    if (search) {
        apps = apps.filter(
            (app) =>
                app.name.toLowerCase().includes(search) ||
                app.description.toLowerCase().includes(search) ||
                app.tags.some((t) => t.toLowerCase().includes(search))
        );
    }

    return NextResponse.json({
        apps,
        total: ECOSYSTEM_APPS.length,
        filtered: apps.length,
    });
}
