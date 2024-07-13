'use client'

import React from "react";
import { useState, useEffect }	from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import styles from "../../styles/pages/login.module.css";

const PasswordProtectPage = () => {
	const [password, setPassword] = useState("start");
	const [limiter, setLimiter] = useState(0);
	const [timestamp, setTimestamp] = useState(Date.now());

	const { push } = useRouter()

	const submitInput = async () => {
		// Check limiter value before API call, 10 times a minute
		// variable for setting how many times a limit
		const LIMIT = 10
		if (limiter >= LIMIT) {
			alert('You have exceeded the password rate limit. Please wait.');
			return;
		}

		setLimiter(prevLimiter => prevLimiter + 1);

		const response = await fetch("/api/login", {
			method: "POST",
			body: JSON.stringify({ password }),
			headers: {
				"Content-Type": "application/json",
			},
		})
		push(response.url)
	}

	// useEffect hook to monitor and reset limiter
	useEffect(() => {
		const interval = setInterval(() => {
			if (Date.now() - timestamp >= 60000) { // 60000 ms = 1 minute
				setLimiter(0);
				setTimestamp(Date.now());
			}
		}, 1000); // Check every second

		return () => clearInterval(interval); // Cleanup on component unmount
	}, [timestamp]);

	return (
		<div className={styles.container}>
			<div className={styles.screen}>
				<div className={styles.screen_content}>
					<h1>Welcome to the Tale of Genji Database</h1>
					<div className={styles.screen_bottom}>
						<p>Enter Password to Proceed:</p>
						<div className={styles.form}>
							<input
								type="text"
								name="password"
								className={styles.input_bar}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button className={styles.button} onClick={submitInput}>Login</button>
						</div>
				</div>
					</div>
			</div>
		</div>
	);
};
export default PasswordProtectPage;