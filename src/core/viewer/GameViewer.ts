import { SquareGroup } from '../SquareGroup';
import { GamePageViewer, GameStatus } from '../types'
import { SquareViewer } from './SquareViewer';
import $ from 'jquery'
import { game } from '../game';
import options from '../../options';

export class GameViewer implements GamePageViewer {
  private nextDom: JQuery<HTMLElement> = $('#next')
  private gameDom: JQuery<HTMLElement> = $('#content')
  private fenshuDom: JQuery<HTMLElement> = $('.fenshu')

  // 显示下一个操作方块
  showNext(shape: SquareGroup): void {
    shape.squares.forEach(it => {
      it.viewer = new SquareViewer(it, this.nextDom)
      it.viewer.show()
    })
  }

  // 切换操作方块
  switch(shape: SquareGroup): void {
    shape.squares.forEach(it => {
      it.viewer?.hide()
      it.viewer = new SquareViewer(it, this.gameDom)
      it.viewer.show()
    })
  }

  // 初始化游戏界面，事件
  init(game: game) {
    //初始化界面
    this.nextDom.css({
      width: options.next_container_size.width * options.square_size.width,
      height: options.next_container_size.height * options.square_size.height
    })
    this.gameDom.css({
      width: options.container_size.width * options.square_size.width,
      height: options.container_size.height * options.square_size.height
    })

    // 初始化事件
    window.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowUp':
          game.controlRotate()
          break;
        case 'ArrowDown':
          game.controlDown()
          break;
        case 'ArrowLeft':
          game.controlLeft()
          break;
        case 'ArrowRight':
          game.controlRight()
          break;
        case ' ':
          if (game.status === GameStatus.playing) {
            game.pause()
          } else {
            game.start()
          }
      }
    })


  }

  // 设置分数
  setScore(game: game) {
    this.fenshuDom.text(game.score)
  }

}