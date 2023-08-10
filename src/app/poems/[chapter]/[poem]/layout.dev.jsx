'use client';

import "../../../../styles/globals.css";
import PoemQuery from "@/components/PoemQuery.dev";

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