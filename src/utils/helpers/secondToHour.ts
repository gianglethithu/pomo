export function secondToHour(timestamp: number) {
  const hours = Math.floor(timestamp / 60 / 60)

  const minutes = Math.floor(timestamp / 60) - hours * 60

  const seconds = timestamp % 60

  return (
    (hours > 0 ? hours + ' h ' : '') +
    (minutes > 0 ? minutes + ' min ' : '') +
    (hours === 0 && minutes === 0 ? seconds + ' sec' : '')
  )
}
