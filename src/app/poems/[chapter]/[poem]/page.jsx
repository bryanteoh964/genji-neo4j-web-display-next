'use client'

import { usePathname,  useSearchParams} from 'next/navigation'
import {useRouter} from 'next/navigation'
const PoemPage = (params) => {
  //const router = usePathname();

  
  
  let chapter = params.params.chapter
  let poem = params.params.poem
  

  return (
    <div>
      <h1>Chapter: {chapter}</h1>
      <h2>Poem: {poem}</h2>
    </div>
  )
}

export default PoemPage






/* 

*/