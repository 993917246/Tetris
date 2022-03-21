export default {
  // 小方块大小
  square_size: {
    width: 30,
    height: 30
  },
  // 容器的逻辑宽高，根据小方块大小来算容器大小
  container_size: {
    width: 12,
    height: 20
  },
  // 下一个方块的容器
  next_container_size: {
    width: 7,
    height: 6
  },
  level: [
    { score: 0, time: 1500 },
    { score: 6, time: 1300 },
    { score: 12, time: 1100 },
    { score: 18, time: 900 },
    { score: 24, time: 700 },
    { score: 30, time: 500 },
  ]
}