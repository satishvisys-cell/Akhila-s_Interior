const ALLOWED_TAGS = new Set([
  "a",
  "abbr",
  "b",
  "blockquote",
  "br",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "dd",
  "del",
  "dfn",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "li",
  "mark",
  "ol",
  "p",
  "pre",
  "q",
  "s",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
]);

const GLOBAL_ALLOWED_ATTRS = new Set(["class", "id", "title", "aria-label", "aria-hidden"]);

const TAG_ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "target", "rel"]),
  img: new Set(["src", "alt", "width", "height", "loading"]),
  td: new Set(["colspan", "rowspan"]),
  th: new Set(["colspan", "rowspan", "scope"]),
  col: new Set(["span"]),
  colgroup: new Set(["span"]),
};

const DANGEROUS_PROTOCOL = /^(javascript|data|vbscript):/i;

function stripControlChars(input: string): string {
  return input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

function isAllowedAttr(tag: string, attr: string): boolean {
  const lower = attr.toLowerCase();
  if (lower.startsWith("on")) return false;
  if (lower.startsWith("data-")) return true;
  if (GLOBAL_ALLOWED_ATTRS.has(lower)) return true;
  return TAG_ALLOWED_ATTRS[tag]?.has(lower) ?? false;
}

function sanitizeAttrValue(tag: string, attr: string, value: string): string | null {
  const lowerAttr = attr.toLowerCase();
  const trimmed = value.trim();

  if ((lowerAttr === "href" || lowerAttr === "src") && DANGEROUS_PROTOCOL.test(trimmed)) {
    return null;
  }

  if (tag === "a" && lowerAttr === "target" && trimmed === "_blank") {
    return "_blank";
  }

  if (tag === "a" && lowerAttr === "rel" && trimmed) {
    return "noopener noreferrer";
  }

  return trimmed.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

function sanitizeElement(el: Element): string {
  const tag = el.tagName.toLowerCase();

  if (!ALLOWED_TAGS.has(tag)) {
    return Array.from(el.childNodes)
      .map((child) => sanitizeNode(child))
      .join("");
  }

  const attrs: string[] = [];
  for (const attr of Array.from(el.attributes)) {
    if (!isAllowedAttr(tag, attr.name)) continue;
    const sanitized = sanitizeAttrValue(tag, attr.name, attr.value);
    if (sanitized === null) continue;
    attrs.push(`${attr.name.toLowerCase()}="${escapeAttr(sanitized)}"`);
  }

  const attrStr = attrs.length > 0 ? ` ${attrs.join(" ")}` : "";
  const inner = Array.from(el.childNodes)
    .map((child) => sanitizeNode(child))
    .join("");

  if (tag === "br" || tag === "hr" || tag === "img" || tag === "col") {
    return `<${tag}${attrStr}>`;
  }

  return `<${tag}${attrStr}>${inner}</${tag}>`;
}

function sanitizeNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeText(node.textContent ?? "");
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    return sanitizeElement(node as Element);
  }
  return "";
}

function escapeText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Strip scripts and unsafe markup from HTML, keeping a conservative allowlist.
 * Works in browser and Node (via DOMParser when available).
 */
export function sanitizeHtml(input: string): string {
  const cleaned = stripControlChars(input ?? "");

  if (typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(cleaned, "text/html");
    return Array.from(doc.body.childNodes)
      .map((node) => sanitizeNode(node))
      .join("");
  }

  return sanitizeHtmlFallback(cleaned);
}

/** Regex-based fallback for environments without DOMParser */
function sanitizeHtmlFallback(input: string): string {
  let result = input;

  result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  result = result.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  result = result.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  result = result.replace(/\s(href|src)\s*=\s*("|\')\s*(javascript|data|vbscript):[^"\']*\2/gi, "");

  result = result.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag: string) => {
    const lower = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(lower)) return "";
    if (match.startsWith("</")) return `</${lower}>`;
    return match.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  });

  return result;
}

export function stripAllHtml(input: string): string {
  return stripControlChars(input ?? "").replace(/<[^>]*>/g, "");
}
