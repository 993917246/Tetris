import { Square } from "../Square";
import options from '../../options'
import { IViewer } from "../types";
import $ from 'jquery'

/** 小方块显示器 */
export class SquareViewer implements IViewer {

  private dom?: JQuery<HTMLElement> // 显示容器实例
  private isRemove: boolean = false // 是否移除显示

  constructor(
    public square: Square,
    public container: JQuery<HTMLElement>
  ) { }

  show(): void {
    if (this.isRemove) return
    if (!this.dom) {
      this.dom = $('<div>').css({
        position: 'absolute',
        width: options.square_size.width,
        height: options.square_size.height,
        backgroundColor: this.square.color,
        border: '1px solid black',
        boxSizing: 'border-box'
      }).appendTo(this.container)
    }
    this.dom.css({
      left: this.square.point.x * options.square_size.width,
      top: this.square.point.y * options.square_size.height
    })
  }

  hide(): void {
    if (this.dom?.remove) {
      this.dom.remove()
    }
    this.isRemove = true
  }
}