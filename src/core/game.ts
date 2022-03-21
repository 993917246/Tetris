import { SquareGroup } from "./SquareGroup";
import { GamePageViewer, GameStatus, MoveDirection } from "./types";
import { createSquareGroup } from './shape'
import { shapeRule } from "./shapeRule";
import GameConfig from '../options'
import { Square } from "./Square";
import options from "../options";


export class game {
  // 游戏状态默认初始化
  private _gameStatus: GameStatus = GameStatus.init;
  // 当前玩家操作的方块
  private _curShape?: SquareGroup;
  // 下一个操作的方块
  private _nextShape: SquareGroup = createSquareGroup({ x: 0, y: 0 });
  // 计时器
  private _timer?: number;
  // 下落时间/游戏难度
  private _duration: number = options.level[0].time;
  // 显示器
  private _viewer: GamePageViewer;
  // 存在的所有方块
  private _squares: Square[] = [];
  // 分数
  private _score: number = 0;

  constructor(_viewer: GamePageViewer) {
    this._viewer = _viewer
    this._viewer.init(this)
    this._viewer.setScore(this)
    this.switchNext()
  }

  // 获取游戏状态
  get status() {
    return this._gameStatus
  }
  // 获取游戏分数
  get score() {
    return this._score
  }
  // 设置分数
  private set score(val) {
    this._score = val
    this._viewer.setScore(this)
    const level = options.level.filter(it => it.score <= this.score).pop()!
    console.log(level);
    if (level.time !== this._duration) {
      this._duration = level.time
      clearInterval(this._timer)
      this._timer = undefined;
      this.autoDrop()
    }
  }

  /**
   * 开始游戏
   */
  start() {
    // 正在游戏中直接返回
    if (this._gameStatus === GameStatus.playing) return
    //初始化
    if (this._gameStatus === GameStatus.over) {
      this.init()
    }
    // 游戏状态改变
    this._gameStatus = GameStatus.playing
    // 将下一个方块转换为当前方块
    if (!this._curShape) {
      this.switchShape()
    }
    // 方块开始自由下落
    this.autoDrop()
  }

  // 初始化
  private init() {
    // 清空当前操作方块
    this._curShape?.squares.forEach(it => it.viewer?.hide && it.viewer.hide())
    this._curShape = undefined
    // 清空下一个方块
    this._nextShape.squares.forEach(it => it.viewer?.hide && it.viewer.hide())
    // 清空现有方块
    this._squares.forEach(it => it.viewer?.hide && it.viewer.hide())
    this._squares = []
    // 清空分数
    this.score = 0
    this._viewer.setScore(this)
    // 切换显示下一个操作方块
    this.switchNext()
  }

  /**
   * 切换方块
   * 将下一个操作方块转成当前操作方块
   * 创建新的下一个操作方块
   */
  private switchShape() {
    this._curShape = this._nextShape;
    this.reSetContentPoint(GameConfig.container_size.width, this._curShape)
    // 切换完成之后判断游戏是否结束
    const canMove = shapeRule.canIMove(this._curShape.shape, this._curShape.centerPoint, this._squares)
    if (!canMove) {
      this._timer && clearInterval(this._timer)
      this._timer = undefined
      this._gameStatus = GameStatus.over
    }
    this.switchNext()
    this._viewer.switch(this._curShape)
  }

  /**
   * 方块开始下落运动
   */
  private autoDrop() {
    if (this._timer || this._gameStatus !== GameStatus.playing) return
    this._timer = window.setInterval(() => {
      if (this._curShape) {
        if (!shapeRule.move(this._curShape, MoveDirection.down, this._squares)) {
          this.hitBottom()
        }
      }
    }, this._duration)
  }

  /**
   * 暂停游戏
   */
  pause() {
    if (this._gameStatus !== GameStatus.playing) return
    this._gameStatus = GameStatus.pause
    this._timer && clearInterval(this._timer)
    this._timer = undefined
  }

  /**
   * 触底切换
   */
  private hitBottom() {
    this._squares.push(...this._curShape!.squares)
    // 消除判断 计算分数
    const num = shapeRule.deleteSquares(this._squares)
    if (num) this.score += 3 ** num
    this._viewer.setScore(this)
    this.switchShape()  // 切换操作方块
  }

  controlLeft() {
    if (this._curShape && this._gameStatus === GameStatus.playing) {
      shapeRule.move(this._curShape, MoveDirection.left, this._squares)
    }
  }

  controlRight() {
    if (this._curShape && this._gameStatus === GameStatus.playing) {
      shapeRule.move(this._curShape, MoveDirection.right, this._squares)
    }
  }

  controlDown() {
    if (this._curShape && this._gameStatus === GameStatus.playing) {
      shapeRule.move2End(this._curShape, MoveDirection.down, this._squares)
      this.hitBottom()
    }
  }
  controlRotate() {
    if (this._curShape && this._gameStatus === GameStatus.playing) {
      shapeRule.rotate(this._curShape, this._squares)
    }
  }



  /**
   * 设置中心坐标到容器的中间上方
   * @param width 逻辑宽度
   * @param shape 方块实例
   */
  private reSetContentPoint(width: number, shape: SquareGroup) {
    const x = Math.floor(width / 2)
    const y = 0
    shape.centerPoint = { x, y }
    while (shape.squares.some(it => it.point.y < 0)) {
      shape.centerPoint = {
        x: shape.centerPoint.x,
        y: shape.centerPoint.y + 1
      }
    }
  }

  /**
   * 生成下一个方块并显示
   */
  private switchNext() {
    this._nextShape = createSquareGroup({ x: 0, y: 0 })
    this.reSetContentPoint(GameConfig.next_container_size.width, this._nextShape)
    this._viewer.showNext(this._nextShape)
  }

}