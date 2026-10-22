import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/stackedNotes.inline"
import style from "./styles/stackedNotes.scss"

export default (() => {
  const StackedNotes: QuartzComponent = (_props: QuartzComponentProps) => {
    return null
  }

  StackedNotes.afterDOMLoaded = script
  StackedNotes.css = style

  return StackedNotes
}) satisfies QuartzComponentConstructor
