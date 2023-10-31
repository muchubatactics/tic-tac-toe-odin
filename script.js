const gameBoard = (function(doc, id){
	let gameArray = ['', '', '', '', '', '', '', '', ''];
	let htmlBoard = doc.querySelector(id);

	const render = function(){
		if ( !"querySelector" in doc) return console.log("error");
		for (let i = 0; i < gameArray.length; i++)
		{
			let div = doc.createElement("div");
			div.setAttribute("data-pos", `${i}`);
			div.innerHTML = '';
			htmlBoard.appendChild(div);
		}
		
	};
	
	const refresh = function (){
		let boardDivs = document.querySelectorAll("#game-board > div");
		for (let i = 0; i < gameArray.length; ++i)
		{
			boardDivs[i].textContent = gameArray[i];
		}
	};

	const checkWin = function(){
		let len = gameArray.filter((x) => x != '').length;
		if (len < 5) return 0;
		else
		{
			if(
				(gameArray[0] == gameArray[1] && gameArray[1] == gameArray[2] && gameArray[2] != '') ||
				(gameArray[3] == gameArray[4] && gameArray[4] == gameArray[5] && gameArray[5] != '') ||
				(gameArray[6] == gameArray[7] && gameArray[7] == gameArray[8] && gameArray[8] != '') ||
				(gameArray[0] == gameArray[3] && gameArray[3] == gameArray[6] && gameArray[6] != '') ||
				(gameArray[1] == gameArray[4] && gameArray[4] == gameArray[7] && gameArray[7] != '') ||
				(gameArray[2] == gameArray[5] && gameArray[5] == gameArray[8] && gameArray[8] != '') ||
				(gameArray[0] == gameArray[4] && gameArray[4] == gameArray[8] && gameArray[8] != '') ||
				(gameArray[2] == gameArray[4] && gameArray[4] == gameArray[6] && gameArray[6] != '') 
			)
			{
				return 1;
			}
			else
			{
				if (len == 9) return 2;
				return 0;
			}
			
		}
	};

	return {
		gameArray,
		render,
		refresh,
		checkWin,
		
	};
})(document, "#game-board");

const player = (function(){
	const listSetup = function(){
		return document.querySelectorAll("#game-board > div");
	};

	return {
		listSetup,
	};
})();

function createPlayer(name)
{
	return {name};
}

const playerX = createPlayer("X");
const playerO = createPlayer("O"); 
Object.setPrototypeOf(playerX, player);
Object.setPrototypeOf(playerO, player);

const game = (function(gameBoard, playerX, playerO){

	let decider = 0;
	let sampleDiv = document.querySelector(".sample");
	let xDiv = document.createElement("div");
	xDiv.classList.add("play-div");
	xDiv.textContent = `Player ${playerX.name}`;
	xDiv.classList.add("emphasis");
	
	
	
	function playHH()
	{
		let oDiv = document.createElement("div");
		oDiv.classList.add("play-div");
		oDiv.textContent = `Player ${playerO.name}`;
		sampleDiv.appendChild(xDiv);
		sampleDiv.appendChild(oDiv);
		gameBoard.render();
		let boardDivs = player.listSetup();
		let current = playerX;

		const eventFtn = function(){
			if (gameBoard.gameArray[Number(this.getAttribute("data-pos"))] != '') return;
			gameBoard.gameArray[Number(this.getAttribute("data-pos"))] = current.name;
			gameBoard.refresh();
			let val = gameBoard.checkWin();
			if (val)
			{
				for(let x of boardDivs)
				{
					x.removeEventListener("click", eventFtn);
				}
				return announceWinner(current, val);
			}
			if (Array.from(xDiv.classList).indexOf("emphasis") != -1)
			{
				xDiv.classList.remove("emphasis");
				oDiv.classList.add("emphasis");
				current = playerO;
			}
			else
			{
				oDiv.classList.remove("emphasis");
				xDiv.classList.add("emphasis");
				current = playerX;
			}
		};

		for (let div of Array.from(boardDivs))
		{
			div.addEventListener("click", eventFtn);
		}

	}

	const playHC = function(){
		let oDiv = document.createElement("div");
		oDiv.classList.add("play-div");
		oDiv.textContent = `Computer`;
		sampleDiv.appendChild(xDiv);
		sampleDiv.appendChild(oDiv);
		gameBoard.render();

		let boardDivs = player.listSetup();
		let current = playerX;
		
		const eventListenOn = function() {
			for (let div of Array.from(boardDivs))
			{
				div.addEventListener("click", eventFtn);
			}
		};
		const eventListenOff = function() {
			for(let x of boardDivs)
			{
				x.removeEventListener("click", eventFtn);
			}
		};
		

		const eventFtn = function(){
			console.log("heh1");
			if (gameBoard.gameArray[Number(this.getAttribute("data-pos"))] != '') return;
			eventListenOff();
			gameBoard.gameArray[Number(this.getAttribute("data-pos"))] = current.name;
			gameBoard.refresh();
			let val = gameBoard.checkWin();
			if (val)
			{
				return announceWinner(current, val);
			}
			console.log("heh2");


			xDiv.classList.remove("emphasis");
			oDiv.classList.add("emphasis");
			current = "computer";
			setTimeout(() => {
			console.log("heh3");

				gameBoard.gameArray[compPlay()] = 'O';
				gameBoard.refresh();

				let val = gameBoard.checkWin();
				if (val)return announceWinner(current, val);

				oDiv.classList.remove("emphasis");
				xDiv.classList.add("emphasis");
				current = playerX;
				eventListenOn();
			}, 500);

		
		};

		eventListenOn();
	};

	const compPlay = function(){
		for(let i = 0; i < gameBoard.gameArray.length; i++)
		{
			if (gameBoard.gameArray[i] == '')
			{
				return i;
			}
		}
	};

	function init()
	{
		let humanButton = document.createElement("button");
		humanButton.classList.add("init-button");
		humanButton.textContent = "Play Against Human";
		let compButton = document.createElement("button");
		compButton.classList.add("init-button");
		compButton.textContent = "Play against Computer"


		humanButton.addEventListener("click", () => {
			decider = 1;
			humanButton.style = "display: none";
			compButton.style = "display: none";
			playHH();
		});
		compButton.addEventListener("click", () => {
			decider = 2;
			humanButton.style = "display: none";
			compButton.style = "display: none";
			playHC();
		});

		sampleDiv.appendChild(humanButton);
		sampleDiv.appendChild(compButton);

	}

	const announceWinner = function(player, val){
		let div = document.createElement("div");
		let body = document.querySelector("body");
		if (val == 2)
		{
			div.textContent = `it's a tie`;	
		}
		else
		{
			if (player == "computer")
			{
				div.textContent = `${player} wins`;	
			}
			else
			{
				div.textContent = `Player ${player.name} wins`;	
			}
		}
		div.classList.add("winner-div");
		body.appendChild(div);

	}; 


	return {
		init,
	};
})(gameBoard, playerX, playerO);

game.init();


// gameBoard.render();





// Set up your project with HTML, CSS and Javascript files and get the Git repo all set up.
// You’re going to store the gameboard as an array inside of a Gameboard object, so start there! Your players are also going to be stored in objects, and you’re probably going to want an object to control the flow of the game itself.
// Your main goal here is to have as little global code as possible. Try tucking everything away inside of a module or factory. Rule of thumb: if you only ever need ONE of something (gameBoard, displayController), use a module. If you need multiples of something (players!), create them with factories.
// Set up your HTML and write a JavaScript function that will render the contents of the gameboard array to the webpage (for now you can just manually fill in the array with "X"s and "O"s)
// Build the functions that allow players to add marks to a specific spot on the board, and then tie it to the DOM, letting players click on the gameboard to place their marker. Don’t forget the logic that keeps players from playing in spots that are already taken!
// Think carefully about where each bit of logic should reside. Each little piece of functionality should be able to fit in the game, player or gameboard objects. Take care to put them in “logical” places. Spending a little time brainstorming here can make your life much easier later!
// If you’re having trouble, Building a house from the inside out is a great article that lays out a highly applicable example of how you might organize your code for this project.
// Build the logic that checks for when the game is over! Should check for 3-in-a-row and a tie.
// Clean up the interface to allow players to put in their names, include a button to start/restart the game and add a display element that congratulates the winning player!
// Optional - If you’re feeling ambitious create an AI so that a player can play against the computer!
// Start by just getting the computer to make a random legal move.
// Once you’ve gotten that, work on making the computer smart. It is possible to create an unbeatable AI using the minimax algorithm (read about it here, some googling will help you out with this one)
// If you get this running definitely come show it off in the chatroom. It’s quite an accomplishment!