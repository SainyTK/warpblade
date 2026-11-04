import { PATCH_SECTIONS, PATCH_TAGS } from "../../../src/constants/patchSections.ts";
import type { Patch, PatchChange, PatchEntry, PatchMedia } from "../../../src/types/patch.ts";
import { SITE_URL } from "../constants.ts";
import { longDate } from "./dates.ts";

const pageUrl = (patch: Patch) => `${SITE_URL}/patches/#${patch.version}`;

/** a still shown in the release body: the image itself, or a video's poster from the deployed site */
function picture(patch: Patch, media: PatchMedia): string {
  const file = media.kind === "video" ? media.poster : media.file;
  if (!file) return "";
  return `![${media.alt}](${SITE_URL}/patches/${patch.version}/${file})`;
}

function changeLine(change: PatchChange): string {
  if (change.kind === "note") return `- ${change.text}`;
  return `- ${change.label}: ${change.before} ⇒ **${change.after}**`;
}

function entryBlock(patch: Patch, entry: PatchEntry): string[] {
  const lines = [
    `### ${entry.name} (${PATCH_TAGS[entry.tag].label})`,
    "",
    `**${entry.summary}**`,
    "",
    `_${entry.context}_`,
    "",
  ];
  lines.push(...entry.changes.map(changeLine));
  if (entry.media) lines.push("", picture(patch, entry.media));
  if (entry.feedback?.length)
    lines.push("", `From player feedback ${entry.feedback.map((id) => `#${id}`).join(", ")}.`);
  lines.push("");
  return lines;
}

/** the GitHub release body, rendered from the same patch file as the patch notes page */
export function releaseNotes(patch: Patch): string {
  const kind = patch.kind === "big" ? "Big patch" : "Small patch";
  const lines = [`_${kind}, ${longDate(patch.date)}_`, "", `> ${patch.tagline}`, "", patch.intro, ""];
  lines.push(`Read the full notes with clips on the [patch notes page](${pageUrl(patch)}).`, "");
  if (patch.highlights.length) {
    lines.push("## Highlights", "");
    for (const h of patch.highlights) lines.push(`### ${h.title}`, "", h.text, "", picture(patch, h.media), "");
  }
  for (const section of PATCH_SECTIONS) {
    const found = patch.sections.find((s) => s.id === section.id);
    if (!found) continue;
    lines.push(`## ${section.title}`, "");
    for (const entry of found.entries) lines.push(...entryBlock(patch, entry));
  }
  if (patch.feedback.length) {
    lines.push("## You asked", "");
    for (const item of patch.feedback) lines.push(`- #${item.id}: ${item.summary}`);
    lines.push("");
  }
  return `${lines.join("\n").trim()}\n`;
}

export const releaseTitle = (patch: Patch) => `Patch ${patch.version}: ${patch.title}`;
