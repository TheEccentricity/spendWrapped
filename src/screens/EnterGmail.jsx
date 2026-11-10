import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { ArrowIcon, LockIcon } from "../components/icons.jsx";
import { googleAuth } from "../utils/googleAuth.ts";
import { PLATFORMS, DEFAULT_KEYWORD } from "../api/breakdown.js";

export default function EnterGmail({ onAuthCode }) {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	// Which platform's receipts to scan. Starts empty so the user must choose.
	const [keyword, setKeyword] = useState("");

	useEffect(() => {
		const code = searchParams.get("code");
		if (code) {
			const chosen = searchParams.get("state") || DEFAULT_KEYWORD;
			onAuthCode(code, chosen);
			navigate("/loading", { replace: true });
		}
	}, [searchParams, onAuthCode, navigate]);

	// "Get Started" opens the Google auth page for the selected platform.
	// Do nothing until a platform is picked.
	function handleGetStarted() {
		if (!keyword) return;
		googleAuth(keyword);
	}

	return (
		<main className="page page--enter">
			<Header />

			<div className="enter__layout">
				<div className="enter__intro">
					<p className="eyebrow">2026 · YEAR TO DATE</p>
					<h1 className="enter__title">What did that app really cost you?</h1>
					<p className="body">
						Connect your inbox and we'll tally every receipt from this year, then
						show you the damage month by month.
					</p>
				</div>

				<div className="enter__form">
					<div className="field enter__field">
						<label className="field__label" htmlFor="platform">
							Platform to look for
						</label>
						<select
							id="platform"
							className={`input select ${keyword ? "" : "select--placeholder"}`}
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
						>
							<option value="">Select an option</option>
							{PLATFORMS.map((platform) => (
								<option key={platform.keyword} value={platform.keyword}>
									{platform.label}
								</option>
							))}
						</select>
					</div>

					<button
						type="button"
						className="btn btn--primary enter__cta"
						onClick={handleGetStarted}
						disabled={!keyword}
					>
						Get Started
						<ArrowIcon className="btn__arrow" />
					</button>

					<p className="footnote">
						<LockIcon className="footnote__icon" />
						Read-only access. Only receipt emails are scanned.
					</p>
				</div>
			</div>

			<footer className="enter__footer">
				<Link to="/privacy">Privacy Policy</Link>
				<span aria-hidden="true"> · </span>
				<Link to="/terms">Terms of Service</Link>
				<p className="enter__copyright">
					© {new Date().getFullYear()}{" "}
					<a
						href="https://theeccentricity.github.io"
						target="_blank"
						rel="noopener noreferrer"
					>
						TheEccentricity
					</a>
					. All rights reserved.
				</p>
			</footer>
		</main>
	);
}
