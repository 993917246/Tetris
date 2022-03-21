import options from "../options";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { MoveDirection, Point, Shape } from "./types";

export class shapeRule {
  /**
   * 方块组是否能够移动到目标位置
   * @param shape 
   * @param targetCenter 
   * @returns true 可移动 false 不可移动
   */
  static canIMove(shape: Shape, targetCenter: Point, squares: Square[]): boolean {
    // 获取方块组移动到目标位置的坐标
    const points = shape.map(it => {
      return {
        x: it.x + targetCenter.x,
        y: it.y + targetCenter.y
      }
    })

    // 判断坐标是否超出边界
    let cantMove = points.some(it => {
      if (it.x < 0 || it.x > options.container_size.width - 1) return true
      if (it.y < 0 || it.y > options.container_size.height - 1) return true
    })

    if (cantMove) return false

    // 判断坐标是否与原有方块重叠
    cantMove = points.some(it => squares.some(item => item.point.x === it.x && item.point.y === it.y))
    if (cantMove) return false

    return true
  }

  /**
   * 方块组移动到目标位置
   * @param instance 实例
   * @param targetCenter 目标位置
   */
  static move(instance: SquareGroup, targetCenter: Point, squares: Square[]): boolean;
  /**
   * 方块组朝某个方向移动一格
   * @param instance 实例
   * @param direction 方向
   */
  static move(instance: SquareGroup, direction: MoveDirection, squares: Square[]): boolean;
  static move(instance: SquareGroup, targetPointOrDirection: MoveDirection | Point, squares: Square[]): boolean {
    if (isPoint(targetPointOrDirection)) { // 是个坐标
      const canMove = this.canIMove(instance.shape, targetPointOrDirection, squares)
      if (canMove) {
        instance.centerPoint = targetPointOrDirection
        return true
      }
      return false
    } else { // 是个方向
      let targetPoint: Point = getDirectionPoint(instance.centerPoint, targetPointOrDirection)
      const canMove = this.canIMove(instance.shape, targetPoint, squares)
      if (canMove) {
        instance.centerPoint = targetPoint
        return true
      }
      return false
    }
  }

  /**
   * 方块组移动到方向底部
   * @param instance 实例
   * @param direction 方向
   */
  static move2End(instance: SquareGroup, direction: MoveDirection, squares: Square[]): void {
    // while (this.move(instance, direction,squares)) { }

    if (this.move(instance, direction, squares)) {
      this.move2End(instance, direction, squares)
    }
  }


  /**
   * 方块是否能旋转
   * 能则旋转  不能则退出
   * @param instance 
   */
  static rotate(instance: SquareGroup, squares: Square[]) {
    const newShape = instance.getRotatePoint() // 获取旋转后的形状

    if (this.canIMove(newShape, instance.centerPoint, squares)) {
      instance.rotate()
      return true
    }
    return false
  }

  /**
   * 消除方块
   * @param squares 小方块数组
   */
  static deleteSquares(squares: Square[]) {
    // 所有方块的Y轴
    const ys = squares.map(it => it.point.y)
    // 最大Y轴
    const maxY = Math.max(...ys)
    // 最小Y轴
    const minY = Math.min(...ys)
    //消除的数量
    let num = 0

    for (let i = minY; i <= maxY; i++) {
      if (this.delLine(squares, i)) num++
    }
    return num
  }
  /**
   * 判断是否满足消除条件，消除，并将上方其余方块下移一格
   * @param squares 现有小方块组
   * @param line 判断消除的行数
   * @returns 
   */
  private static delLine(squares: Square[], line: number): boolean {
    const lineSquare = squares.filter(it => it.point.y === line)
    if (lineSquare.length === options.container_size.width) {
      lineSquare.forEach(it => {
        if (it.viewer) it.viewer.hide()
        const index = squares.findIndex(square => square === it)
        squares.splice(index, 1)
      })
      // 老师写的有错误不能放在上面的forEach循环中，不然所有的方块会一直移动到一行去
      squares.forEach(it => {
        if (it.point.y < line) {
          it.point = {
            x: it.point.x,
            y: it.point.y + 1
          }
        }
      })
      return true
    } else {
      return false
    }
  }

}

/** 判断是否是个坐标 */
function isPoint(obj: any): obj is Point {
  return obj.x && obj.y
}

/** 获取坐标向某个方向移动一格之后的坐标 */
function getDirectionPoint(point: Point, direction: MoveDirection): Point {
  let targetPoint: Point
  if (direction === MoveDirection.down) {
    targetPoint = {
      x: point.x,
      y: point.y + 1
    }
  } else if (direction === MoveDirection.up) {
    targetPoint = {
      x: point.x,
      y: point.y - 1
    }
  } else if (direction === MoveDirection.left) {
    targetPoint = {
      x: point.x - 1,
      y: point.y
    }
  } else {
    targetPoint = {
      x: point.x + 1,
      y: point.y
    }
  }
  return targetPoint
}