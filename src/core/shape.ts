import { SquareGroup } from "./SquareGroup";
import { Point, RotateDirection } from "./types";
import { getRandom } from "./utils";

/**
 * □
 * □
 * □ □
 */
export class LShape extends SquareGroup {
  constructor(_centerPoint: Point, _color: string) {
    const shape: Point[] = [{ x: 0, y: -2 }, { x: 0, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 0 }]
    super(shape, _centerPoint, _color)
  }
}

/**
 * □ □ □
 *   □
 */
export class TShape extends SquareGroup {
  constructor(_centerPoint: Point, _color: string) {
    const shape: Point[] = [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }]
    super(shape, _centerPoint, _color)
  }
}

/**
 * □ □ □ □
 */
export class IShape extends SquareGroup {
  constructor(_centerPoint: Point, _color: string) {
    const shape: Point[] = [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }]
    super(shape, _centerPoint, _color)
  }
  rotate() {
    super.rotate()
    this._rotateDir = this._rotateDir === RotateDirection.clockwise ? RotateDirection.counterclockwise : RotateDirection.clockwise
  }
}

/**
 * □ □
 * □ □
 */
export class KShape extends SquareGroup {
  constructor(_centerPoint: Point, _color: string) {
    const shape: Point[] = [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 0 }]
    super(shape, _centerPoint, _color)
  }

  // 不进行旋转
  rotate() { }
}


export const shapeList = [LShape, TShape, IShape, KShape]

/** 随机创建一个方块组 */
export function createSquareGroup(centerPoint: Point) {
  const color = `rgb(${getRandom(0, 256)},${getRandom(0, 256)},${getRandom(0, 256)})`
  const shape = shapeList[getRandom(0, shapeList.length)]
  return new shape(centerPoint, color)
}

