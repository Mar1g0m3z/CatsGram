initializePage = document.addEventListener("DOMContentLoaded", function () {
	const container = document.getElementById("container");
	const heartEl = document.querySelector(".bi-heart-fill");
	const thumbsDownEl = document.querySelector(".bi-hand-thumbs-down-fill");
	const likesCounter = document.getElementById("likes-counter");
	const commentInput = document.querySelector("input.comment");
	const commentList = document.querySelector("ul#comment-list");
	const commentIcon = document.querySelector("li.comment-btn");
	const commentSection = document.querySelector("section.comments");

	function displayCatImageFromStorage() {
		const storedCatImage = sessionStorage.getItem("saved_cat_image");
		if (storedCatImage) {
			container.style.backgroundImage = `url(${storedCatImage})`;
		}
	}

	function saveCatImageToStorage(imageUrl) {
		sessionStorage.setItem("saved_cat_image", imageUrl);
	}

	function clearCatImageFromStorage() {
		sessionStorage.removeItem("saved_cat_image");
	}

	function setRandomImageAsBackground() {
		fetch("https://api.thecatapi.com/v1/images/search")
			.then((response) => response.json())
			.then((data) => {
				const imageUrl = data[0].url;
				container.style.backgroundImage = `url(${imageUrl})`;
				container.style.backgroundSize = "cover";
				container.style.backgroundRepeat = "no-repeat";
				container.style.backgroundPosition = "center";

				resetIcons();
				resetLikesCounter();
				resetCommentBox();
				clearCommentsFromStorage();
				saveCatImageToStorage(imageUrl);
				let randomNum = Math.floor(Math.random() * 10000);
				if (!isNaN(parseInt(likesCounter.textContent))) {
					randomNum = parseInt(likesCounter.textContent);
				}

				saveRandomNumberToStorage(randomNum); // Save current likes count
				likesCounter.textContent = randomNum;
			})
			.catch((error) => {
				console.error("Error fetching image:", error);
			});
	}

	displayCatImageFromStorage();

	function resetCommentBox() {
		commentInput.value = "";
		commentList.innerHTML = "";
	}

	function getRandomColor() {
		const letters = "0123456789ABCDEF";
		let color = "#";
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	const usernames = [
		"User123",
		"CatLover22",
		"MeowMaster",
		"PurrfectCat",
		"WhiskerWatcher",
	];

	function displayCommentsFromStorage() {
		const storedComments = sessionStorage.getItem("saved_comments");
		if (storedComments) {
			const comments = JSON.parse(storedComments);
			comments.forEach((commentObj) => {
				const newComment = document.createElement("li");
				newComment.textContent = commentObj.comment;
				newComment.style.color = commentObj.color;
				commentList.appendChild(newComment);
			});
		}
	}

	function saveCommentToStorage(commentText, color) {
		let storedComments = sessionStorage.getItem("saved_comments");
		if (!storedComments) {
			storedComments = JSON.stringify([{ comment: commentText, color: color }]);
		} else {
			const comments = JSON.parse(storedComments);
			comments.push({ comment: commentText, color: color });
			storedComments = JSON.stringify(comments);
		}
		sessionStorage.setItem("saved_comments", storedComments);
	}

	function clearCommentsFromStorage() {
		sessionStorage.removeItem("saved_comments");
	}

	displayCommentsFromStorage();

	function addComment(event) {
		const commentText = commentInput.value.trim();
		if (event.key === "Enter" && commentText !== "") {
			const randomUsername =
				usernames[Math.floor(Math.random() * usernames.length)];
			const randomColor = getRandomColor();
			const formattedComment = `${randomUsername}: ${commentText}`;
			const newComment = document.createElement("li");
			newComment.textContent = formattedComment;
			newComment.style.color = randomColor;
			commentList.appendChild(newComment);
			commentInput.value = "";

			saveCommentToStorage(formattedComment, randomColor);
		}
	}

	function resetIcons() {
		document.querySelector(".heart").classList.remove("pulse-heart");
		heartEl.classList.remove("pulse-heart");
		document.querySelector(".thumbs-down").classList.remove("pulse-thumb");
		thumbsDownEl.classList.remove("pulse-thumb");
	}

	function resetLikesCounter() {
		likesCounter.textContent = Math.floor(Math.random() * 10000);
	}

	function heartToggle() {
		document.querySelector(".heart").classList.toggle("pulse-heart");
	}

	function thumbToggle() {
		document.querySelector(".thumbs-down").classList.toggle("pulse-thumb");
	}

	function heartClickHandler() {
		const currentLikes = parseInt(likesCounter.textContent);
		if (!heartEl.classList.contains("pulse-heart")) {
			likesCounter.textContent = currentLikes + 1;
			heartEl.classList.add("pulse-heart");
			heartToggle();
			document.querySelector(".thumbs-down").classList.remove("pulse-thumb");
			thumbsDownEl.classList.remove("pulse-thumb");
		} else {
			likesCounter.textContent = currentLikes - 1;
			resetIcons();
		}
		saveButtonStatesToStorage();
		saveRandomNumberToStorage(likesCounter.textContent); // Save current likes count
	}

	function thumbsDownClickHandler() {
		const currentLikes = parseInt(likesCounter.textContent);
		if (!thumbsDownEl.classList.contains("pulse-thumb")) {
			likesCounter.textContent = currentLikes - 1;
			thumbsDownEl.classList.add("pulse-thumb");
			thumbToggle();
			document.querySelector(".heart").classList.remove("pulse-heart");
			heartEl.classList.remove("pulse-heart");
		} else {
			likesCounter.textContent = currentLikes + 1;
			resetIcons();
		}
		saveButtonStatesToStorage();
		saveRandomNumberToStorage(likesCounter.textContent); // Save current likes count
	}

	function scrollToComments() {
		commentSection.scrollIntoView({ behavior: "smooth" });
	}

	function applyButtonStatesFromStorage() {
		const savedHeartState = sessionStorage.getItem("saved_heart_state");
		if (savedHeartState === "true") {
			heartEl.classList.add("pulse-heart");
		}

		const savedThumbState = sessionStorage.getItem("saved_thumb_state");
		if (savedThumbState === "true") {
			thumbsDownEl.classList.add("pulse-thumb");
		}
	}

	function saveButtonStatesToStorage() {
		const heartState = heartEl.classList.contains("pulse-heart")
			? "true"
			: "false";
		const thumbState = thumbsDownEl.classList.contains("pulse-thumb")
			? "true"
			: "false";

		sessionStorage.setItem("saved_heart_state", heartState);
		sessionStorage.setItem("saved_thumb_state", thumbState);
	}

	function saveRandomNumberToStorage(randomNumber) {
		sessionStorage.setItem("saved_random_number", randomNumber);
	}

	function applyRandomNumberFromStorage() {
		const savedRandomNumber = sessionStorage.getItem("saved_random_number");
		if (savedRandomNumber) {
			likesCounter.textContent = savedRandomNumber;
		} else {
			const newRandomNumber = Math.floor(Math.random() * 10000);
			saveRandomNumberToStorage(newRandomNumber);
			likesCounter.textContent = newRandomNumber;
		}
	}

	applyButtonStatesFromStorage();
	applyRandomNumberFromStorage();

	const addCatButton = document.getElementById("add");

	addCatButton.addEventListener("click", setRandomImageAsBackground);
	commentInput.addEventListener("keypress", addComment);
	commentIcon.addEventListener("click", scrollToComments);
	heartEl.addEventListener("click", heartClickHandler);
	thumbsDownEl.addEventListener("click", thumbsDownClickHandler);
});

window.addEventListener("DOMContentLoaded", initializePage);
