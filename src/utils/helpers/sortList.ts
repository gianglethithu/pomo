import { TItem, TSortOption } from '../../types'

function sortList<T extends TItem>(list: T[], sortType: TSortOption) {
  const listCopy = [...list]
  switch (sortType) {
    case 'A to Z':
      return listCopy.sort((t1, t2) => {
        if (t1.name.toLowerCase() < t2.name.toLowerCase()) return -1
        if (t1.name.toLowerCase() > t2.name.toLowerCase()) return 1
        return 0
      })

    case 'Z to A':
      return listCopy.sort((t1, t2) => {
        if (t1.name.toLowerCase() < t2.name.toLowerCase()) return 1
        if (t1.name.toLowerCase() > t2.name.toLowerCase()) return -1
        return 0
      })

    case 'Newest first':
      return listCopy.sort((t1, t2) => t2.date.seconds - t1.date.seconds)

    case 'Oldest first':
      return listCopy.sort((t1, t2) => t1.date.seconds - t2.date.seconds)

    case 'Color':
      return listCopy.sort((t1, t2) => {
        if (t1.color < t2.color) return -1
        if (t1.color > t2.color) return 1
        return 0
      })
  }
}

export { sortList }
