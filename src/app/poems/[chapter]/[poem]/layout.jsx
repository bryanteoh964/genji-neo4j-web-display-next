'use client';

import "../../../../styles/globals.css";
import PoemQuery from "@/components/PoemQuery";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

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