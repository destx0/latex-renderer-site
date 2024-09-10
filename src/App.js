import React, { useState, useEffect, useRef } from "react";
import LatexRenderer from "./LatexRenderer";

const App = () => {
	const [inputText, setInputText] = useState("");
	const textareaRef = useRef(null);
	const renderedRef = useRef(null);

	// Load saved text from localStorage when component mounts
	useEffect(() => {
		const savedText = localStorage.getItem("latexInput");
		if (savedText) {
			setInputText(savedText);
		}
	}, []);

	// Save the text to localStorage when inputText changes
	useEffect(() => {
		localStorage.setItem("latexInput", inputText);
	}, [inputText]);

	// Handle file upload
	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setInputText(e.target.result);
			};
			reader.readAsText(file);
		}
	};

	// Synchronize scrolling between textarea and rendered output
	const syncScroll = () => {
		const textarea = textareaRef.current;
		const renderedOutput = renderedRef.current;

		// Calculate the scroll percentage of the textarea
		const scrollPercentage =
			textarea.scrollTop /
			(textarea.scrollHeight - textarea.clientHeight);

		// Apply the same scroll percentage to the rendered output
		renderedOutput.scrollTop =
			scrollPercentage *
			(renderedOutput.scrollHeight - renderedOutput.clientHeight);
	};

	return (
		<div style={{ display: "flex", height: "100vh" }}>
			{/* Left side: Text input */}
			<div
				style={{
					flex: 1,
					padding: "20px",
					borderRight: "1px solid #ccc",
				}}
			>
				<h2>LaTeX Input</h2>
				<textarea
					ref={textareaRef}
					value={inputText}
					onChange={(e) => setInputText(e.target.value)} // Update input text
					onScroll={syncScroll} // Sync scroll between the two sides
					style={{
						width: "100%",
						height: "90%",
						fontSize: "16px",
						overflowY: "auto",
					}}
				/>
				<input type="file" onChange={handleFileUpload} />
			</div>

			{/* Right side: Rendered LaTeX */}
			<div style={{ flex: 1, padding: "20px" }}>
				<h2>Rendered Output</h2>
				<div
					ref={renderedRef}
					style={{
						border: "1px solid #ccc",
						padding: "20px",
						height: "90%",
						overflowY: "auto",
					}}
				>
					<LatexRenderer>{inputText}</LatexRenderer>
				</div>
			</div>
		</div>
	);
};

export default App;
