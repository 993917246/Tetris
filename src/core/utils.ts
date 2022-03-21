
/**
 * 获取随机数 >=min <max
 * @param min 
 * @param max 
 * @returns 
 */
export function getRandom(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}