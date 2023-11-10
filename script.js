const gameBoard = (function(doc, id){
	let gameArray = ['', '', '', '', '', '', '', '', ''];
	let htmlBoard = doc.querySelector(id);

	const render = function(){
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

	const clear = function(){
		for (let i = 0; i < gameArray.length; i++)
		{
			gameArray[i] = '';
		}
	};

	const checkWin = function(gameArray){
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
		clear,
		
	};
})(document, "#game-board");

const player = (function(){
	let playerName;
	const listSetup = function(){
		return document.querySelectorAll("#game-board > div");
	};

	return {
		listSetup,
		playerName,
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

	let decider;
	let sampleDiv = document.querySelector(".sample");
	let xDiv = document.createElement("div");
	let oDiv = document.createElement("div");
	xDiv.classList.add("play-div");
	xDiv.classList.add("emphasis");
	let current;

	function createButtons()
	{
		let container = document.querySelector(".bttns");
		let rstButton = document.createElement("button");
		rstButton.textContent = "restart";
		rstButton.addEventListener("click", () => {
	
			let win = document.querySelector(".announce");
			if (win.textContent || decider == 3)
			{
				if (win) win.textContent = '';
				xDiv.remove();
				oDiv.remove();

				let divs = document.querySelectorAll("#game-board > div");
				for (let div of divs)
				{
					div.remove();
				}

				xDiv.classList.remove("emphasis");
				oDiv.classList.remove("emphasis");
				xDiv.classList.add("emphasis");
				gameBoard.clear();
				
				if (decider == 1)
				{
					playHH();
				}
				else 
				{					
					if (decider == 3)playHC2();
					else playHC();
				}
			}
			else
			{
				gameBoard.clear();
				gameBoard.refresh();
				current = playerX;
				xDiv.classList.remove("emphasis");
				oDiv.classList.remove("emphasis");
				xDiv.classList.add("emphasis");
			}

		});

		container.appendChild(rstButton);
	}
		
	function playHH()
	{

		if (playerX.playerName != '') xDiv.textContent = `Player ${playerX.playerName}`;
		else xDiv.textContent = `Player ${playerX.name}`;
		oDiv.classList.add("play-div");
		if (playerO.playerName != '') oDiv.textContent = `Player ${playerO.playerName}`;
		else oDiv.textContent = `Player ${playerO.name}`;
		sampleDiv.appendChild(xDiv);
		sampleDiv.appendChild(oDiv);
		gameBoard.render();
		gameBoard.refresh();


		let boardDivs = player.listSetup();
		current = playerX;

		const eventFtn = function(){
			if (gameBoard.gameArray[Number(this.getAttribute("data-pos"))] != '') return;
			gameBoard.gameArray[Number(this.getAttribute("data-pos"))] = current.name;
			gameBoard.refresh();
			let val = gameBoard.checkWin(gameBoard.gameArray);
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

		for (let div of boardDivs)
		{
			div.addEventListener("click", eventFtn);
		}

	}

	const playHC2 = function(){

		decider = 3;

		const eventListenOn = function() {
			for (let div of boardDivs)
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
		
		if (playerO.playerName != '') oDiv.textContent = `Player ${playerO.playerName}`;
		else oDiv.textContent = `Player ${playerO.name}`;
		oDiv.classList.add("play-div");
		xDiv.textContent = `Computer`;
		sampleDiv.appendChild(xDiv);
		sampleDiv.appendChild(oDiv);
		gameBoard.render();
		gameBoard.refresh();


		let boardDivs = player.listSetup();
		current = "computer";

		setTimeout(() => {

			// gameBoard.gameArray[compPlay()] = playerX.name;
			gameBoard.gameArray[unbeatable(playerX.name)] = playerX.name;

			gameBoard.refresh();

			let val = gameBoard.checkWin(gameBoard.gameArray);
			if (val)return announceWinner(current, val);

			xDiv.classList.remove("emphasis");
			oDiv.classList.add("emphasis");
			current = playerO;
			eventListenOn();
		}, 500);
		

		const eventFtn = function(){
			if (gameBoard.gameArray[Number(this.getAttribute("data-pos"))] != '') return;
			eventListenOff();
			gameBoard.gameArray[Number(this.getAttribute("data-pos"))] = current.name;
			gameBoard.refresh();
			let val = gameBoard.checkWin(gameBoard.gameArray);
			if (val)
			{
				return announceWinner(current, val);
			}

			oDiv.classList.remove("emphasis");
			xDiv.classList.add("emphasis");
			current = "computer";
			setTimeout(() => {

				// gameBoard.gameArray[compPlay()] = playerX.name;
				gameBoard.gameArray[unbeatable(playerX.name)] = playerX.name;

				gameBoard.refresh();

				let val = gameBoard.checkWin(gameBoard.gameArray);
				if (val)return announceWinner(current, val);

				xDiv.classList.remove("emphasis");
				oDiv.classList.add("emphasis");
				current = playerO;
				eventListenOn();
			}, 500);

		
		};

		eventListenOn();
	};

	const playHC = function(){


		if (playerX.playerName != '') xDiv.textContent = `Player ${playerX.playerName}`;
		else xDiv.textContent = `Player ${playerX.name}`;
		oDiv.classList.add("play-div");
		oDiv.textContent = `Computer`;
		sampleDiv.appendChild(xDiv);
		sampleDiv.appendChild(oDiv);
		gameBoard.render();
		gameBoard.refresh();

		let boardDivs = player.listSetup();
		current = playerX;
		
		const eventListenOn = function() {
			for (let div of boardDivs)
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

			if (gameBoard.gameArray[Number(this.getAttribute("data-pos"))] != '') return;
			eventListenOff();
			gameBoard.gameArray[Number(this.getAttribute("data-pos"))] = current.name;
			gameBoard.refresh();
			let val = gameBoard.checkWin(gameBoard.gameArray);
			if (val)
			{
				return announceWinner(current, val);
			}


			xDiv.classList.remove("emphasis");
			oDiv.classList.add("emphasis");
			current = "computer";
			setTimeout(() => {

				// gameBoard.gameArray[compPlay()] = 'O';
				gameBoard.gameArray[unbeatable(playerO.name)] = 'O';

				gameBoard.refresh();

				let val = gameBoard.checkWin(gameBoard.gameArray);
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

	const enterNames = function(){
		let form = document.getElementById("names");
		form.style = "display: block;";
		document.querySelector("#names > button").addEventListener("click", (event) => {
			event.preventDefault();
			playerX.playerName = document.getElementById("name-xs").value;
			playerO.playerName = document.getElementById("name-o").value;
			form.style = "display: none;";
			createButtons();
			playHH();
		});
	};

	const enterName = function(){
		let form = document.getElementById("name");
		form.style = "display: block;";
		document.querySelector("#name > button").addEventListener("click", (event) => {
			event.preventDefault();
			form.style = "display: none;";
			createButtons();
			if (document.getElementById("radx").checked)
			{
				playerX.playerName = document.getElementById("name-x").value;
				playHC();
			}
			else
			{
				playerO.playerName = document.getElementById("name-x").value;
				playHC2();
			}
		});

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
			enterNames();
		});
		compButton.addEventListener("click", () => {
			decider = 2;
			humanButton.style = "display: none";
			compButton.style = "display: none";
			enterName();
		});

		sampleDiv.appendChild(humanButton);
		sampleDiv.appendChild(compButton);

	}

	const announceWinner = function(player, val){
		let div = document.querySelector(".announce");
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
				if (player.playerName)
				{
					div.textContent = `Player ${player.playerName} wins`;	
				}
				else
				{
					div.textContent = `Player ${player.name} wins`;	
				}
			}
		}

	}; 


	const unbeatable = function(playerName){
		let copy = gameBoard.gameArray.slice();

		let maxIndex = 0;
		let minIndex = 0;
		let depth = 0;
		let move;

		let obj = {game: copy, current: playerName};

		const switchCurrent = function(current ){
			return current == 'X' ? 'O' : 'X';
		};

		const score = function(game){
			if(gameBoard.checkWin(game) == 2) return 0;
			let x = game.filter((x) => x == 'X').length;
			let o = game.filter((x) => x == 'O').length;
			if (playerName == 'X') return x > o ? 10 : -10;
			else return x > o ? -10 : 10;

		};

		const minimax = function(obj){
			depth++;
			if(gameBoard.checkWin(obj.game)) return score(obj.game);


			let moves = [];
			let scores = [];

			for (let i = 0; i < obj.game.length; i++)
			{
				if (obj.game[i] == '')
				{

					let newGameState = {game: obj.game.slice(), current: switchCurrent(obj.current)};
					newGameState.game[i] = obj.current;
					moves.push(i);
					scores.push(minimax(newGameState));
				}
			}

			if (obj.current == playerName)
			{

				let max = scores[0];
				move = moves[0];
				for (let i = 0; i < scores.length; i++)
				{
					if (scores[i] > max)
					{
						max = scores[i];
						maxIndex = i;
						move = moves[maxIndex];
					}
				}

				return max;
			}
			else
			{
				
				let min = scores[0];
				for (let i = 0; i < scores.length; i++)
				{
					if (scores[i] < min)
					{
						min = scores[i];
						minIndex = i;
					}
				}
				return min;
			}

		};

		minimax(obj);
		return move;
	}

	return {
		init,
	};
})(gameBoard, playerX, playerO);

game.init();
