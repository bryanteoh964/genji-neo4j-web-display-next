'use client'

import React from "react";
import { useState }	from "react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

import styles from "../../styles/pages/security.module.css";

const PasswordProtectPage = () => {
	const [password, setPassword] = useState("start");

	const router = useRouter()
	const submitInput = async () => {
		const response = await fetch("/api/password-protect", {
			method: "POST",
			body: JSON.stringify({ password }),
			headers: {
				"Content-Type": "application/json",
			},
		})
		console.log("Response: ", response)
		console.log("Response: ", response.url)
		router.replace(response.url)
	}

	return (
		<div className={styles.container}>
			<div className={styles.screen}>
				<div className={styles.screen_content}>
					<h1 className="text-2xl">This Website is Under Development... </h1>

					<p>Enter Password:</p>
					{/* <form action="/api/password-protect" method="POST"> */}
					<button className="btn" onClick={submitInput}>Login</button>
					<form>
						<div className={styles.form_control}>
							{/* {error && (
								<label className={styles.form_label}>
									<span className="label-text text-error">{error}</span>
								</label>
							)} */}
							<div className={styles.form_inputs}>
								<input
									type="text"
									name="password"
									className="input input-bordered"
									onChange={(e) => setPassword(e.target.value)}
								/>
								<button className="btn" onClick={submitInput}>Login</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
export default PasswordProtectPage;