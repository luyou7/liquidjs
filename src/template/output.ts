import { Value } from './value'
import { TemplateImpl } from '../template/template-impl'
import { Template } from '../template/template'
import { Context } from '../context/context'
import { Emitter } from '../emitters/emitter'
import { OutputToken } from '../tokens/output-token'
import { Liquid } from '../liquid'
import { Filter } from './filter/filter'

export class Output extends TemplateImpl<OutputToken> implements Template {
  private value: Value
  public constructor (token: OutputToken, liquid: Liquid) {
    super(token)
    this.value = new Value(token.content, liquid)
    const filters = this.value.filters
    const outputEscape = liquid.options.outputEscape
    if (filters.length && filters[filters.length - 1].name === 'raw') {
      filters.pop()
    } else if (outputEscape) {
      filters.push(new Filter(toString.call(outputEscape), outputEscape, [], liquid))
    }
  }
  public * render (ctx: Context, emitter: Emitter): IterableIterator<unknown> {
    const val = yield this.value.value(ctx, false)
    emitter.write(val)
  }
}
