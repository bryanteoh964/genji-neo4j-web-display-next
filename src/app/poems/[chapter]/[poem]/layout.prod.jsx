'use client';

import "../../../../styles/globals.css";
import PoemQuery from "../../../../components/PoemQuery.prod";


const layout = ({ children }) => {
  	return (
		<div>
			<PoemQuery />
			<main>
				{children}
			</main>
		</div>
  	)
}

export default layout