// Andy Matuschak Stacked Notes (Sliding Panes) Engine - Clean & Simple

const SPINE_WIDTH = 38

function escapeHtml(str: string): string {
  const div = document.createElement("div")
  div.textContent = str
  return div.innerHTML
}

function normalizePath(rawPath: string): string {
  if (!rawPath) return "/"
  let clean = rawPath.split("?")[0].split("#")[0]
  // strip repo prefix if any
  if (clean.startsWith("/wutdahack1337.github.io")) {
    clean = clean.slice("/wutdahack1337.github.io".length)
  }
  // strip .html or .htm extension
  clean = clean.replace(/\.html?$/i, "")
  // strip trailing slashes
  clean = clean.replace(/\/+$/, "")
  // strip trailing /index or index
  clean = clean.replace(/\/index$/i, "")
  if (clean === "" || clean === "/index" || clean === "index") {
    clean = "/"
  }
  return clean
}

function getCleanTitle(doc: Document | HTMLElement): string {
  const h1 = doc.querySelector("h1.article-title")
  if (h1 && h1.textContent?.trim()) {
    return h1.textContent.trim()
  }
  const anyH1 = doc.querySelector("h1")
  if (anyH1 && anyH1.textContent?.trim()) {
    return anyH1.textContent.trim()
  }
  if ("title" in doc && typeof (doc as Document).title === "string") {
    return (doc as Document).title.replace(" - wutdahack", "").trim()
  }
  return "Ghi chép"
}

function triggerMermaidRender() {
  if (typeof (window as any).renderAllMermaid === "function") {
    (window as any).renderAllMermaid()
  } else {
    ; (document as any).dispatchEvent(new CustomEvent("nav"))
  }
}

function deduplicatePanes() {
  const body = document.getElementById("quartz-body")
  if (!body) return

  const seenUrls = new Set<string>()
  const panes = Array.from(body.querySelectorAll<HTMLElement>(".stacked-pane"))

  panes.forEach((pane) => {
    const url = normalizePath(pane.dataset.url || "")
    if (seenUrls.has(url)) {
      pane.remove()
    } else {
      seenUrls.add(url)
    }
  })
}

async function initStackedNotes() {
  const body = document.getElementById("quartz-body")
  if (!body) return

  if (body.dataset.stackedInit === "true") return
  body.dataset.stackedInit = "true"

  const currentPath = normalizePath(window.location.pathname)
  const isIndex = currentPath === "/"

  const initialCenter = body.querySelector(":scope > .center") as HTMLElement | null

  // Check if current page is actually the index page (by URL or by content)
  const isActuallyIndex =
    isIndex ||
    (initialCenter?.querySelector("h1")?.textContent?.includes("Xin chào, mình là Minh") ?? false)

  if (isActuallyIndex && initialCenter) {
    // Current page IS index -> Set as Pane 0
    initialCenter.dataset.url = "/"
    setupPaneElement(initialCenter, 0, "wutdahack's notes")
    triggerMermaidRender()
  } else if (initialCenter) {
    // Current page is NOT index, but leftmost pane MUST be index:
    // 1. Convert initialCenter to Pane 1
    const initialTitle = getCleanTitle(document)
    initialCenter.dataset.url = currentPath
    setupPaneElement(initialCenter, 1, initialTitle)

    // 2. Fetch index and prepend as Pane 0 ONLY if no index pane exists
    const existingIndex = body.querySelector<HTMLElement>('.stacked-pane[data-url="/"]')
    if (!existingIndex) {
      try {
        const homeHref = document.querySelector<HTMLAnchorElement>("#home-link")?.getAttribute("href") || "/"
        const rootRes = await fetch(homeHref)
        if (rootRes.ok) {
          const rootHtml = await rootRes.text()
          const parser = new DOMParser()
          const rootDoc = parser.parseFromString(rootHtml, "text/html")
          const rootCenter = rootDoc.querySelector(".center")
          if (rootCenter) {
            const indexPane = document.createElement("div")
            indexPane.className = "center stacked-pane"
            indexPane.dataset.url = "/"

            const contentDiv = document.createElement("div")
            contentDiv.className = "pane-content"
            contentDiv.innerHTML = rootCenter.innerHTML
            indexPane.appendChild(contentDiv)

            setupPaneElement(indexPane, 0, "wutdahack's notes")
            body.insertBefore(indexPane, initialCenter)

            // Scroll to active pane
            setTimeout(() => {
              scrollToPane(1)
              updateHeaderTrail()
              triggerMermaidRender()
            }, 30)
          }
        }
      } catch (e) {
        console.warn("Could not prepend index pane:", e)
      }
    }
  }

  // Ensure no duplicate panes exist in DOM
  deduplicatePanes()

  // Intercept all internal clicks globally on document (covers panes, header, search)
  document.addEventListener("click", handleInternalLinkClick, true)

  // Hook home button in header
  const homeBtn = document.getElementById("home-link")
  if (homeBtn) {
    homeBtn.addEventListener("click", (e) => {
      e.preventDefault()
      closePanesFrom(1)
      scrollToPane(0)
    })
  }

  updateHeaderTrail()
}

function setupPaneElement(el: HTMLElement, index: number, title: string) {
  el.classList.add("stacked-pane")
  el.dataset.paneIndex = index.toString()
  el.style.left = `${index * SPINE_WIDTH}px`
  el.style.zIndex = `${(index + 1) * 10}`

  // Ensure content is wrapped in .pane-content
  let content = el.querySelector(":scope > .pane-content") as HTMLElement | null
  if (!content) {
    content = document.createElement("div")
    content.className = "pane-content"
    while (el.firstChild) {
      content.appendChild(el.firstChild)
    }
    el.appendChild(content)
  }

  // Remove duplicate spines if any
  el.querySelectorAll(":scope > .pane-spine").forEach((s) => s.remove())

  // Create sticky spine
  const spine = document.createElement("div")
  spine.className = "pane-spine"
  spine.title = title
  spine.innerHTML = `
    ${index > 0 ? `<button class="pane-close-btn" aria-label="Đóng cột" title="Đóng cột này">×</button>` : ""}
    <span class="pane-spine-title">${escapeHtml(title)}</span>
  `

  spine.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).classList.contains("pane-close-btn")) {
      e.stopPropagation()
      closePanesFrom(index)
    } else {
      scrollToPane(index)
    }
  })

  el.insertBefore(spine, content)
}

let isOpeningNote = false

async function handleInternalLinkClick(e: MouseEvent) {
  const target = (e.target as HTMLElement).closest("a")
  if (!target) return

  const href = target.getAttribute("href")
  if (!href) return

  // Skip external, anchors, mailto, etc.
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("#") ||
    target.getAttribute("target") === "_blank" ||
    e.ctrlKey ||
    e.metaKey
  ) {
    return
  }

  e.preventDefault()
  e.stopPropagation()

  const currentPane = target.closest(".stacked-pane") as HTMLElement | null
  const currentIndex = currentPane ? parseInt(currentPane.dataset.paneIndex || "0", 10) : 0

  const targetUrl = new URL(href, window.location.href)
  const targetClean = normalizePath(targetUrl.pathname)

  // 1. If clicking link to home/index: scroll to Pane 0 and close all others
  if (targetClean === "/") {
    closePanesFrom(1)
    scrollToPane(0)
    return
  }

  // 2. Check if target is already open in an existing pane
  const body = document.getElementById("quartz-body")
  if (body) {
    const existingPanes = Array.from(body.querySelectorAll<HTMLElement>(".stacked-pane"))
    const existing = existingPanes.find((p) => normalizePath(p.dataset.url || "") === targetClean)
    if (existing) {
      const idx = parseInt(existing.dataset.paneIndex || "0", 10)
      closePanesFrom(idx + 1)
      scrollToPane(idx)
      return
    }
  }

  // 3. Otherwise open note right next to current pane (currentIndex + 1)
  await openTargetNote(targetUrl, targetClean, currentIndex + 1)
}

async function openTargetNote(url: URL, targetClean: string, targetIndex: number) {
  if (isOpeningNote) return

  // Absolute guard against opening index as a pane
  if (targetClean === "/") {
    closePanesFrom(1)
    scrollToPane(0)
    return
  }

  isOpeningNote = true

  const body = document.getElementById("quartz-body")
  if (!body) {
    isOpeningNote = false
    return
  }

  try {
    const res = await fetch(url.toString())
    if (!res.ok) {
      window.location.href = url.toString()
      return
    }

    const htmlText = await res.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlText, "text/html")

    const center = doc.querySelector(".center")
    if (!center) {
      window.location.href = url.toString()
      return
    }

    // Absolute guard: If fetched doc is index page, NEVER open as a pane!
    if (
      center.querySelector("h1")?.textContent?.includes("Xin chào, mình là Minh") ||
      targetClean === "/"
    ) {
      closePanesFrom(1)
      scrollToPane(0)
      return
    }

    const title = getCleanTitle(doc)

    // Close any pane at or after targetIndex
    closePanesFrom(targetIndex)

    // Create new stacked pane
    const newPane = document.createElement("div")
    newPane.dataset.url = targetClean

    const contentDiv = document.createElement("div")
    contentDiv.className = "pane-content"
    contentDiv.innerHTML = center.innerHTML
    newPane.appendChild(contentDiv)

    setupPaneElement(newPane, targetIndex, title)
    body.appendChild(newPane)

    // Deduplicate any potential duplicate panes
    deduplicatePanes()

    // Smooth scroll to new pane and trigger diagram render
    setTimeout(() => {
      scrollToPane(targetIndex)
      updateHeaderTrail()
      triggerMermaidRender()
    }, 40)
  } catch (err) {
    console.error("Failed to load note:", err)
    window.location.href = url.toString()
  } finally {
    isOpeningNote = false
  }
}

function closePanesFrom(fromIndex: number) {
  const body = document.getElementById("quartz-body")
  if (!body) return

  const panes = body.querySelectorAll<HTMLElement>(".stacked-pane")
  panes.forEach((pane) => {
    const idx = parseInt(pane.dataset.paneIndex || "0", 10)
    if (idx >= fromIndex) {
      pane.remove()
    }
  })
  updateHeaderTrail()
}

function scrollToPane(index: number) {
  const body = document.getElementById("quartz-body")
  if (!body) return

  const targetPane = body.querySelector<HTMLElement>(`.stacked-pane[data-pane-index="${index}"]`)
  if (targetPane) {
    const scrollTarget = Math.max(0, targetPane.offsetLeft - index * SPINE_WIDTH)
    body.scrollTo({ left: scrollTarget, behavior: "smooth" })
  }
  updateHeaderTrail()
}

function getShortTitle(title: string, maxLen = 18): string {
  let clean = title
    .replace(/\s*-\s*Marcus Aurelius.*$/i, "")
    .replace(/\s*\(.*\)$/, "")
    .trim()
  if (clean.length > maxLen) {
    return clean.slice(0, maxLen - 1) + "…"
  }
  return clean
}

function updateHeaderTrail() {
  const trail = document.getElementById("header-stack-trail")
  const body = document.getElementById("quartz-body")
  if (!trail || !body) return

  const panes = Array.from(body.querySelectorAll<HTMLElement>(".stacked-pane"))
  const items: { title: string; index: number }[] = []

  panes.forEach((pane) => {
    const idx = parseInt(pane.dataset.paneIndex || "0", 10)
    const spineTitle = pane.querySelector(".pane-spine-title")?.textContent || "Note"
    items.push({ title: spineTitle, index: idx })
  })

  items.sort((a, b) => a.index - b.index)

  trail.innerHTML = items
    .map((item, i) => {
      const isLast = i === items.length - 1
      const icon = item.index === 0 ? "🏠" : "📄"
      const short = item.index === 0 ? "Trang chủ" : getShortTitle(item.title)

      return `
        <span class="trail-item ${isLast ? "active" : ""}" onclick="window.scrollToPane(${item.index})" style="cursor: pointer;" title="${escapeHtml(item.title)}">
          <span>${icon}</span>
          <span>${escapeHtml(short)}</span>
        </span>
        ${!isLast ? `<span class="trail-separator">›</span>` : ""}
      `
    })
    .join("")
}

// Global hook for onclick
; (window as any).scrollToPane = scrollToPane

document.addEventListener("DOMContentLoaded", initStackedNotes)
