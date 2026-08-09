import { NextResponse } from "next/server";
import { igApi } from "insta-fetcher";

export const dynamic = "force-static";
export const revalidate = 172800; // 2 days

const SESSION_ID = process.env.IG_SESSION_ID!;
const USERNAME = process.env.IG_TARGET_USERNAME!;
const MAX_POSTS = 8;

interface InstagramMediaLink {
    id: string;
    url: string;
    type: "image" | "video";
    dimensions?: { height: number; width: number };
}

export interface InstagramPost {
    shortcode: string;
    postType: "image" | "video" | "carousel";
    caption: string;
    taken_at_timestamp: number;
    media_count: number;
    video_duration: number | null;
    links: InstagramMediaLink[];
    isReel: boolean;
}

function isPinned(item: any, ownerId: string, pinnedIds: Set<string>): boolean {
    const timelinePinned = Array.isArray(item?.timeline_pinned_user_ids)
        ? item.timeline_pinned_user_ids.map(String)
        : [];

    return (
        timelinePinned.includes(ownerId) ||
        pinnedIds.has(String(item?.pk)) ||
        pinnedIds.has(String(item?.id))
    );
}

// Pull the best-res image URL off an image_versions2 candidate list
function bestImage(node: any): InstagramMediaLink | null {
    const candidates = node?.image_versions2?.candidates;
    if (!Array.isArray(candidates) || candidates.length === 0) return null;
    const best = candidates[0]; // IG returns these sorted largest-first
    return {
        id: String(node.pk ?? node.id),
        url: best.url,
        type: "image",
        dimensions: { width: best.width, height: best.height },
    };
}

function bestVideo(node: any): InstagramMediaLink | null {
    const versions = node?.video_versions;
    if (!Array.isArray(versions) || versions.length === 0) return null;
    const best = versions[0];
    return {
        id: String(node.pk ?? node.id),
        url: best.url,
        type: "video",
        dimensions: { width: best.width, height: best.height },
    };
}

function mapItemToPost(item: any): InstagramPost {
    const isCarousel = item?.media_type === 8 || Array.isArray(item?.carousel_media);
    const isVideo = item?.media_type === 2;

    let links: InstagramMediaLink[] = [];
    let postType: InstagramPost["postType"] = "image";

    if (isCarousel) {
        postType = "carousel";
        links = (item.carousel_media ?? [])
            .map((node: any) =>
                node?.media_type === 2 ? bestVideo(node) : bestImage(node)
            )
            .filter(Boolean) as InstagramMediaLink[];
    } else if (isVideo) {
        postType = "video";
        const v = bestVideo(item);
        if (v) links = [v];
    } else {
        postType = "image";
        const i = bestImage(item);
        if (i) links = [i];
    }

    return {
        shortcode: item.code ?? item.shortcode,
        postType,
        caption: item?.caption?.text ?? item?.caption ?? "",
        taken_at_timestamp: item.taken_at ?? item.taken_at_timestamp,
        media_count: isCarousel ? (item.carousel_media?.length ?? 1) : 1,
        video_duration: item.video_duration ?? null,
        links,
        isReel:
            item.product_type === "clips" ||
            item.media_type === 2 && item.video_duration != null,
    };
}

export async function GET() {
    try {
        const ig = new igApi(SESSION_ID);
        const page: any = await ig.fetchUserPostsV2(USERNAME);
        const items = page?.posts ?? page?.data ?? page?.items ?? [];

        const ownerId = String(items[0]?.user?.pk ?? "");
        const pinnedIds = new Set<string>(
            (page?.pinned_profile_grid_items_ids ?? []).map(String)
        );

        const posts: InstagramPost[] = items
            .filter((item: any) => !isPinned(item, ownerId, pinnedIds))
            .slice(0, MAX_POSTS)
            .map(mapItemToPost);

        posts.sort((a, b) => b.taken_at_timestamp - a.taken_at_timestamp);

        return NextResponse.json({ posts });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Unknown error" },
            { status: 500 }
        );
    }
}