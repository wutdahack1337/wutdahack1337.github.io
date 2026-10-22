import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/andyHeader.scss"
import { pathToRoot, FullSlug } from "../util/path"
import Search from "./Search"
import Darkmode from "./Darkmode"

export default (() => {
  const SearchComponent = Search()
  const DarkmodeComponent = Darkmode()

  const AndyHeader: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData } = props
    const root = pathToRoot((fileData.slug ?? "index") as FullSlug)
    const homeUrl = root.length === 0 ? "." : root

    return (
      <header id="andy-header">
        <div class="header-left">
          <a href={homeUrl} class="header-logo" id="home-link">
            wutdahack's working notes
          </a>
          <div class="header-trail" id="header-stack-trail">
            <span class="trail-item active">🏠 Trang chủ</span>
          </div>
        </div>
        <div class="header-right">
          <SearchComponent {...props} />
          <DarkmodeComponent {...props} />
        </div>
      </header>
    )
  }

  // Pass through all css and scripts of subcomponents so Quartz bundles them!
  AndyHeader.css = [
    style,
    ...(Array.isArray(SearchComponent.css) ? SearchComponent.css : [SearchComponent.css]),
    ...(Array.isArray(DarkmodeComponent.css) ? DarkmodeComponent.css : [DarkmodeComponent.css]),
  ].filter(Boolean) as string[]

  AndyHeader.afterDOMLoaded = [
    ...(Array.isArray(SearchComponent.afterDOMLoaded)
      ? SearchComponent.afterDOMLoaded
      : [SearchComponent.afterDOMLoaded]),
    ...(Array.isArray(DarkmodeComponent.afterDOMLoaded)
      ? DarkmodeComponent.afterDOMLoaded
      : [DarkmodeComponent.afterDOMLoaded]),
  ].filter(Boolean) as string[]

  AndyHeader.beforeDOMLoaded = [
    ...(Array.isArray(SearchComponent.beforeDOMLoaded)
      ? SearchComponent.beforeDOMLoaded
      : [SearchComponent.beforeDOMLoaded]),
    ...(Array.isArray(DarkmodeComponent.beforeDOMLoaded)
      ? DarkmodeComponent.beforeDOMLoaded
      : [DarkmodeComponent.beforeDOMLoaded]),
  ].filter(Boolean) as string[]

  return AndyHeader
}) satisfies QuartzComponentConstructor
