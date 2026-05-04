function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(s: string): string {
  return s
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
}

export function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inUl = false;
  let inOl = false;
  let inCode = false;
  let codeLang = "";
  let codeAcc: string[] = [];

  const closeUl = () => { if (inUl) { out.push("</ul>"); inUl = false; } };
  const closeOl = () => { if (inOl) { out.push("</ol>"); inOl = false; } };
  const closeLists = () => { closeUl(); closeOl(); };

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCode) {
        out.push(`<pre data-lang="${escHtml(codeLang)}"><code>${escHtml(codeAcc.join("\n"))}</code></pre>`);
        inCode = false; codeLang = ""; codeAcc = [];
      } else {
        closeLists();
        inCode = true;
        codeLang = line.slice(3).trim() || "text";
      }
      continue;
    }
    if (inCode) { codeAcc.push(line); continue; }

    if (line.startsWith("# ")) {
      closeLists(); out.push(`<h1>${inline(line.slice(2))}</h1>`);
    } else if (line.startsWith("## ")) {
      closeLists(); out.push(`<h2>${inline(line.slice(3))}</h2>`);
    } else if (line.startsWith("### ")) {
      closeLists(); out.push(`<h3>${inline(line.slice(4))}</h3>`);
    } else if (line.startsWith("#### ")) {
      closeLists(); out.push(`<h4>${inline(line.slice(5))}</h4>`);
    } else if (/^[-*] /.test(line)) {
      closeOl();
      if (!inUl) { out.push("<ul>"); inUl = true; }
      out.push(`<li>${inline(line.slice(2))}</li>`);
    } else if (/^\d+\. /.test(line)) {
      closeUl();
      if (!inOl) { out.push("<ol>"); inOl = true; }
      out.push(`<li>${inline(line.replace(/^\d+\. /, ""))}</li>`);
    } else if (line.trim() === "---" || line.trim() === "***") {
      closeLists(); out.push("<hr>");
    } else if (line.trim() === "") {
      closeLists();
    } else {
      closeLists(); out.push(`<p>${inline(line)}</p>`);
    }
  }

  closeLists();
  if (inCode && codeAcc.length > 0) {
    out.push(`<pre data-lang="${escHtml(codeLang)}"><code>${escHtml(codeAcc.join("\n"))}</code></pre>`);
  }

  return out.join("\n");
}
