import { IViewer, Point } from "./types";

/**
 * 小方块
 */
export class Square {
  private _point: Point = { x: 0, y: 0 } // 逻辑坐标
  private _color: string = '' // 颜色
  private _viewer?: IViewer // 显示影藏操作函数

  public get point() {
    return this._point
  }
  public set point(val: Point) {
    this._point = val
    if (this._viewer) {
      this._viewer.show()
    }
  }

  public get color() {
    return this._color
  }
  public set color(val: string) {
    this._color = val
  }

  public get viewer() {
    return this._viewer
  }
  public set viewer(val) {
    this._viewer = val
  }
} 