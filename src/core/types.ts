import { game } from "./game";
import { SquareGroup } from "./SquareGroup";

/** 逻辑坐标 */
export interface Point {
  x: number
  y: number
}

/** 显示隐藏回调 */
export interface IViewer {
  show(): void
  hide(): void
}

/** 逻辑坐标数值 */
export type Shape = Point[]

/** 移动的方向 */
export enum MoveDirection {
  up,
  down,
  left,
  right
}

/** 旋转方向 */
export enum RotateDirection {
  clockwise, // 顺时针
  counterclockwise // 逆时针
}


/** 游戏状态 */
export enum GameStatus {
  init, // 未开始
  playing, // 游戏中
  pause, // 暂停
  over, // 游戏结束
}

export interface GamePageViewer {
  showNext(shape: SquareGroup): void; // 显示下一个操作的方块
  switch(shape: SquareGroup): void; // 切换显示的方块
  init(game: game): void; // 初始化游戏界面
  setScore(game: game): void; // 设置分数
}