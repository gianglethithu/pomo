import { CollectionReference, DocumentData, getDocs } from 'firebase/firestore'
import * as React from 'react'

function useGetCollectionFirebase<T>(collectionRef: CollectionReference<DocumentData>) {
  const [collection, setCollection] = React.useState<T[]>([])

  React.useEffect(() => {
    async function getCollection() {
      const snapshot = await getDocs(collectionRef)
      const collection: T[] = []
      snapshot.forEach(doc => collection.push(doc.data() as T))
      setCollection(collection) // firebase always put the newest document first so don't need to reverse
    }
    getCollection()
  }, [collectionRef])

  return [collection, setCollection] as const
}

export { useGetCollectionFirebase }
