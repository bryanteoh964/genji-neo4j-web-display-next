'use client'

import { usePathname } from 'next/navigation'

const PoemPage = () => {
  const router = usePathname();
  console.log(router)

  // Now you can use `chapter` and `poem` in your component.

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