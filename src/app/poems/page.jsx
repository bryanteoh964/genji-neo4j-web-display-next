'use client';

import "../../styles/globals.css";
import PoemQuery from "@/components/PoemQuery";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const page = () => {
  return (
	<div>
		<PoemQuery />
		<section className="section_frame">
		<div className="styles.section_container">
			<h1>Welcome to the Poem Page</h1>
		</div>
		</section>
	</div>
  )
}

export default page