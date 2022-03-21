import { Square } from "./Square";
import { Point, RotateDirection, Shape } from "./types";

/** 方块组 */
export class SquareGroup {
  private readonly _squares: Square[] // 方块数组

  constructor(
    private _shape: Shape, //形状，逻辑坐标
    private _centerPoint: Point, // 中心坐标
    private _color: string, //颜色
  ) {
    // 创建方块数组 并定义坐标 颜色
    const arr: Square[] = []
    this._shape.forEach(it => {
      const square = new Square()
      square.color = this._color
      arr.push(square)
    })
    this._squares = arr
    this.setPoint()
  }

  public get squares(): Square[] { // 获取方块数组
    return this._squares
  }

  public get shape(): Shape { // 获取方块组类型
    return this._shape
  }

  public get centerPoint(): Point { // 获取中心坐标
    return this._centerPoint
  }

  public set centerPoint(val: Point) { // 更新坐标
    this._centerPoint = val
    this.setPoint()
  }


  protected _rotateDir :RotateDirection = RotateDirection.clockwise // 旋转方向

  public rotate(): void { // 旋转
    this._shape = this.getRotatePoint()
    this.setPoint()
  }

  public getRotatePoint(): Shape { // 获取旋转后的形状逻辑坐标
    if (this._rotateDir === RotateDirection.clockwise) { // 顺时针
      return this._shape.map(it => {
        return {
          x: -it.y,
          y: it.x
        }
      })
    } else { // 逆时针
      return this._shape.map(it => {
        return {
          x: it.y,
          y: -it.x
        }
      })
    }
  }

  private setPoint() { // 设置所有方块的坐标
    this._squares.forEach((it, index) => {
      this._squares[index].point = {
        x: this._centerPoint.x + this._shape[index].x,
        y: this._centerPoint.y + this._shape[index].y
      }
    })
  }
}