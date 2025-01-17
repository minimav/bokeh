import {Marking, MarkingView} from "./marking"
import {RendererView} from "../renderers/renderer"
import {Model} from "../../model"
import {View} from "core/view"
import {build_view, IterViews} from "core/build_views"
import * as visuals from "core/visuals"
import * as p from "core/properties"

export class DecorationView extends View {
  declare model: Decoration
  visuals: Decoration.Visuals
  declare readonly parent: RendererView

  marking: MarkingView

  override *children(): IterViews {
    yield* super.children()
    yield this.marking
  }

  override async lazy_initialize(): Promise<void> {
    await super.lazy_initialize()
    this.marking = await build_view(this.model.marking, {parent: this.parent})
  }
}

export namespace Decoration {
  export type Attrs = p.AttrsOf<Props>

  export type Props = Model.Props & {
    marking: p.Property<Marking>
    node: p.Property<"start" | "middle" | "end">
  }

  export type Visuals = visuals.Visuals
}

export interface Decoration extends Decoration.Attrs {}

export class Decoration extends Model {
  declare properties: Decoration.Props
  declare __view_type__: DecorationView

  constructor(attrs?: Partial<Decoration.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = DecorationView

    this.define<Decoration.Props>(({Enum, Ref}) => ({
      marking: [ Ref(Marking) ],
      node: [ Enum("start", "middle", "end") ],
    }))
  }
}
