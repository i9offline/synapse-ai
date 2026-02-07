import { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export function createNotionClient(accessToken: string) {
  return new Client({ auth: accessToken });
}

function richTextToPlain(richText: RichTextItemResponse[]): string {
  return richText.map((rt) => rt.plain_text).join("");
}

export async function getNotionPages(accessToken: string) {
  const client = createNotionClient(accessToken);
  const allPages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.search({
      filter: { property: "object", value: "page" },
      page_size: 100,
      start_cursor: cursor,
    });
    allPages.push(...(response.results as PageObjectResponse[]));
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return allPages;
}

async function extractBlocks(
  client: Client,
  blockId: string,
  depth: number = 0
): Promise<string[]> {
  if (depth > 3) return [];

  const blocks = await client.blocks.children.list({
    block_id: blockId,
    page_size: 100,
  });

  const textParts: string[] = [];

  for (const block of blocks.results as BlockObjectResponse[]) {
    const b = block as BlockObjectResponse & Record<string, unknown>;
    const blockType = b.type as string;
    const blockData = b[blockType] as Record<string, unknown> | undefined;

    if (!blockData) continue;

    const richText = blockData.rich_text as RichTextItemResponse[] | undefined;
    if (richText) {
      const text = richTextToPlain(richText);
      if (text) {
        const prefix =
          blockType === "to_do"
            ? (blockData.checked ? "[x] " : "[ ] ")
            : blockType === "bulleted_list_item"
              ? "- "
              : blockType === "numbered_list_item"
                ? "- "
                : blockType.startsWith("heading")
                  ? "## "
                  : "";
        textParts.push(prefix + text);
      }
    }

    if (blockType === "table_row") {
      const cells = blockData.cells as RichTextItemResponse[][] | undefined;
      if (cells) {
        const row = cells.map((cell) => richTextToPlain(cell)).join(" | ");
        if (row) textParts.push(row);
      }
    }

    if (block.has_children) {
      const childTexts = await extractBlocks(client, block.id, depth + 1);
      textParts.push(...childTexts);
    }
  }

  return textParts;
}

function extractPropertyValue(prop: Record<string, unknown>): string {
  const type = prop.type as string;

  switch (type) {
    case "title":
    case "rich_text":
      return richTextToPlain((prop[type] as RichTextItemResponse[]) || []);
    case "number":
      return prop.number != null ? String(prop.number) : "";
    case "select":
      return (prop.select as { name: string } | null)?.name || "";
    case "multi_select":
      return ((prop.multi_select as { name: string }[]) || [])
        .map((s) => s.name)
        .join(", ");
    case "status":
      return (prop.status as { name: string } | null)?.name || "";
    case "date": {
      const date = prop.date as { start?: string; end?: string } | null;
      if (!date?.start) return "";
      return date.end ? `${date.start} → ${date.end}` : date.start;
    }
    case "checkbox":
      return prop.checkbox ? "Yes" : "No";
    case "url":
      return (prop.url as string) || "";
    case "email":
      return (prop.email as string) || "";
    case "phone_number":
      return (prop.phone_number as string) || "";
    case "people":
      return ((prop.people as { name?: string }[]) || [])
        .map((p) => p.name || "Unknown")
        .join(", ");
    case "relation":
      return ((prop.relation as { id: string }[]) || []).length + " linked items";
    case "formula": {
      const formula = prop.formula as Record<string, unknown> | null;
      if (!formula) return "";
      const fType = formula.type as string;
      return String(formula[fType] ?? "");
    }
    default:
      return "";
  }
}

export function extractPageProperties(page: PageObjectResponse): string {
  const parts: string[] = [];

  for (const [name, prop] of Object.entries(page.properties)) {
    const value = extractPropertyValue(prop as Record<string, unknown>);
    if (value && (prop as Record<string, unknown>).type !== "title") {
      parts.push(`${name}: ${value}`);
    }
  }

  return parts.join("\n");
}

export async function getPageContent(
  accessToken: string,
  pageId: string,
  page?: PageObjectResponse
): Promise<string> {
  const client = createNotionClient(accessToken);
  const parts: string[] = [];

  // Extract properties as structured data
  if (page) {
    const propsText = extractPageProperties(page);
    if (propsText) parts.push(propsText);
  }

  // Extract block content
  const blockTexts = await extractBlocks(client, pageId);
  parts.push(...blockTexts);

  return parts.join("\n\n");
}

export function getPageTitle(page: PageObjectResponse): string {
  const titleProp = Object.values(page.properties).find(
    (p) => p.type === "title"
  );
  if (titleProp?.type === "title") {
    const title = richTextToPlain(titleProp.title);
    if (title) return title;
  }

  return "Untitled";
}
