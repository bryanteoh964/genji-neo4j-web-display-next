'use client'

import SearchTable from '@/components/SearchTable'

const page = (params) => {
	// validate parameters
	return (
	<div>
		<h1>{params.params.id}</h1>
		<SearchTable 
			tableData={{
				searchType: params.params.id,
			}}
		/>
	</div>
	)
}

export default page