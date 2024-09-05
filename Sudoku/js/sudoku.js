/* jshint esversion: 8   */

Array.prototype.equal = function(array2) {
	return this.length === array2.length && this.every((value, index) => value === array2[index]);
};
Array.prototype.notIn = function(array2) {
	return this.filter(x => !array2.includes(x));
};
Array.prototype.includesObj = function(obj) {
   for(let i = 0; i < this.length; i++) {
      if(JSON.stringify(this[i], Object.keys(this[i]).sort()) === JSON.stringify(obj, Object.keys(obj).sort())) return true;
   }
   return false;
};
Object.prototype.equal = function(obj2) {
	return Object.keys(this).every(key => this[key] === obj2[key]);
};	

var Sudoku = {};
Sudoku.puzzle=[];
Sudoku.undoList = [];
Sudoku.generatePuzzle=function(level) {
	function shuffle(array) {
		let randomList = [];
		let newList = [];
		while (randomList.length < array.length) {
			let num = Math.floor((Math.random()*array.length));
			if (randomList.indexOf(num)==-1) randomList.push(num);
		}
		for (let i=0;i<array.length;i++) {
			newList[i]=array[randomList[i]];
		}
		return newList;
	}
	function rand(num) {return Math.floor(Math.random(num)*num);}
	function swapRowAndColumns() {
		let sw1=[];
		for (let i=0;i<9;i++) {
			for (let j=8;j>=0;j--) {
				sw1[i*9+j]=puz[j*9+i];
			}
		}
		puz = sw1;
	}
	function randomizeRowBlocks() {
		let bks=shuffle([0,1,2]);
		let b1=bks[0];
		let b2=bks[1];
		let sw = Object.assign([],puz);
		for (let i=0;i<3;i++) {
			for (let j=0;j<9;j++) {
				puz[(b1*3+i)*9+j] = sw[(b2*3+i)*9+j];
				puz[(b2*3+i)*9+j]=sw[(b1*3+i)*9+j];
			}
		}
	}
	function randomizeColBlocks() {
		let bks=shuffle([0,1,2]);
		let b1=bks[0];
		let b2=bks[1];
		let sw = Object.assign([],puz);
		for (let i=0;i<3;i++) {
			for (let j=0;j<9;j++) {
				puz[j*9+b1*3+i]=sw[j*9+b2*3+i];
				puz[j*9+b2*3+i]=sw[j*9+b1*3+i];
			}
		}
	}
	function randomizeRows() {
		let sw = Object.assign([],puz);
		for (let x=0;x<3;x++) {
			let rowOffset = x*3;
			let nums = shuffle([0,1,2]);
			let r1=nums[0]+rowOffset;
			let r2=nums[1]+rowOffset;
			for (let j=0;j<9;j++) {
				puz[r1*9+j] = sw[r2*9+j];
				puz[r2*9+j] = sw[r1*9+j];
			}
		}
	}
	function randomizeCols() {
		let sw = Object.assign([],puz);
		for (let x=0;x<3;x++) {
			let colOffset = x*3;
			let nums = shuffle([0,1,2]);
			let c1=nums[0]+colOffset;
			let c2=nums[1]+colOffset;
			for (let j=0;j<9;j++) {
				puz[j*9+c1] = sw[j*9+c2];
				puz[j*9+c2] = sw[j*9+c1];
			}
		}
	}
	function swapNumbers() {
		let nums = shuffle([1,2,3,4,5,6,7,8,9]);
		let sw = Object.assign([],puz);
		for (let i=0;i<sw.length;i++) {
			let ndx = nums.indexOf(sw[i]);
			if (ndx == -1) continue;
			puz[i] = ndx+1;
		}
	}
	let seeds = {easy: [
							[0,7,0,0,0,0,0,0,8,9,6,0,0,0,0,4,3,0,0,3,5,2,0,0,0,0,0,0,0,0,5,0,0,7,0,6,0,0,0,1,0,9,5,0,0,0,2,0,0,0,8,0,0,0,0,0,9,0,0,5,0,4,0,0,8,0,0,9,2,0,0,0,0,0,0,8,0,0,0,0,3],// score = 385
                            [0,7,6,0,0,0,0,3,0,9,0,0,0,0,7,6,0,0,3,5,0,0,4,9,0,0,7,0,0,3,8,1,0,0,7,0,0,0,0,0,0,3,0,1,0,0,1,0,0,0,0,0,0,6,0,0,7,0,0,0,0,2,0,0,0,0,0,2,6,4,0,0,1,0,4,5,0,0,0,0,9]// score = 275
                        ],
				medium: [
							[0,0,0,0,0,3,9,4,8,3,0,9,0,0,8,5,0,0,0,0,4,0,0,0,0,0,2,5,0,0,9,0,0,0,0,0,0,0,7,0,1,0,6,0,0,0,0,0,0,0,7,0,0,1,6,0,0,0,0,0,1,0,0,0,0,8,7,0,0,2,0,9,1,7,5,3,0,0,0,0,0], // score = 515
                            [0,0,0,0,0,0,0,1,2,0,0,0,0,3,5,0,0,0,0,0,0,6,0,0,0,7,0,7,0,0,0,0,0,3,0,0,0,0,0,4,0,0,8,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,2,0,0,0,0,0,8,0,0,0,0,0,4,0,0,5,0,0,0,0,6,0,0], // score = 540
                            [0,0,3,7,0,0,0,5,0,0,7,0,0,5,0,8,0,0,1,0,0,0,0,6,0,0,4,5,0,2,0,0,0,0,0,0,8,0,0,9,0,4,0,0,6,0,0,0,0,0,0,9,0,2,3,0,0,5,0,0,0,0,7,0,0,4,0,9,0,0,6,0,0,2,0,0,0,7,4,0,0], // score = 515
                            [0,1,2,0,3,7,0,0,9,0,0,0,0,0,0,0,0,0,7,0,8,0,0,0,0,6,0,0,5,0,0,0,4,0,7,0,4,0,7,0,9,0,8,0,1,0,3,0,1,0,0,0,5,0,0,7,0,0,0,0,6,0,8,0,0,0,0,0,0,0,0,0,6,0,0,4,2,0,3,1,0],  // score = 705
                            [0,0,3,7,0,0,0,5,0,0,7,0,0,5,0,8,0,0,1,0,0,0,0,6,0,0,4,5,0,2,0,0,0,0,0,0,8,0,0,9,0,4,0,0,6,0,0,0,0,0,0,9,0,2,3,0,0,5,0,0,0,0,7,0,0,4,0,9,0,0,6,0,0,2,0,0,0,7,4,0,0], // score = 515
                            [0,0,1,6,0,0,9,0,0,6,3,0,0,0,0,0,0,5,0,0,2,0,5,0,0,0,0,2,6,0,8,0,0,4,0,0,0,5,0,0,2,0,0,3,0,0,0,8,0,0,4,0,9,6,0,0,0,0,7,0,6,0,0,7,0,0,0,0,0,0,2,9,0,0,4,0,0,9,5,0,0], // score = 585
                            [0,9,7,1,0,0,3,4,0,0,1,0,2,3,0,0,0,7,8,0,0,7,0,0,0,0,0,0,0,9,0,0,2,0,0,0,0,2,0,5,0,3,0,7,0,0,0,0,8,0,0,2,0,0,0,0,0,0,0,6,0,0,4,9,0,0,0,5,7,0,6,0,0,6,3,0,0,1,8,5,0], // score =570
                            [0,0,0,0,0,0,0,1,6,2,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,6,0,1,7,0,0,0,0,2,0,0,0,9,0,0,5,0,0,4,0,0,0,0,0,0,0,0,0,3,0,0,0,0,8,0,0,0,0,0,0,6,0,0,4,0,0,5,0,0,4,0,0,0,0],  // score = 565
							[0,6,2,3,0,0,1,0,0,4,0,0,6,1,0,0,0,0,1,5,0,0,9,0,7,0,6,0,0,0,0,0,1,6,0,0,5,0,0,0,0,6,0,0,4,6,9,0,0,4,0,0,1,2,2,0,0,0,6,5,9,8,7,0,0,0,7,3,0,0,0,0,0,0,5,2,8,0,0,0,0]   // score = 660
                        ],
				hard: 	[		
							[0,0,1,8,0,0,6,0,0,5,0,0,0,0,0,0,0,0,0,0,0,7,9,0,0,0,0,0,7,3,0,0,0,0,0,0,0,8,0,9,0,4,0,1,0,0,0,0,0,0,0,2,9,0,0,0,0,0,1,5,0,0,0,0,0,0,0,0,0,0,0,3,0,0,6,0,0,2,4,0,0],  // score =870          
                            [0,0,0,0,0,0,0,1,2,5,0,0,0,0,8,0,0,0,0,0,0,7,0,0,0,0,0,6,0,0,1,2,0,0,0,0,7,0,0,0,0,0,4,5,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,8,0,0,0,0,0,5,0,0,7,0,0,0,2,0,0,0,0,0,0,0], // score = 880;
                            [0,6,5,0,0,0,9,8,0,7,0,0,0,3,0,0,0,0,3,0,0,0,0,2,4,0,0,0,0,0,3,0,0,0,9,8,0,0,4,0,2,0,6,0,0,8,5,0,0,0,6,0,0,0,0,0,6,8,0,0,0,0,1,0,0,0,0,9,0,0,0,7,0,3,7,0,0,0,8,4,0], // score =965 Coloring
							[0,0,6,4,0,0,7,0,0,0,2,8,0,0,0,0,0,6,3,7,0,0,5,0,0,9,0,0,0,0,0,6,1,0,7,0,0,0,7,0,4,5,0,0,0,0,0,3,2,8,0,0,0,1,7,0,0,0,9,0,6,8,0,6,0,0,0,3,0,0,1,7,0,0,1,8,0,0,5,0,0]  // score = 880
                        ],
				fiendish: [		
                            [0,0,1,8,0,0,6,0,0,5,0,0,0,0,0,0,0,0,0,0,0,7,9,0,0,0,0,0,7,3,0,0,0,0,0,0,0,8,0,9,0,4,0,1,0,0,0,0,0,0,0,2,9,0,0,0,0,0,1,5,0,0,0,0,0,0,0,0,0,0,0,3,0,0,6,0,0,2,4,0,0],  // score =870          
                            [0,0,0,0,0,0,0,1,2,5,0,0,0,0,8,0,0,0,0,0,0,7,0,0,0,0,0,6,0,0,1,2,0,0,0,0,7,0,0,0,0,0,4,5,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,8,0,0,0,0,0,5,0,0,7,0,0,0,2,0,0,0,0,0,0,0], // score = 880;
                            [0,6,5,0,0,0,9,8,0,7,0,0,0,3,0,0,0,0,3,0,0,0,0,2,4,0,0,0,0,0,3,0,0,0,9,8,0,0,4,0,2,0,6,0,0,8,5,0,0,0,6,0,0,0,0,0,6,8,0,0,0,0,1,0,0,0,0,9,0,0,0,7,0,3,7,0,0,0,8,4,0], // score =965 Coloring
							[0,0,0,5,0,3,0,4,0,1,3,0,2,7,0,0,0,0,0,5,0,0,0,8,0,0,0,0,0,4,0,8,9,0,0,5,0,1,0,3,5,0,0,2,0,7,0,5,4,2,0,3,9,1,5,0,3,8,0,0,0,1,6,8,0,0,6,3,0,0,5,0,0,0,0,7,0,0,8,0,0]
 						],
                superior: [    
                            [0,4,3,9,8,0,2,5,0,6,0,0,4,2,5,0,0,0,2,0,0,0,0,1,0,9,4,9,0,0,0,0,4,0,7,0,3,0,0,6,0,8,0,0,0,4,1,0,2,0,9,0,0,3,8,2,0,5,0,0,0,0,0,0,0,0,0,4,0,0,0,5,5,3,4,8,9,0,7,1,0], // score = 1200
                            [0,0,0,4,7,0,6,0,0,0,0,4,0,0,0,3,0,5,9,2,0,0,0,0,0,0,0,0,3,1,0,0,0,0,0,0,0,0,0,9,3,6,0,0,0,0,0,0,0,0,0,2,8,0,0,0,0,0,0,0,0,1,6,4,0,8,0,0,0,9,0,0,0,0,7,0,5,2,0,0,0],  // score = 1120 Swordfish
                            [0,0,0,0,5,0,0,9,0,0,0,0,0,0,0,5,8,0,0,6,0,7,0,3,0,0,4,4,3,7,0,1,8,0,5,2,2,0,0,4,0,0,3,0,8,0,0,0,0,0,0,0,0,0,0,2,3,0,0,7,0,0,9,0,0,9,3,0,0,1,0,6,0,0,4,0,0,0,0,3,0], // 1260 xy-wing, coloring and forcing chains
                            [0,6,3,0,0,0,0,7,9,4,8,0,0,0,1,2,3,0,0,0,0,3,4,0,0,0,0,0,5,0,4,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,9,0,0,3,5,6,6,0,1,0,0,0,0,8,0,0,4,8,0,0,0,0,0,2,0,3,0,0,6,2,5,0,1], // 1405 swordfish, xy-Wingcoloring and forcing chains
                            [0,0,0,2,8,5,6,1,3,1,0,0,0,0,4,0,9,8,3,8,0,9,0,1,0,0,4,8,0,0,0,5,0,3,0,7,9,0,0,0,0,0,4,8,5,0,5,0,8,0,7,1,0,9,0,9,0,0,0,0,8,0,2,0,2,0,0,0,0,5,7,1,0,0,0,0,0,2,9,0,6], // 1840 swordfish, coloring and forcing chains
                            [0,0,7,0,0,6,0,4,0,4,0,0,3,0,0,0,7,0,0,0,8,4,2,0,0,6,9,6,8,4,0,5,0,0,3,2,3,1,0,6,0,9,7,5,0,0,0,0,0,3,0,1,0,0,0,4,0,0,0,0,0,0,0,9,0,3,0,0,0,0,0,0,8,0,6,9,7,0,4,1,5] // score= 1260 x- wing++
						],	
				};
	let n = rand(seeds[level].length);
	let puz = Object.assign([],seeds[level][n]);
	randomizeRowBlocks();
	randomizeColBlocks();
	if (rand(2)==1) swapRowAndColumns();
	randomizeRows();
	randomizeCols();
	swapNumbers();
	return puz.join('').replace(/0/g,' ');
};
Sudoku.generateHTML = function() {
	let s = `<div class="puzzle">`;
	for (let i=0;i<9;i++) {
		s += `<div class="block">`;
		for (let j=0;j<9;j++) {
			let row = Math.floor(i/3)*3 + Math.floor(j/3); 
			let col = (i%3)*3 + j%3;
			let active = (i==0 && j==0)?'active':'';
			s += `<button id="r${row}c${col}" class="cell ${active}" tabindex="${row+20}" ${focus}><span></span>`;
			for (let k=0;k<9;k++) {
				s += `<div class="pencil"></div>`;
			}
			s += `</button>`;
		}
		s += `</div>`;
	}
	s += `</div>`;
	s += `<canvas class="canvas"></canvas>`;
	let puz = document.querySelector(".puzzleArea");
	for (let child of puz.children)  { child.remove();}
	puz.innerHTML = s;
	Sudoku.canvas.canvas = document.querySelector('.canvas');
	Sudoku.canvas.ctx = Sudoku.canvas.canvas.getContext("2d");
	Sudoku.canvas.canvas.width  = 62*9+8;
	Sudoku.canvas.canvas.height = 62*9+8; 
};
Sudoku.addPuzzle = function(rowColList) {
	class _cell {
		constructor(row,col,block) {
			this.row 	= row;
			this.col 	= col;
			this.block 	= block;
			this._domCandidates = [];
			this.status = '';
			this.domCell = document.getElementById(`r${row}c${col}`);
			this.domCell.puzCell = this;
			Object.defineProperty(this,'domValue', webValueHandler);
			Object.defineProperty(this,'domCandidates', webCandidatesHandler);
		}
	}
	let webValueHandler = {
		get: function() {
			let value = this.domCell.querySelector('span').innerHTML;
			return isNaN(parseInt(value))?' ':parseInt(value);
		},
		set: function(value) {
			if (this.initialValue!=' ') return;
			let element = this.domCell.querySelector('span');
			if (this.status!='undo') 
				Sudoku.undoList[Sudoku.undoList.length-1].push({cell:this,type:'v',operation:'s',value:element.innerText});
			if (!element.innerText ||element.innerText==' ') {
				this.domCell.querySelector('span').innerHTML=value;
				if (value=='' || value!=" " ) element.parentNode.classList.add('noPencils');
			}
			else {
				this.domCell.querySelector('span').innerHTML=' ';
				element.parentNode.classList.remove('noPencils');
			}
			//TODO -- aupdate pencils in puzzle;
		}
	};
	let webCandidatesHandler = {
		get: function() {
			let value = this.domCell.querySelector('span').innerText;
			if (this.initialValue==' ' && (!value || value=='' || value==" "))
				return Object.assign([],this._domCandidates);
			return [];
		},
		set: function(value) {
			// update candidates from array
			if (this.status!='undo') 
				Sudoku.undoList[Sudoku.undoList.length-1].push({cell:this,type:'c',operation:'s',value:this.domCandidates});
			let c = this.domCell.querySelectorAll('.pencil');
			for (let i=1;i<=9;i++) {
				if (value.indexOf(i)==-1) c[i-1].innerText=' ';
				else c[i-1].innerText = i;
			}
			this._domCandidates=value;
		}
	};
	this.puzzle = [];
	this.undoList = [[]];
	let solution = this.solver.solve(rowColList).split('');
	if (solution==false) {
		alert("No solution for puzzle");
		return false;
	}
	let list = rowColList.split('');
	for (let i=0;i<9;i++) {
		for (let j=0;j<9;j++) {
			let value=list[i*9+j];
			if (value!=' ') value=parseInt(value);
			let cell = new _cell(i,j,Math.floor(i/3)*3+Math.floor(j/3));  // row & col
			cell.initialValue=' ';
			cell.domValue=value;
			cell.initialValue=value;
			cell.solutionValue=parseInt(solution[i*9+j]);
			cell.domCell.puzCell = cell;
			this.puzzle.push(cell);
			if (this.showPencilNotes == "none") cell.domCell.classList.add('noPencils');
		}
	}
	this.updateDomCandidates();
	if (this.showPencilNotes == "none")   document.getElementById("btnP").style.display="none";
	this.undoList = [];
	return true;
};
Sudoku.getColumnCells = function(cell) {
	let cells = [];
	for (let i = 0;i<9;i++) {
		cells.push(this.puzzle[i*9 +cell.col]);
	}
	return cells;
};
Sudoku.getRowCells = function(cell) {
	let cells = [];
	for (let i = 0;i<9;i++) {
		cells.push(this.puzzle[cell.row*9 +i]);
	}
	return cells;
};
Sudoku.getBlockCells = function(cell) {
	let cells = [];
	let br = Math.floor(cell.row/3)*3;
	let bc = Math.floor(cell.col/3)*3;
	for (let i=br;i<br+3;i++) {
		for (let j=bc;j<bc+3;j++) {
			cells.push(this.puzzle[i*9+j]);
		}
	}
	return cells;
};
Sudoku.getRelatedCells = function(cell) {
	let cells = this.getRowCells(cell);
	cells = cells.concat(this.getColumnCells(cell));
	cells = cells.concat(this.getBlockCells(cell));
	return [... new Set(cells)];
};
Sudoku.updateDomCandidate = function(cell) {
	let related = this.getRelatedCells(cell);
	let value = parseInt(cell.domValue)||' ';
	if (value==' ') {  // cell has erased the value and therefore affects all cells
		for (let cell2 of related) {
			if (cell2.domValue!=' ') {
				cell2.domCandidates=[];
				continue;
			}
			let domCandidates = [1,2,3,4,5,6,7,8,9];
			let related2 = this.getRelatedCells(cell2);
			for (let c of related2) {
				let ndx;
				let value = c.domValue;
				if (value!=' '){
					ndx = domCandidates.indexOf(parseInt(value));
					if (ndx!=-1) domCandidates.splice(ndx,1);
				}
			}
			cell2.domCandidates = domCandidates;
		}
	}
	for (let c of related) {
		let cdts = c.domCandidates;
		let ndx = cdts.indexOf(value);
		if (ndx!=-1) {
			cdts.splice(ndx,1);
			c.domCandidates=cdts;
		}
	}
};
Sudoku.updateDomCandidates=function() {
	let cell;
	for (let i=0;i<9;i++) {
		for (let j=0;j<9;j++) {
			cell = this.puzzle[i*9+j];
			if (cell.domValue!=' ') {
				cell.domCandidates=[];
				continue;
			}
			let domCandidates = [1,2,3,4,5,6,7,8,9];
			let related = this.getRelatedCells(cell);
			for (let c of related) {
				let ndx;
				let value = c.domValue;
				if (value!=' '){
					ndx = domCandidates.indexOf(parseInt(value));
					if (ndx!=-1) domCandidates.splice(ndx,1);
				}
			}
			cell.domCandidates = domCandidates;
			cell.initialCandidates = Object.assign([],domCandidates);
		}
	}
	
};
Sudoku.canvas = {
	ctx: 	null,
	canvas: null,
	clear: function() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	// define a vec2 class to make vector maths easier (simpler to read)
	vec2: function(x,y) {
		this.length = function() {
			return Math.sqrt((this.x * this.x) + (this.y*this.y));
		};
		this.x = x;
		this.y = y;
		var scale = this.length();
		this.x /= scale;
		this.y /= scale;
	},
	drawCircle:function(row,col,note,width) {
		if (!width) width=1;
		this.ctx.beginPath();
		this.ctx.lineWidth=width;
		let [x,y]=this.calcOffset(row,col,note);
		this.ctx.arc(x,y,9,(Math.PI/180)*0, (Math.PI/180)*360, false);
		this.ctx.stroke();
		this.ctx.lineWidth=1;
	},	
	adjustLineForCircles:function(x1,y1,x2,y2) {
	    var vec = new this.vec2(x1 - x2, y1 - y2);
		x1-=9*vec.x;
		y1-=9*vec.y;
		x2+=9*vec.x;
		y2+=9*vec.y;
		return [x1,y1,x2,y2];
	},
	drawLine:function(item) {
		if (item.point1.circle) this.drawCircle(item.point1.row,item.point1.col,item.point1.note);
		if (item.point2.circle) this.drawCircle(item.point2.row,item.point2.col,item.point2.note);
		this.ctx.beginPath();
		let [x1,y1] =this.calcOffset(item.point1.row,item.point1.col,item.point1.note);
		let [x2,y2] =this.calcOffset(item.point2.row,item.point2.col,item.point2.note);
		[x1,y1,x2,y2] = this.adjustLineForCircles(x1,y1,x2,y2);
		this.ctx.moveTo(x1,y1);
		this.ctx.lineTo(x2,y2);
		this.ctx.stroke();
	},
	drawRect:  function(item) {
		this.ctx.beginPath();
		let [x1,y1] =this.calcOffset(item.point1.row,item.point1.col,item.point1.note);
		let [x2,y2] =this.calcOffset(item.point2.row,item.point2.col,item.point2.note);
		//[x1,y1,x2,y2] = this.adjustLineForCircles(x2,y2,x1,y1);
		this.ctx.strokeRect(x1-9, y1-9, x2-x1+18, y2-y1+18);
		this.ctx.stroke();
	},
	calcOffset:function(row,col,note) {
		let x = col*60+((note-1)%3)*20+10;  // row/col base zero
		let y = row*60+Math.floor((note-1)/3)*20+10; // center of note cell
		x+= 3 + Math.floor(col/3)*2 + col*2; // border offsets.
		y+= 3 + Math.floor(row/3)*2 + row*2;
		return [x,y];
	},
	draw: 	function(list) {
		let color = getComputedStyle(document.querySelector('.cell')).getPropertyValue("color");
		this.ctx.strokeStyle=color;
		this.ctx.lineWidth=1;
		for (let item of list) {
			if (item.type=='circle') 	this.drawCircle(item.row,item.col,item.note,2);
			else if (item.type=='line') this.drawLine(item);
			else if (item.type=='rect') this.drawRect(item);
		}
	},
	
};
Sudoku.animateFinish=function() {
	function startShake() {
		let ndx = 1;
		if (list.length<=10) {
			for (let num of list) {
				Sudoku.puzzle[num].domCell.querySelector('span').classList.add('shake');
			}
			setTimeout(function() {
				for (let cell of Sudoku.puzzle) {
					cell.domCell.querySelector('span').classList.remove('shake');
				}},10000);
			clearInterval(interval);
			return;
		}
		while (ndx!=-1) {
			let num = Math.floor(Math.random()*81);
			ndx = list.indexOf(num);
			if (ndx!=-1) {
				Sudoku.puzzle[num].domCell.querySelector('span').classList.add('shake');
				list.splice(ndx,1);
				if (list.length==0) clearInterval(interval);
				break;
			}
		}
	}
	let list = [...Array(81).keys()];
	let interval= setInterval(startShake,10);
};
Sudoku.ratePuzzle = function() {
	function redo() {
		Sudoku.undoList.reverse();
		for (let undoList of Sudoku.undoList) {
			undoList.reverse();
			for (let item of undoList) {
				let status = item.cell.status;
				item.cell.status='undo';
				if (item.type=='v') {
					item.cell.domValue=item.value;
				}
				else {
					item.cell.domCandidates=item.value;
				}
				item.cell.status=status;
			}
		}
		Sudoku.undoList=[];
	}
	let list =[];
	let rating=Math.floor(Math.random()*5);
	let tries,rc;
	let level = {singleCandidate:1,hiddenSingle:3,BlkAndRowCol:8,blkAndBlk:8,nakedSubset:6,hiddenSubset:8,XYWings:9,xWings:12,swordfish:15,chainedPairs:18,linkedPairs:20};
	let solvers = ["singleCandidate","hiddenSingle","BlkAndRowCol", "blkAndBlk", "nakedSubset", "hiddenSubset", "XYWings","xWings","swordfish","chainedPairs","linkedPairs"];
	for (tries=0;tries<200;tries++) {
		for (let hint of solvers) {
			rc = this.solvers[hint]();
			if (rc==false) continue;
			rating+=level[hint];
			list[level[hint]]=rc.type;
			Sudoku.undoList.push([]);
			if (rc.solutionType==1) {
				rc.cell.domValue=rc.value[0];
				Sudoku.updateDomCandidate(rc.cell);
			}
			else {
				for (let cell of rc.affectedCells) {
					let cdts = cell.domCandidates;
					for (let val of rc.value) {
						let ndx  = cdts.indexOf(val);
						if (ndx!=-1) cdts.splice(ndx,1);
					}
					cell.domCandidates = cdts;
				}
			}
			break;
		}
		if (rc==false) break;
	}
	if (!Sudoku.puzzle.every(cell=>cell.domValue!=' ')) {
		alert('Cannot rate puzzle, unable to solve puzzle.');
		return false;
	}
	if (tries>=200) {
		alert('Cannot rate puzzle, unable to complete solution.');
		return false;
	}
	redo();	
	list = list.filter(el => el.length);
	document.querySelector('.hints').innerHTML = 
		`Rating of puzzle is ${rating}. It contains ${list.join(', ').replace(/,([^,]*)$/, " and" + '$1')}.`;	
	return true;
};
Sudoku.getHint = function() {
	function backButton() {
		let rc = Sudoku.hintOjbect;
		if (rc.step==0) cancelButton();
		else {
			rc.step--;
			displayHintDialog(rc);
		}
	}
	function nextButton() {
		let rc = Sudoku.hintOjbect;
		let cell = rc.cell;
		for (let cell of rc.affectedCells) cell.domCell.classList.add('matched');
		rc.step++;
		if (rc.step == rc.text.length) {  // apply changes from affected cell(s)
			Sudoku.undoList.push([]);
			if (rc.solutionType==1) {
				cell.domValue=rc.value[0];
				Sudoku.updateDomCandidate(rc.cell);
			}
			else {
				for (let cell of rc.affectedCells) {
					let cdts = cell.domCandidates;
					for (let val of rc.value) {
						let ndx  = cdts.indexOf(val);
						if (ndx!=-1) cdts.splice(ndx,1);
					}
					cell.domCandidates = cdts;
				}
			}
			cancelButton();
		}
		else {
			if (rc.drawings && rc.drawings.length>0) Sudoku.canvas.draw(rc.drawings);
			displayHintDialog(rc);
		}
	}
	function cancelButton() {
		let rc = Sudoku.hintOjbect;
		document.querySelector('.hints').innerHTML = "";	
		document.querySelector('.hints').classList.remove('keepHint');
		Sudoku.canvas.clear();
		for (let cell of Sudoku.puzzle) cell.domCell.classList.remove('active','related','matched');
		Sudoku.active = rc.affectedCells[0];
		rc.affectedCells[0].domCell.classList.add('active');
		rc.affectedCells[0].domCell.focus();
	}
	function displayHintDialog(hint) {
		var rc = hint;
		let header = rc.type;
		let message = rc.text[rc.step];
		let back = rc.step!=0?"":"display:none;";
		let next = rc.text.length!=rc.step+1?"Next":"Apply";
		document.querySelector('.hints').innerHTML = "";
		let html = `
			<header>${header}</header>
			<div>${message}</div>
			<div class="hintButtons">
				<button class="btn" style="float:left;${back}"  id="hintBackButton">Back</button>
				<button class="btn"id="hintNextButton">${next}</button>
				<button class="btn" id="hintCancelButton">Cancel</button>
			</div>`;
		document.querySelector('.hints').innerHTML = html;
		document.getElementById('hintBackButton').addEventListener('click',backButton);
		document.getElementById('hintNextButton').addEventListener('click',nextButton);
		document.getElementById('hintCancelButton').addEventListener('click',cancelButton);
	}	
	if (document.querySelector('[data-button="check"]').click()) return;
	if (Sudoku.showPencilNotes == "none") {
		Sudoku.undoList.push([]);
		Sudoku.updateDomCandidates();
	}
	Sudoku.hintOjbect = {affectedCells:[Sudoku.active]};
	let solvers = ["singleCandidate","hiddenSingle","BlkAndRowCol", "blkAndBlk", "nakedSubset", "hiddenSubset", "XYWings","xWings","swordfish","chainedPairs","linkedPairs"];
	for (let hint of solvers) {
		let rc = this.solvers[hint]();
		if (rc==false) continue;
		if (Sudoku.showPencilNotes == "none" && rc.solutionType!=1) break;
		document.querySelector('.hints').classList.add('keepHint');
		rc.step = 0;
		for (let cell of this.puzzle)  	  cell.domCell.classList.remove('active','related','matched');
		for (let cell of rc.relatedCells) cell.domCell.classList.add('related');
		Sudoku.hintOjbect = rc;
		if (Sudoku.showPencilNotes == "none") {
			for (c of Sudoku.puzzle) c.domCandidates=[];
			Sudoku.undoList.pop();
		}
		displayHintDialog(rc);
		return;
	}
	document.querySelector('.hints').innerHTML = 'No hint avaiable without more information.  Please fill in pencil notes.';
	if (Sudoku.showPencilNotes == "none") {
		for (c of Sudoku.puzzle) c.domCandidates=[]
		Sudoku.undoList.pop();
	}
};
Sudoku.solvers={
	singleCandidate: function() {
		for (let i=0;i<81;i++) {
			let cell = Sudoku.puzzle[i];
			if (cell.domValue==' ' && cell.domCandidates.length==1){
				let rc = {};
				rc.solutionType=1;
				rc.value = [cell.solutionValue];
				rc.cell=cell;
				rc.solver=this;
				rc.row=cell.row;
				rc.col=cell.col;
				rc.type="Single Candidate";
				rc.affectedCells = [cell];
				rc.relatedCells = [cell];
				rc.drawings = [];
				rc.drawings.push({type:'circle',row:rc.affectedCells[0].row,col:rc.affectedCells[0].col,note:rc.value});
				rc.text = [[`A single candidate for ${rc.value} exists in row ${cell.row+1}, column ${cell.col+1}.`]];
				return rc;
			}
		}
		return false;
	},
	BlkAndRowCol: 	function() { 		// Block and Row/Column interaction
		function getUniqueBlock(block,row,col) {
			function testRows(block,row,col) {
				for (let t=0;t<3;t++) {
					unique.row= row+t;
					let test=[],rest=[];
					for (let i=0;i<3;i++) {
						for (let j=0;j<3;j++) {
							if (i==t) test=test.concat(puz[block+i*9+j].domCandidates);
							else 	  rest=rest.concat(puz[block+i*9+j].domCandidates);
						}
					}
					test = [...new Set(test)];
					rest = [...new Set(rest)];
					for (let num of test) {
						if (!rest.includes(num)) {
							unique.value = num;
							unique.dir='row';
							unique.test=test;
							if (rowHasItems(unique,row,col)) return true;
						}
					}
				}
				return false;
			}
			function testCols(block,row,col) {
				for (let t=0;t<3;t++) {
					unique.col= col+t;
					let test=[],rest=[];
					for (let i=0;i<3;i++) {
						for (let j=0;j<3;j++) {
							if (i==t) test = test.concat(puz[block+j*9+i].domCandidates);
							else 	  rest = rest.concat(puz[block+j*9+i].domCandidates);
						}
					}
					test = [...new Set(test)];
					rest = [...new Set(rest)];
					for (let num of test) {
						if (!rest.includes(num)) {
							unique.value = num;
							unique.dir='column';
							unique.test=test;
							if (colHasItems(unique,row,col)) return true;
						}
					}
				}
				return false;
			}
			function rowHasItems(unique,row,col) {
				let cell = Sudoku.puzzle[unique.row*9+col];
				unique.related = Sudoku.getRowCells(cell);
				unique.related = unique.related.concat(Sudoku.getBlockCells(cell));
				unique.affected = [];
				for (let i=0;i<9;i++) {
					if (i==col||i==col+1||i==col+2) continue;
					cell = Sudoku.puzzle[unique.row*9+i];
					if (cell.domCandidates.includes(unique.value))
						unique.affected.push(cell);
					
				}
				if (unique.affected.length!=0) return unique;
				return false;
			}
			function colHasItems(unique,row,col) {
				let cell = Sudoku.puzzle[unique.col];
				unique.related = Sudoku.getColumnCells(cell);
				unique.related = unique.related.concat(Sudoku.getBlockCells(cell));
				unique.affected = [];
				for (let i=0;i<9;i++) {
					if (i==row||i==row+1||i==row+2) continue;
					cell = Sudoku.puzzle[i*9+unique.col];
					if (cell.domCandidates.includes(unique.value))
						unique.affected.push(cell);
				}
				if (unique.affected.length!=0) return unique;
				return false;
			}
			let unique={row:-1,col:-1,block:block,dir:false},puz=Sudoku.puzzle;
			if (testRows(block,row,col)) return unique;
			if (testCols(block,row,col)) return unique;
			return false;
		}
		function processBlkRowCol(unique) {
			let rc = {drawings:[]};
			rc.solutionType = 2;
			rc.type = 'Block and '+unique.dir+ ' interaction';
			rc.relatedCells = unique.related;
			rc.affectedCells = unique.affected;
			rc.value = [unique.value];
			rc.cell = rc.affectedCells[0];
			rc.row = rc.cell.row;
			rc.col = rc.cell.col;
			rc.text = [[`An interaction between ${unique.dir} and block exists in highlighted area.`],
					   [`The values ${rc.value.join(', ')} are unique in the block, and therefore other candidates in ${unique.dir} cannot exist. `]
					  ];
			for (let cell of unique.affected) {
				rc.drawings.push({type:'circle',row:cell.row,col:cell.col,note:unique.value});
			}				
			return rc;
		}
		for (let i=0;i<9;i++) {
			let block = Math.floor(i/3)*27 + (i%3)*3;
			let row   = Sudoku.puzzle[block].row;
			let col   = Sudoku.puzzle[block].col;
			let unique = getUniqueBlock(block,row,col);
			if (unique) return processBlkRowCol(unique);
		}
		return false;
	},
	blkAndBlk:		function() {
		function testRowPair(pair) {
			let puz  = Sudoku.puzzle,unique={affected:[]};
			let blk1 = Math.floor(pair[0]/3)*27+(pair[0]%3)*3;
			let blk2 = Math.floor(pair[1]/3)*27+(pair[1]%3)*3;
			let blk3 = Math.floor(pair[2]/3)*27+(pair[2]%3)*3;
			let sets = [[0,1,2],[0,2,1],[1,2,0]];
			for (let set of sets) {
				let list1a=[];
				let list2a=[];
				let list1b=[];
				let list2b=[];
				let list3=[];
				let list4=[];
				let i;
				for (i=0;i<3;i++) {   // get first  col witin the two blocks
					list1a = list1a.concat(puz[blk1+set[0]*9+i].domCandidates); // gets all cols w/i blk
					list2a = list2a.concat(puz[blk2+set[0]*9+i].domCandidates);
				}
				let cdts = list1a.filter(value => list2a.includes(value));
				if (cdts.length==0) continue;
				for (let i=0;i<3;i++) {
					list1b = list1b.concat(puz[blk1+set[1]*9+i].domCandidates); 
					list2b = list2b.concat(puz[blk2+set[1]*9+i].domCandidates); 
				}
				cdts = cdts.filter(value => list1b.includes(value));
				if (cdts.length==0) continue;
				cdts = cdts.filter(value => list2b.includes(value));
				if (cdts.length==0) continue;
				let list5=[],list6=[],list7=[];
				for (let i=0;i<3;i++) {
					list3 = list3.concat(puz[blk1+set[2]*9+i].domCandidates);
					list3 = list3.concat(puz[blk2+set[2]*9+i].domCandidates);
					list4 = list4.concat(puz[blk3+set[0]*9+i]);
					list4 = list4.concat(puz[blk3+set[1]*9+i]);
					list5 = list5.concat(puz[blk1+set[0]*9+i]);
					list5 = list5.concat(puz[blk1+set[1]*9+i]);
					list6 = list6.concat(puz[blk2+set[0]*9+i]);
					list6 = list6.concat(puz[blk2+set[1]*9+i]);
					list7 = list7.concat(puz[blk1+set[2]*9+i]);
					list7 = list7.concat(puz[blk2+set[2]*9+i]);
				}
				list3 = [...new Set(list3)];
				for (let num of cdts) {
					if(!list3.includes(num)) {
						for (let c of list4) {
							if (c.domCandidates.includes(num)) unique.affected.push(c);
						}
						if (unique.affected.length==0) continue;
						unique.dir='row';
						unique.set=[puz[blk1+set[0]*9].row,
									puz[blk1+set[1]*9].row,
									puz[blk1+set[2]*9].row];

						unique.value=num;
						unique.rect1 = [list5[0],list5[5]];
						unique.rect2 = [list6[0],list6[5]];
						unique.related = list5.concat(list6,list7,list4);
						return unique;
					}
				}
			}
			return false;
		}
		function testColPair(pair) {
			let puz  = Sudoku.puzzle,unique={affected:[]};
			let blk1 = Math.floor(pair[0]/3)*27+(pair[0]%3)*3;
			let blk2 = Math.floor(pair[1]/3)*27+(pair[1]%3)*3;
			let blk3 = Math.floor(pair[2]/3)*27+(pair[2]%3)*3;
			let sets = [[0,1,2],[0,2,1],[1,2,0]];
			for (let set of sets) {
				let list1a=[];
				let list2a=[];
				let list1b=[];
				let list2b=[];
				let list3=[];
				let list4=[];
				let i;
				for (i=0;i<3;i++) {  // list1a+list2a contain all cells within the two test blks
					list1a = list1a.concat(puz[blk1+i*9+set[0]].domCandidates); //gets row w/i block
					list2a = list2a.concat(puz[blk2+i*9+set[0]].domCandidates);
				}
				let cdts = list1a.filter(value => list2a.includes(value));  // find unique w/i 2 rows
				if (cdts.length==0) continue;
				for (i=0;i<3;i++) {  // get the rows in the next ...
					list1b = list1b.concat(puz[blk1+i*9+set[1]].domCandidates); 
					list2b = list2b.concat(puz[blk2+i*9+set[1]].domCandidates); 
				}
				cdts = cdts.filter(value => list1b.includes(value));   
				if (cdts.length==0) continue;
				cdts = cdts.filter(value => list2b.includes(value));
				if (cdts.length==0) continue;
				let list5=[],list6=[],list7=[];
				for (let i=0;i<3;i++) {
					list3 = list3.concat(puz[blk1+i*9+set[2]].domCandidates);
					list3 = list3.concat(puz[blk2+i*9+set[2]].domCandidates); 
					list4 = list4.concat(puz[blk3+i*9+set[0]]);
					list4 = list4.concat(puz[blk3+i*9+set[1]]);
					list5 = list5.concat(puz[blk1+i*9+set[0]]);
					list5 = list5.concat(puz[blk1+i*9+set[1]]);
					list6 = list6.concat(puz[blk2+i*9+set[0]]);
					list6 = list6.concat(puz[blk2+i*9+set[1]]);
					list7 = list7.concat(puz[blk1+i*9+set[2]]);
					list7 = list7.concat(puz[blk2+i*9+set[2]]);
				}
				list3 = [...new Set(list3)];
				for (let num of cdts) {
					if(!list3.includes(num)) {
						for (let c of list4) {
							if (c.domCandidates.includes(num)) unique.affected.push(c);
						}
						if (unique.affected.length==0) continue;
						unique.dir='column';
						unique.set=[puz[blk1+set[0]].col,
									puz[blk1+set[1]].col,
									puz[blk1+set[2]].col];

						unique.value=num;
						unique.rect1 = [list5[0],list5[5]];
						unique.rect2 = [list6[0],list6[5]];
						unique.related = list5.concat(list6,list7,list4);
						return unique;
					}
				}
			}
			return false;
		}
		function processResponse(unique) {
			function setupDrawing() {
				rc.drawings=[];
				rc.drawings.push({type:'rect',point1:{row:unique.rect1[0].row,col:unique.rect1[0].col,note:1},
											  point2:{row:unique.rect1[1].row,col:unique.rect1[1].col,note:9}});
				rc.drawings.push({type:'rect',point1:{row:unique.rect2[0].row,col:unique.rect2[0].col,note:1},
											  point2:{row:unique.rect2[1].row,col:unique.rect2[1].col,note:9}});
				for (let cell of unique.affected) {
					rc.drawings.push({type:'circle',row:cell.row,col:cell.col,note:unique.value});
				}					
			}
			let rc = {};
			rc.solutionType = 2;
			rc.value = [unique.value];
			rc.type = 'Block and Block Interaction';
			rc.relatedCells = unique.related;
			rc.affectedCells = unique.affected;
			rc.cell = unique.affected[0];
			rc.row = rc.cell.row;
			rc.col = rc.cell.col;
			rc.text = [[`The two blocks highlighted area can eliminate candidate in highlighted ${unique.dir}.`],
					   [`The values ${rc.value} exists in both highlighted blocks in ${unique.dir} ${unique.set[0]+1}
					     and in ${unique.dir} ${unique.set[1]+1} and not in ${unique.dir} ${unique.set[2]+1}, 
						 and therefore cannot exist elsewhere in the third block in those rows.`]
					  ];
			setupDrawing();		  
			return rc;
		}
		let pair,unique={};
		let blkRowPairs = [[0,1,2],[0,2,1],[1,2,0],[3,4,5],[3,5,4],[4,5,3],[6,7,8],[6,8,7],[7,8,6]];
		let blkColPairs = [[0,3,6],[0,6,3],[3,6,0],[1,4,7],[1,7,4],[4,7,1],[2,5,8],[2,8,5],[5,8,2]];
		for(pair of blkRowPairs) {
			unique = testRowPair(pair);
			if (unique) return processResponse(unique);
		}
		for(pair of blkColPairs) {
			unique = testColPair(pair);
			if (unique) return processResponse(unique);
		}
		return false;
		
	},
	hiddenSingle: 	function() {
		function testForSingle(cell,list) {
			if (!(cell.initialValue==' ' || cell.domValue == ' ')) return false;
			let cdts = cell.domCandidates;
			for (let c of list) {
				if (c == cell) continue;
				let cd = c.domCandidates;
				for (let d of cd) {
					let ndx = cdts.indexOf(d);
					if (ndx!=-1) cdts.splice(ndx,1);
				}
			}
			return cdts.length==1?[cdts[0]]:false;
		}
		let rc = {};
		
		for (let cell of Sudoku.puzzle) {
			for (let rcb of ['Row','Column','Block']) {
				let list = Sudoku['get'+rcb+'Cells'](cell);
				let test = testForSingle(cell,list);
				if (test) {
					rc.solutionType = 1;
					rc.type = 'Hidden Single';
					rc.relatedCells = list;
					rc.affectedCells = [cell];
					rc.value = [test];
					rc.cell = cell;
					rc.row = cell.row;
					rc.col = cell.col;
					rc.drawings = [];
					rc.drawings.push({type:'circle',row:rc.affectedCells[0].row,col:rc.affectedCells[0].col,note:rc.value});
					rc.text = [[`A hidden single exists in highlighted area.`],
							   [`The hidden single ${rc.value} is in row ${cell.row+1}, column ${cell.col+1}`]
							  ];
					return rc;
				}
			}
		}
		return false;
	},
	nakedSubset: 	function() {
		function getSubsets(cell) {
			let candidates = cell.domCandidates;
			let subsets =[];
			if (candidates.length<2) return subsets;
			if (candidates.length >= 2){
				subsets.push([candidates[0], candidates[1]]);
			}
			if (candidates.length >= 3){
				subsets.push([candidates[0], candidates[2]]);
				subsets.push([candidates[1], candidates[2]]);
				subsets.push([candidates[0], candidates[1], candidates[2]]);
			}
			if (candidates.length >= 4){
				subsets.push([candidates[0], candidates[1], candidates[3]]);
				subsets.push([candidates[1], candidates[2], candidates[3]]);
				subsets.push([candidates[0], candidates[1], candidates[2]]);
				subsets.push([candidates[0], candidates[1], candidates[2], candidates[3]]);
			}	
			return subsets;
		}
		function testNakedSubset(cell,list,subset) {
			let arr=[];
			let affected=[];
			for (let c of list) {
				if (c.domValue!= ' ') continue;
				let cdts = c.domCandidates;
				if 		(subset.equal(cdts)) arr.push(c);
				else if (subset.some(val => cdts.includes(val))) affected.push(c);
			}
			//affected = affected.notIn(arr);
			if (arr.length==subset.length && affected.length!=0) return [arr,affected];
			return false;
		}
		function processNakedResponse(cell,list,subset,rc1) {
			function setupDrawing(rc){
				rc.drawings=[];
				let drawing;
				for (let cell of rc.relatedCells) {
					let first = true;
					for (let num of subset) {
						if (first) {
							first=false;
							drawing={type:'line',point1:{row:cell.row,col:cell.col,note:num,circle:true}};
						}
						else {
							drawing.point2={row:cell.row,col:cell.col,note:num,circle:true};
							rc.drawings.push(drawing);
							drawing={type:'line',point1:{row:cell.row,col:cell.col,note:num,circle:true}};
						}
					}
				}
				for (let cell of rc.affectedCells) {
					let cdts = cell.domCandidates;
					for (let num of subset) {
						if (cdts.includes(num))
							rc.drawings.push({type:'circle',row:cell.row,col:cell.col,note:num});
					}
				}
			}
			let rc = {};
			rc.solutionType = 2;
			rc.value = subset;
			rc.type = 'Naked Subset';
			rc.relatedCells  = rc1[0];
			rc.affectedCells = rc1[1];
			rc.value = subset;
			rc.cell = cell;
			rc.row = cell.row;
			rc.col = cell.col;
			setupDrawing(rc);
			rc.text = [[`A naked subset exists in highlighted area.`],
					   [`The linked values ${subset.join(', ')} are unique in the highlighted cells, and therefore other cells in highlighted area cannot have these values.`]
					  ];
			return rc;
		}
		let cell,rc1,list,subset;
		for (cell of Sudoku.puzzle) {
			let subsets = getSubsets(cell);
			for (subset of subsets) {
				for (let rcb of ['Row','Column','Block']) {
					list = Sudoku['get'+rcb+'Cells'](cell);
					rc1 = testNakedSubset(cell,list,subset);
				    if (rc1) return processNakedResponse(cell,list,subset,rc1);
				}
			}
		}
		return false;
	},
	hiddenSubset: 	function() {
		function testHiddenSubset(list) {
			let cdts, hidden_cdts = [];
			let cell,cells,nums,affected,values=[],rc={};
			for (let i=0;i<list.length;i++) {
				cell = list[i];
				let cdts = cell.domCandidates;
				if (cdts.length==2 || cdts.length==3) hidden_cdts.push(cdts);
			}
			for (let nums of hidden_cdts) {
				cells = [];
				for (let i=0;i<list.length;i++) {
					cell = list[i];
					cdts = cell.domCandidates;
					if (nums.some(val=>cdts.includes(val))) cells.push(cell);
				}
				if (cells.length==nums.length) {
					affected=[]
					for (cell of cells) {
						cdts = cell.domCandidates;
						if (!cdts.every(val=>nums.includes(val))) {
							affected.push(cell);
							values=values.concat(cdts.notIn(nums));
						}
					}
					if (affected.length==0) continue;
					rc.relatedCells=list;
					rc.affectedCells=cells;
					rc.subset=nums;
					rc.value=[...new Set(values)];
					return rc;
				}
			}
			return false;
		}
		function processHiddenResponse(rc) {
			function setupDrawings() {
				rc.drawings=[];
				let drawing,first;
				for (let num of rc.value) {
					for (let cell of rc.affectedCells) {
						if (cell.domCandidates.includes(num))
							rc.drawings.push({type:'circle',row:cell.row,col:cell.col,note:num});
					}
				}
				for (let num of rc.subset) {
					for (let cell of rc.affectedCells){
						if (!cell.domCandidates.includes(num)) continue;
						drawing={type:'line',point1:{row:cell.row,col:cell.col,note:num,circle:true}};
						drawing.point2={row:cell.row,col:cell.col,note:num,circle:false};
						rc.drawings.push(drawing);
					}
				}
			}
			rc.solutionType = 2;
			rc.type = `Hidden Subset(${rc.subset.length})`;
			setupDrawings();
			rc.text = [[`A hidden subset exists in highlighted area.`],
					   [`The values [${rc.subset.join(', ')}] are unique in the highlighted area, and therefore other candidates [${rc.value.join(', ')}] cannot exist in the same cells.`]
					  ];
			return rc;
		}
		let cell,rc,list,subset;
		for (let rcb of ['Row','Column','Block']) {
			for (let i=0;i<9;i++) {
				if 		(rcb=='Row') 	cell = Sudoku.puzzle[i*9];
				else if (rcb=='Column') cell = Sudoku.puzzle[i];
				else if (rcb=='Block')  cell = Sudoku.puzzle[Math.floor(i/3)*27+(i%3)*3]
				list = Sudoku['get'+rcb+'Cells'](cell);
				rc = testHiddenSubset(list);
				if (rc) return processHiddenResponse(rc);
			}
		}
		return false;
	},
	XYWings:		function() {
		function matchXY(chain) {
			let rc={};
			let first = chain[0];
			let last=chain[chain.length-1];
			let lastNumber=last.cdt;
			let pair,drawing={};
			rc.drawings=[];
			rc.relatedCells =[];
			rc.value=[last.cdt];
			let cdts = Sudoku.puzzle[first.row*9+last.col].domCandidates;
			if (cdts.includes(last.cdt)) {
				for (pair of chain) {
					rc.relatedCells.push(Sudoku.puzzle[pair.row*9+pair.col]);
					if (rc.drawings.length==0)	{
						rc.drawings.push({type:'circle',row:pair.row,col:pair.col,note:last.cdt});
						lastNumber = pair.notes.filter(x => x!=lastNumber)[0];
						drawing={type:'line',point1:{row:pair.row,col:pair.col,note:lastNumber,circle:true}};
					}
					else {
						drawing.point2={row:pair.row,col:pair.col,note:lastNumber,circle:true};
						rc.drawings.push(drawing);
						lastNumber = pair.notes.filter(x => x!=lastNumber)[0];
						drawing={type:'line',point1:{row:pair.row,col:pair.col,note:lastNumber,circle:true}};
					}
				}
				rc.drawings.push({type:'circle',row:pair.row,col:pair.col,note:last.cdt,circle:true});
				rc.affectedCells=[Sudoku.puzzle[first.row*9+last.col]];	
				return rc;
			}
			cdts = Sudoku.puzzle[last.row*9+first.col].domCandidates;
			if (cdts.includes(last.cdt)) {
				for (pair of chain) {
					rc.relatedCells.push(Sudoku.puzzle[pair.row*9+pair.col]);
					if (rc.drawings.length==0)	{
						rc.drawings.push({type:'circle',row:pair.row,col:pair.col,note:last.cdt});
						lastNumber = pair.notes.filter(x => x!=lastNumber)[0];
						drawing={type:'line',point1:{row:pair.row,col:pair.col,note:lastNumber,circle:true}};
					}
					else {
						drawing.point2={row:pair.row,col:pair.col,note:lastNumber};
						rc.drawings.push({row:pair.row,col:pair.col,note:lastNumber});
						lastNumber = pair.notes.filter(x => x!=lastNumber)[0];
						drawing={type:'line',point1:{row:pair.row,col:pair.col,note:lastNumber}};
					}
				}
				rc.drawings.push({type:'circle',row:pair.row,col:pair.col,note:last.cdt});
				rc.affectedCells=[Sudoku.puzzle[last.row*9+first.col]];	
				return rc;
			}
			return false;
		}
		function processResponse(rc) {
			rc.solutionType = 2;
			rc.type = 'XY-Wings';
			rc.cell = rc.affectedCells[0];
			rc.row = rc.cell.row;
			rc.col = rc.cell.col;
			rc.drawings.push({type:'circle',row:rc.cell.row,col:rc.cell.col,note:rc.value[0]});
			rc.text = [[`The highlighted cells with paired chained notes point to a note that can be eliminated`],
					   [`The end of the chains both contain ${rc.value}. Therefore, ${rc.value} in row ${rc.row+1},column ${rc.col+1} is impossible and can be eliminated. `]
					  ];
			return rc;
		}
		let chains = Sudoku.SolverHelpers.getChainedPairedCandidates(3);
		for (let chain of chains) {
			let rc = matchXY(chain);
			if (rc) return processResponse(rc);
		}
		return false;
	},
	xWings:			function() {
		function checkRowPairs(pairs,rc) {
			rc={relatedCells:[],affectedCells:[]};
			let pair1,pair2,list;
			for (let num=1;num<=9;num++) {
				for (let i=0;i<pairs[num].length;i++) {
					pair1=pairs[num][i];
					for (let j=i+1;j<pairs[num].length;j++) {
						pair2=pairs[num][j];
						if (pair1[0].row==pair2[0].row && pair1[1].row==pair2[1].row) {
							list = Sudoku.getRowCells(pair1[0]);
							list = list.concat(Sudoku.getRowCells(pair1[1]));
							for (let item of list) {
								if (item.col==pair1[0].col || item.col==pair1[1].col) continue;
								if (item.col==pair2[0].col || item.col==pair2[1].col) continue;
								if (item.domCandidates.includes(num)) rc.affectedCells.push(item);
							}
						}
						if (rc.affectedCells.length>0) {
							rc.pair1=pair1;
							rc.pair2=pair2;
							rc.relatedCells=list;
							rc.value=[num];
							rc.dir='row';
							return rc;
						}
					}
				}
			}
			return false;
		}
		function checkColumnPairs(pairs,rc) {
			rc={relatedCells:[],affectedCells:[]};
			let pair1,pair2,list;
			for (let num=1;num<=9;num++) {
				for (let i=0;i<pairs[num].length;i++) {
					pair1=pairs[num][i];
					for (let j=i+1;j<pairs[num].length;j++) {
						pair2=pairs[num][j];
						if (pair1[0].col==pair2[0].col && pair1[1].col==pair2[1].col) {
							list = Sudoku.getColumnCells(pair1[0]);
							list = list.concat(Sudoku.getColumnCells(pair1[1]));
							for (let item of list) {
								if (item.col==pair1[0].col || item.col==pair1[1].col) continue;
								if (item.col==pair2[0].col || item.col==pair2[1].col) continue;
								if (item.domCandidates.includes(num)) rc.affectedCells.push(item);
							}
						}
						if (rc.affectedCells.length>0) {
							rc.pair1=pair1;
							rc.pair2=pair2;
							rc.relatedCells=list;
							rc.value=[num];
							rc.dir='column';
							return rc;
						}
					}
				}
			}
			return false;
		}
		function processResponse(rc) {
			function updateDrawings() {
				rc.drawings=[];
				let num=rc.value.join('');
				if (rc.dir=='column')  {
					rc.drawings.push({type:'line',point1:{row:rc.pair1[0].row,col:rc.pair1[0].col,note:num,circle:true},
												  point2:{row:rc.pair1[0].row,col:rc.pair2[0].col,note:num,circle:true}});
					rc.drawings.push({type:'line',point1:{row:rc.pair2[1].row,col:rc.pair1[1].col,note:num,circle:true},
												  point2:{row:rc.pair2[1].row,col:rc.pair2[1].col,note:num,circle:true}});
				}
				else {
					rc.drawings.push({type:'line',point1:{row:rc.pair1[0].row,col:rc.pair1[0].col,note:num,circle:true},
												  point2:{row:rc.pair1[1].row,col:rc.pair1[1].col,note:num,circle:true}});
					rc.drawings.push({type:'line',point1:{row:rc.pair2[0].row,col:rc.pair2[0].col,note:num,circle:true},
												  point2:{row:rc.pair2[1].row,col:rc.pair2[1].col,note:num,circle:true}});
				}
				for (let cell of rc.affectedCells) {
					rc.drawings.push({type:'circle',row:cell.row,col:cell.col,note:num});
				}
			}
			rc.solutionType = 2;
			rc.type = 'X-Wings';
			rc.cell = rc.affectedCells[0];
			rc.row = rc.cell.row;
			rc.col = rc.cell.col;
			rc.text = [[`The highlighted cells contain paired notes in their ${rc.dir} which can eliminate other candidates`],
					   [`The ${rc.dir} contain only two ${rc.value}. Therefore, ${rc.value} in other highlighted cells is impossible and can be eliminated. `]
					  ];
			updateDrawings();		  
			return rc;
		
		}
		let pairs,rc={};
		pairs = Sudoku.SolverHelpers.findLinkedPairs(['Column']);
		rc = checkRowPairs(pairs,rc);
		if (rc) return processResponse(rc);
		pairs = Sudoku.SolverHelpers.findLinkedPairs(['Row']);
		rc = checkColumnPairs(pairs,rc);
		if (rc) return processResponse(rc);
		return false;
	},
	swordfish:		function() {
		function searchRows(pairs,rc) {
			// take pairs  and make chains.
			// compare start and end of chains and pairs for matches;
			rc={relatedCells:[],affectedCells:[]};
			let pair1,pair2,list,chains=[],rows,cols;
			for (let num=1;num<=9;num++) {
				chains=[];
				for (let i=0;i<pairs[num].length;i++) {
					pair1=pairs[num][i];
					for (let j=0;j<pairs[num].length;j++) {
						pair2=pairs[num][j];
						if (pair1[1].row==pair2[0].row)  {
							chains.push([pair1[0],pair1[1],pair2[0],pair2[1]]);
						}
					}
				}
				if (chains.length==0) continue;
				pairs[num]=pairs[num].concat(chains);
				for (let i=0;i<pairs[num].length;i++) {
					pair1=pairs[num][i];
					for (let j=0;j<pairs[num].length;j++) {
						if (i==j) continue;
						pair2=pairs[num][j];
						if (pair1[0].row==pair2[0].row && pair1[pair1.length-1].row==pair2[pair2.length-1].row) {
							rows=[];cols=[];list=[];
							for (let pair of pair1) {cols.push(pair.col);rows.push(pair.row);}
							for (let pair of pair2) {cols.push(pair.col);rows.push(pair.row);}
							rows = [...new Set(rows)];
							cols = [...new Set(cols)];
							for (let row of rows) list = list.concat(Sudoku.getRowCells(Sudoku.puzzle[row*9]));
							//let notIn = [...Array(9).keys()].notIn(cols);
							for (let item of list) {
								if (cols.includes(item.col)) continue;
								//let skip = false;
								//for (let col of cols) if (item.col==col) skip=true;;
								if (item.domCandidates.includes(num)) rc.affectedCells.push(item);
							}
						}
						if (rc.affectedCells.length>0) {
							rc.pairs=pair1.concat(pair2);
							rc.relatedCells=list;
							rc.value=[num];
							rc.dir='row';
							return rc;
						}
					}
				}
			}
			return false;
		}
		function searchCols(pairs,rc) {
			// take pairs  and make chains.
			// compare start and end of chains and pairs for matches;
			rc={relatedCells:[],affectedCells:[]};
			let pair1,pair2,list,chains=[],rows,cols;
			for (let num=1;num<=9;num++) {
				chains=[];
				for (let i=0;i<pairs[num].length;i++) {
					pair1=pairs[num][i];
					for (let j=0;j<pairs[num].length;j++) {
						pair2=pairs[num][j];
						if (pair1[1].col==pair2[0].col)  {
							chains.push([pair1[0],pair1[1],pair2[0],pair2[1]]);
						}
					}
				}
				if (chains.length==0) continue;
				pairs[num]=pairs[num].concat(chains);
				for (let i=0;i<pairs[num].length;i++) {
					pair1=pairs[num][i];
					for (let j=0;j<pairs[num].length;j++) {
						if (i==j) continue;
						pair2=pairs[num][j];
						if (pair1[0].col==pair2[0].col && pair1[pair1.length-1].col==pair2[pair2.length-1].col) {
							rows=[];cols=[];list=[];
							for (let pair of pair1) {cols.push(pair.col);rows.push(pair.row);}
							for (let pair of pair2) {cols.push(pair.col);rows.push(pair.row);}
							rows = [...new Set(rows)];
							cols = [...new Set(cols)];
							for (let col of cols) list = list.concat(Sudoku.getColumnCells(Sudoku.puzzle[col]));
							//let notIn = [...Array(9).keys()].notIn(rows);
							for (let item of list) {
								if (rows.includes(item.row)) continue;
								if (item.domCandidates.includes(num)) rc.affectedCells.push(item);
							}
						}
						if (rc.affectedCells.length>0) {
							rc.pairs=pair1.concat(pair2);
							rc.relatedCells=list;
							rc.value=[num];
							rc.dir='column';
							return rc;
						}
					}
				}
			}
			return false;
		}
		function processResponse(rc) {
			function updateDrawings() {
				rc.drawings=[];
				let num=rc.value.join('');
				if (rc.dir=='column')  {
					for (let i=0;i<rc.pairs.length;i=i+2) {
						rc.drawings.push({type:'line',point1:{row:rc.pairs[i].row,  col:rc.pairs[i].col,note:num,circle:true},
													  point2:{row:rc.pairs[i].row,col:rc.pairs[i+1].col,note:num,circle:true}});
					}
				}
				else {
					for (let i=0;i<rc.pairs.length;i=i+2) {
						rc.drawings.push({type:'line',point1:{row:rc.pairs[i].row,col:rc.pairs[i].col,note:num,circle:true},
													  point2:{row:rc.pairs[i+1].row,col:rc.pairs[i].col,note:num,circle:true}});
					}
				}
				for (let cell of rc.affectedCells) {
					rc.drawings.push({type:'circle',row:cell.row,col:cell.col,note:num});
				}
			}
			rc.solutionType = 2;
			rc.type = 'Swordfish';
			rc.cell = rc.affectedCells[0];
			rc.row = rc.cell.row;
			rc.col = rc.cell.col;
			rc.text = [[`The highlighted cells contain paired notes in their ${rc.dir} which can eliminate other candidates`],
					   [`The paired ${rc.dir}'s contain only two ${rc.value} and form a chain. Therefore, ${rc.value} in other highlighted cells is impossible and can be eliminated. `]
					  ];
			updateDrawings();		  
			return rc;
		}
		let pairs,rc={};
		pairs = Sudoku.SolverHelpers.findLinkedPairs(['Column']);
		rc = searchRows(pairs,rc);
		if (rc) return processResponse(rc);
		pairs = Sudoku.SolverHelpers.findLinkedPairs(['Row']);
		rc = searchCols(pairs,rc);
		if (rc) return processResponse(rc);
		return false;
	},
	chainedPairs:	function() {
		function matchXY(chain) {
			let rc={};
			let first = chain[0];
			let last=chain[chain.length-1];
			let lastNumber=last.cdt;
			let pair,drawing={};
			rc.drawings=[];
			rc.relatedCells =[];
			rc.value=[last.cdt];
			let cdts = Sudoku.puzzle[first.row*9+last.col].domCandidates;
			if (cdts.includes(last.cdt)) {
				for (pair of chain) {
					if (pair.row==first.row && pair.col==last.col) return false;
					rc.relatedCells.push(Sudoku.puzzle[pair.row*9+pair.col]);
					if (rc.drawings.length==0)	{
						rc.drawings.push({type:'circle',row:pair.row,col:pair.col,note:last.cdt});
						lastNumber = pair.notes.filter(x => x!=lastNumber)[0];
						drawing={type:'line',point1:{row:pair.row,col:pair.col,note:lastNumber,circle:true}};
					}
					else {
						drawing.point2={row:pair.row,col:pair.col,note:lastNumber,circle:true};
						rc.drawings.push(drawing);
						lastNumber = pair.notes.filter(x => x!=lastNumber)[0];
						drawing={type:'line',point1:{row:pair.row,col:pair.col,note:lastNumber,circle:true}};
					}
				}
				rc.drawings.push({type:'circle',row:pair.row,col:pair.col,note:last.cdt,circle:true});
				rc.affectedCells=[Sudoku.puzzle[first.row*9+last.col]];	
				return rc;
			}
			cdts = Sudoku.puzzle[last.row*9+first.col].domCandidates;
			if (cdts.includes(last.cdt)) {
				for (pair of chain) {
					if (pair.row==last.row && pair.col==first.col) return false;
					rc.relatedCells.push(Sudoku.puzzle[pair.row*9+pair.col]);
					if (rc.drawings.length==0)	{
						rc.drawings.push({type:'circle',row:pair.row,col:pair.col,note:last.cdt});
						lastNumber = pair.notes.filter(x => x!=lastNumber)[0];
						drawing={type:'line',point1:{row:pair.row,col:pair.col,note:lastNumber,circle:true}};
					}
					else {
						drawing.point2={row:pair.row,col:pair.col,note:lastNumber,circle:true};
						rc.drawings.push(drawing);
						lastNumber = pair.notes.filter(x => x!=lastNumber)[0];
						drawing={type:'line',point1:{row:pair.row,col:pair.col,note:lastNumber,circle:true}};
					}
				}
				rc.drawings.push({type:'circle',row:pair.row,col:pair.col,note:last.cdt});
				rc.affectedCells=[Sudoku.puzzle[last.row*9+first.col]];	
				return rc;
			}
			return false;
		}
		function processResponse(rc) {
			rc.solutionType = 2;
			rc.type = 'Chained Pairs';
			rc.cell = rc.affectedCells[0];
			rc.row = rc.cell.row;
			rc.col = rc.cell.col;
			rc.drawings.push({type:'circle',row:rc.cell.row,col:rc.cell.col,note:rc.value[0]});
			rc.text = [[`The highlighted cells with paired chained notes point to a note that can be eliminated`],
					   [`The end of the chains both contain ${rc.value}. Therefore, ${rc.value} in row ${rc.row+1},column ${rc.col+1} is impossible and can be eliminated. `]
					  ];
			return rc;
		}
		let chains = Sudoku.SolverHelpers.getChainedPairedCandidates(7);
		for (let chain of chains) {
			let rc = matchXY(chain);
			if (rc) return processResponse(rc);
		}
		return false;
	},
	linkedPairs:  function() {
		function matchedEnds(chain,number) {
			function setupDrawing(rc) {
				let firstTime=true;
				for (let pair of rc.relatedCells) {
					if (firstTime)	{
						firstTime=false;
						drawing={type:'line',point1:{row:pair.row,col:pair.col,note:rc.value,circle:true}};
					}
					else {
						drawing.point2={row:pair.row,col:pair.col,note:rc.value,circle:true};
						rc.drawings.push(drawing);
						drawing={type:'line',point1:{row:pair.row,col:pair.col,note:rc.value,circle:true}};
					}
				}
				rc.drawings.push({type:'circle',row:rc.affectedCells[0].row,col:rc.affectedCells[0].col,note:rc.value});
			}
			let rc={};
			let first = chain[0];
			let last=chain[chain.length-1];
			let drawing;
			rc.drawings=[];
			rc.value=[number];
			let cdts = Sudoku.puzzle[first.row*9+last.col].domCandidates;
			let testIfInChain = chain.some(c=>c.row==first.row&&c.col==last.col);
			if (!testIfInChain && cdts.includes(...rc.value)) {
				rc.relatedCells = chain;	
				rc.affectedCells=[Sudoku.puzzle[first.row*9+last.col]];	
				setupDrawing(rc);
				return rc;
			}
			cdts = Sudoku.puzzle[last.row*9+first.col].domCandidates;
			testIfInChain = chain.some(c=>c.row==last.row&&c.col==first.col);
			if (!testIfInChain && cdts.includes(...rc.value)) {
				rc.relatedCells = chain;	
				rc.affectedCells=[Sudoku.puzzle[last.row*9+first.col]];	
				setupDrawing(rc);
				return rc;
			}
			return false;
		}
		function processResponse(rc) {
			rc.solutionType = 2;
			rc.type = 'Linked Candidates';
			rc.cell = rc.affectedCells[0];
			rc.row = rc.cell.row;
			rc.col = rc.cell.col;
			rc.text = [[`The highlighted cells with paired linked notes point to a note that can be eliminated`],
					   [`The ends of the linked pairs both contain ${rc.value}.The value ${rc.value} in row ${rc.row},column ${rc.col} cannot be valid and can be eliminated. `]
					  ];
			return rc;
		}
		let chains = Sudoku.SolverHelpers.getLinkedPairs();
		for (let number=1;number<=9;number++) {
			for (let chain of chains[number]) {
				let rc = matchedEnds(chain,number);
				if (rc) return processResponse(rc);
			}
		}
		return false;
	}
};
Sudoku.SolverHelpers= {
	getPairedCandidates: function() {
		let pairs = [];
		for (let cell of Sudoku.puzzle) {
			let cdts = cell.domCandidates;
			if (cdts.length==2) {
				let pair={row:cell.row,col:cell.col,notes:cdts};
				pair.block=Math.floor(cell.row/3)*3 + Math.floor(cell.col/3);
				pairs.push(pair);
			}
		}
		return pairs;
	},
    getChainedPairedCandidates: function(depth) {
     	function getNextLink(cdt,chain,pairs,depth) {
    		function contains(chain,pair) {
    			for (let pr of chain) {
    				if (pr.row==pair.row && pr.col==pair.col && pr.block==pair.block) return true;
    			}
    			return false;
    		}
    		let last = chain[chain.length-1];
    		let nToL;
    		if (chain.length>1) nToL=[chain[chain.length-2]];
    		else nToL = [{notes:[0,0],row:10,col:10,block:10}];
    		let links=[];
    		let link,ct;
    		for (let pair of pairs) {
    			if (!pair.notes.includes(cdt)) continue;
    			if (pair.equal(nToL)) continue;
    			if (!(pair.row==last.row||pair.col==last.col||pair.block==last.block)) continue; // must be related
    			if (contains(chain,pair)) continue;   // no back tracking...
    			links.push(pair);
    		}
    		if (links.length==0) return false;
    		while (links.length>1) {
    			link= Object.assign([],links.pop());
    			let chn = Object.assign([],chain);
    			ct  = link.notes.filter(item => item !== cdt);
    			link.cdt=ct[0];
    			chn.push(link);
    			createChain(ct[0],chn,pairs,depth);
    		}
    		link= Object.assign([],links.pop());
    		ct  = link.notes.filter(item => item !== cdt);
    		link.cdt=ct[0];
    		chain.push(link);
    		return true;
    	}
        function createChain(cdt,chain,pairs,depth) {	
    		let rc=chain.length>=depth?false:true;
    		while (rc==true) {
    			rc = getNextLink(cdt,chain,pairs,depth);
    			if (rc) {
    				let link = chain[chain.length-1];
    				cdt = link.cdt; // 
    			}
    			if (chain.length>=depth) rc=false;
    		}
    		if (chain.length>2) {
    			let head = chain[0];
    			let cdt  = head.notes.filter(item => item != head.cdt);
    			for (let i=2;i<chain.length;i++) {
    				let foot = chain[i];
    				if (cdt == foot.cdt  && (!(head.row==foot.row||head.col==foot.col))) {
    					chains.push(chain.slice(0,i+1));
    				}	
    			}
    		}
    	}
        let chains =[];	
		let pairs = Sudoku.SolverHelpers.getPairedCandidates();
		for (let pair of pairs) {
			for (let cdt of pair.notes) {
				let pr = Object.assign([],[pair]);
				pr[0].cdt = cdt;
				createChain(cdt,pr,pairs,depth);
			}
		}
		return chains;
	},
	findLinkedPairs: function(rcbList) {
		let pairs=[],cell;
		for (let num = 1;num<=9;num++) {
			let pairNums={};
			for (let i=0;i<9;i++) {
				for (let rcb of rcbList){
					if (rcb=='Row') cell=Sudoku.puzzle[i*9];
					if (rcb=='Column') cell=Sudoku.puzzle[i];
					if (rcb=='Block') cell=Sudoku.puzzle[Math.floor(i/3)*27+(i%3)*3];
					let cells = Sudoku['get'+rcb+'Cells'](cell);
					let p=[];
					for (let cell of cells) {
						if (cell.domCandidates.includes(num)) p.push(cell);
					}
					// eliminate duplicates...
					if (p.length==2) {
						let id = p[0].row*9+p[0].col +81*(p[1].row*9+p[1].col);
						pairNums[id] = p;
					}	
				}
			}
			pairs[num] = Object.values(pairNums);
		}
		return pairs;
	},
	getLinkedPairs: function() {
		function scanPairs(currentChain,pairs,numChains,candidate) {
			if (currentChain.length==6) return false;  // limit chain length to six;
			let lastCellInChain=currentChain[currentChain.length-1];	
			for (let pair of pairs) {
				let rc1 = testPair(lastCellInChain,currentChain, pair[0],pair[1]);
				let rc2 = testPair(lastCellInChain,currentChain, pair[1],pair[0]);
				if (rc1===false && rc2===false) continue;
				let chn = Object.assign([],currentChain);
				chn.push(rc1||rc2);
				getColoringChain(chn,pairs,numChains,candidate);
			}
			return false;
		}
		function testPair(lastCellInChain,currentChain,cell1,cell2) {
			if ((lastCellInChain.row==cell1.row &&   // cell1 matches lastCellInChain
				 lastCellInChain.col==cell1.col) && 			
				(lastCellInChain.row==cell2.row||	
				 lastCellInChain.col==cell2.col||	  // cell2 	
				 lastCellInChain.block==cell2.block)) {
				
				for (let c of currentChain) {			// cell2 not already in chain.
					if (c.row==cell2.row && c.col==cell2.col) 
						return false;
				}
				return cell2;
			}
			return false;
		}
		function getColoringChain(currentChain,pairs,numChains,candidate) {
			scanPairs(currentChain,pairs,numChains,candidate);
			if (currentChain.length<4) return;  // links must be at least 4 long.
			let id1,id2,len = currentChain.length;
			while (len>=4) {					// Geneate all possible currentChain combinations.
				for (let i=0;i<len-2;i++) {
					let chn = currentChain.slice(i,len);
					if (chn.length%2!=0) continue;  // only even number of numChains.
					if (chn.length>6)    continue;  // lets put a reasonable limit on chains.
					id1 =  chn[0].row*9     + chn[0].col+       (chn[chn.length-1].row+1)*1000+(chn[chn.length-1].col+1)*100;
					id2 = (chn[0].row+1)*1000+(chn[0].col+1)*100+chn[chn.length-1].row*9+      chn[chn.length-1].col;
					if (numChains[id2]) continue;
					numChains[id1] = chn;
				}
				len--;
			}
		}
		let chains = {},numChains={};
		let pairs = Sudoku.SolverHelpers.findLinkedPairs(['Row','Column','Block']);
		for (let i=1;i<=9;i++) {
			let numPairs = pairs[i];
			numChains= {};
			for (let pair of numPairs) {
				getColoringChain([pair[0]],numPairs,numChains,i);
				getColoringChain([pair[1]],numPairs,numChains,i);
			}
			chains[i] = Object.values(numChains);
		}
		return chains;
	},
};
Sudoku.showOptionsDialog = function() {
 	function setOption(id,dataID,value) {
		let selector = document.getElementById(id);
		let selectedValue = selector.querySelector(".selected-value");
		let li = selector.querySelector(`[data-${dataID}="${value}"]`);
		if (!li) li = selector.querySelector('li');
		selectedValue.innerHTML=li.querySelector('label').innerHTML;
		selector.querySelectorAll('li').forEach(op => {op.classList.remove('active');});
		li.classList.add('active');
	}
	function getOption(id,dataID) {
		let selector = document.getElementById(id);
		let li = selector.querySelector(`li.active`);
		if (li) return li.dataset[dataID];
		else {
			li = selector.querySelector('li');
			li.classList.add('active');
			return li.dataset[dataID];
		}
	}
	let self = Sudoku;
	setOption('optionDifficulty','difficulty',self.difficulty);
	setOption('optionPencilNotes','pencilnotes',self.showPencilNotes);
	setOption('optionSize','size',localStorage.getItem('optionSize')||'medium');
	setOption('optionTheme','theme',localStorage.getItem('optionTheme')||'light');
	document.getElementById("optionsOKButton").addEventListener('click', function() {
        self.difficulty = getOption('optionDifficulty','difficulty');
        self.showPencilNotes = getOption('optionPencilNotes','pencilnotes');
		if (self.showPencilNotes != "none")  {
			document.getElementById("btnP").style.display="";
			document.querySelectorAll('.cell').forEach((c)=>{
				if (c.puzCell.domValue==' ') c.classList.remove('noPencils');
			});
		}
		else if (self.showPencilNotes == "none") {
			document.querySelectorAll('.cell').forEach((c)=>c.classList.add('noPencils'));
			document.getElementById("btnP").style.display='none';
		}
		if (self.showPencilNotes == "filled") {
			self.undoList.push([]);
			self.updateDomCandidates();
		}
		else if (self.showPencilNotes == "unfilled" || self.showPencilNotes == "none") {
			for (let cell of Sudoku.puzzle) cell.domCandidates=[];
			document.querySelectorAll('.pencil').forEach((p)=> p.innerText=" ");
		}
		let size = getOption('optionSize','size');
		let theme= getOption('optionTheme','theme');
		document.documentElement.setAttribute('data-number',size);
		document.documentElement.setAttribute('data-theme',theme);
        localStorage.setItem('difficulty', self.difficulty);
        localStorage.setItem('showPencilNotes', self.showPencilNotes);
		localStorage.setItem('optionSize',size);
		localStorage.setItem('optionTheme',theme);
        document.getElementById("optionsDialog").close();
    });
    document.getElementById("optionsCancelButton").addEventListener('click', function() {
        document.getElementById("optionsDialog").close();
    });
    document.getElementById("optionsDialog").showModal();
};
Sudoku.newGame = function() {
	Sudoku.difficulty 	   = localStorage.getItem('difficulty') || 'medium';
	Sudoku.showPencilNotes = localStorage.getItem('showPencilNotes') || 'filled';
	Sudoku.generateHTML();
	Sudoku.addPuzzle(Sudoku.generatePuzzle(Sudoku.difficulty ));
	Sudoku.initializeEvents(true);
	let rc = Sudoku.ratePuzzle();
	if (this.showPencilNotes != "filled") {
			Sudoku.undoList.push([]);
			for (let cell of Sudoku.puzzle) cell.domCandidates=[];
			document.querySelectorAll('.pencil').forEach((p)=> p.innerText=" ");
			Sudoku.undoList.pop();
	}
	Sudoku.undoList.push([]);
	return rc;	
};
Sudoku.initializeEvents = function(newPuzzle) {
	function setupOptionsSelect() {
		const customSelects = document.querySelectorAll(".custom-select");
		for (let customSelect of customSelects) {
			let selectBtn = customSelect.querySelector(".select-button");
			let selectedValue = customSelect.querySelector(".selected-value");
			let optionsList = customSelect.querySelectorAll(".select-dropdown li");
			selectBtn.addEventListener("click", () => {
				let active = customSelect.classList.contains('active');
				for (let cs of customSelects) {
					cs.classList.remove('active');
					cs.querySelector(".select-button").setAttribute("aria-expanded","false");
				}
				if (active==false) {
					customSelect.classList.toggle("active");
					selectBtn.setAttribute("aria-expanded", "true");
				}
			});
			optionsList.forEach(option => {
				function handler(e) {
					// Click Events
					e.preventDefault();
					if(e.type === "click" && e.clientX !== 0 && e.clientY !== 0) {
						selectedValue.innerHTML = this.children[1].innerHTML;
						customSelect.classList.remove("active");
						optionsList.forEach(op => {op.classList.remove('active');});
						option.classList.add('active');
					}
					// Key Events
					if(e.key === "Enter") {
						selectedValue.innerHTML = this.children[1].innerHTML;
						customSelect.classList.remove("active");
						optionsList.forEach(op => {op.classList.remove('active');});
						option.classList.add('active');
					}
				}
				option.addEventListener("keyup", handler);
				option.addEventListener("click", handler);
			});
		}
	}
	function handleCellClick(e) {
		if (self.active.domCell == e.target) return false;
		let cell = e.currentTarget.puzCell;
		self.active = cell;
		document.querySelectorAll('.active, .related, .matched').forEach(c=>c.classList.remove('active','related','matched'));
//		for (c of self.puzzle) {c.domCell.classList.remove('active','related','matched')};
		if (!document.querySelector('.hints:not(.keepHint)'))
			document.querySelector('.hints').innerHTML = '';
		cell.domCell.classList.add('active');
		if (cell.domValue==' '){
			for (let c of self.getRelatedCells(cell)) if (c!=cell) c.domCell.classList.add('related');
		}
		else {
			for (let c of self.puzzle) {
				if (c.domValue == cell.domValue && c!=cell) c.domCell.classList.add('matched');
				else {
					let cdts = c.domCandidates;
					if (cdts.includes(cell.domValue)) {
						let pencils = c.domCell.querySelectorAll('.pencil');
						pencils[cell.domValue-1].classList.add('matched');
					}	
				}					
			}
		}
		if (document.querySelector('.numbers').classList.contains('pencilButtons')) {
			turnOnPencilNumbers();
		}	
	}
	function turnOffPencilNumbers() {
		let numbers = document.querySelector('.numbers');
		numbers.classList.remove('pencilButtons');
		for (let num of numbers.children) num.classList.remove('pencilButtonActive');
	}
	function turnOnPencilNumbers() {
		let cell = self.active;
		let numbers = document.querySelector('.numbers');
		numbers.classList.add('pencilButtons');
		for (let num of numbers.children) num.classList.remove('pencilButtonActive');
		for (let num of cell.domCandidates) {
			numbers.children[num-1].classList.add('pencilButtonActive');
		}
	}
	function numClicked(e) {
		self.undoList.push([]);
		let num = parseInt(e.currentTarget.innerText)||' ';
		let cell = self.active;
		if (document.querySelector('.numbers').classList.contains('pencilButtons')) {
			let cdts = cell.domCandidates;
			let ndx = cdts.indexOf(num);
			if (ndx==-1) cdts.push(num);
			else cdts.splice(ndx,1);
			cell.domCandidates=cdts;
			turnOnPencilNumbers();
		}
		else {
			if (cell.domValue==' ') {
				cell.domValue = num;
				cell.domCandidates=[];
				if (Sudoku.puzzle.every(cell=>cell.domValue!=' ')) Sudoku.animateFinish();
			}
			else {
				cell.domValue = ' ';
				let cdts = cell.domCandidates;
				let ndx  = cdts.indexOf(num);
				if (ndx!=-1) {
					cdts.splice(ndx,1);
					cell.domCandidates=cdts; 
				}
			}				
			self.updateDomCandidate(cell);
		}	
	}
	function undoFunction() {	
		if (self.undoList.length==0) {
			self.undoList.push([]);
			return;
		}
		let undoList = self.undoList.pop();
		undoList.reverse();
		for (let item of undoList) {
			let status = item.cell.status;
			item.cell.status='undo';
			if (item.type=='v') {
				item.cell.domValue=item.value;
			}
			else {
				item.cell.domCandidates=item.value;
			}
			item.cell.status=status;
		}	
	}
	function checkForErrors() {
		function displayError(cell,message) {
			cell.domCell.click();  // set focus
			document.querySelector('.hints').innerHTML =
				`<h4>Error:</h4> ${message} in row ${cell.row+1}, column ${cell.col+1}.  <button id="fixError">Fix</button>`;
			document.getElementById('fixError').addEventListener('click',fixErrors);
		}
		function getCandidates(cell) {
			let domCandidates = [1,2,3,4,5,6,7,8,9];
			let related = self.getRelatedCells(cell);
			for (let c of related) {
				if (c==cell) continue;
				let value = c.domValue;
				let ndx = domCandidates.indexOf(value);
				if (ndx!=-1) domCandidates.splice(ndx,1);
			}
			return domCandidates;
		}
		function fixErrors() {
			let cell = document.querySelector('.active').puzCell;
			cell.domValue = ' ';
			cell.domCandidates=getCandidates(cell);
			document.querySelector('.hints').innerHTML = '';
		}
		for (let i=0;i<81;i++) {
			let cell = self.puzzle[i];
			if (cell.initialValue==' ' && cell.domValue==' ') continue;
			if (cell.solutionValue!=cell.domValue) {
				displayError(cell,"Value is incorrect");
				return true;
			}
		}
		for (let i=0;i<81;i++) {
			let cell = self.puzzle[i];
			if (cell.domValue==' ') {
				let domCandidates = getCandidates(cell);
				let rc = cell.domCandidates.filter(x=>!domCandidates.includes(x));
				if (rc.length>0){
					displayError(cell,"Pencil value is incorrect");
					return true;
				}
			}
		}
		document.querySelector('.hints').innerHTML =
				`<h4>Note:</h4> No errors found.`;
		return false;
	}
	function keyboardHandler(event) {
		for (let d of document.querySelectorAll('dialog')) {if (d.open) return;}
        const key = event.key;
		let   cell = self.active;
		if (key>=1&& key<=9) {
			let num = document.getElementById("btn"+key);
			numClicked({target:num,currentTarget:num});
		}
		let row = cell.row;
		let col = cell.col;
		if (key=='ArrowLeft')   if (col>0) col--;
		if (key=='ArrowRight')  if (col<9) col++;
		if (key=='ArrowUp')  	if (row>0) row--;
		if (key=='ArrowDown')  if (row<9) row++;
		cell = Sudoku.puzzle[row*9+col];
		handleCellClick({target:cell.domCell,currentTarget:cell.domCell});
	}
	function menuHandler(e) {
		let btn = e.currentTarget;
		let menu= btn.dataset.button;
		switch (menu) {
			case "new":
				self.newGame();
				break;
			case "undo":
				undoFunction();
				break;
			case "check":
				checkForErrors();
				break;
			case "hint":
				self.getHint();
				break;
			case "settings":
				self.showOptionsDialog();
				break;
		}
	}
	let self = this;
	if (newPuzzle===true) {
		this.domCells = document.querySelectorAll('.cell');
		this.active = this.domCells[0].puzCell;
		this.domCells.forEach(cell=>{
			cell.addEventListener("click",handleCellClick);
			cell.addEventListener("focus",handleCellClick);
		});
		return;
	}
	document.querySelector('#btnP').addEventListener('click',e=>{
		if (document.querySelector('.numbers').classList.contains('pencilButtons')) {
				turnOffPencilNumbers();
		}
		else turnOnPencilNumbers();
	});
	let nums = 	document.querySelectorAll('.numbers button');
	for (let i=0;i<9;i++) {
		nums[i].addEventListener('click',numClicked);
	}
	document.querySelectorAll('.menu button').forEach((btn)=>{btn.addEventListener('click',menuHandler);});
	setupOptionsSelect();
	document.documentElement.setAttribute('data-theme', (localStorage.getItem('optionTheme')||'light'));
	document.documentElement.setAttribute('data-number',(localStorage.getItem('optionSize') ||'medium'));
	self.showPencilNotes = localStorage.getItem('showPencilNotes') || "unfilled";
	document.addEventListener('contextmenu', function(e) {e.preventDefault();});
    document.addEventListener("keydown", keyboardHandler);
};
// This debfines the Exact Cover Solver Object
Sudoku.solver = {
	_TYPE_ROW: 0,
	_TYPE_COL: 	1,
	_TYPE_BLOCK: 2,
	_TYPE_CELL: 3,
	init: function() {
		this.solution = [];
		this.solutionCounter = 0;
		this.SolutionSets = [];
		this.ElapsedTime = 0;
		this.root = null;
		this.matrix = [];
	},
	run: function(initialMatrix) {
		var ds = new Date();
		this.solutionCounter = 0;
		this.SolutionSets = [];
		this.createMatrix(initialMatrix, true);
		//this.printMatrix();
		this.createDoubleLinkedLists();
		this.search(0);
		var de = new Date();
		this.ElapsedTime = de - ds;
	},
	createMatrix: function(cells) {
	    var d,r,c,prefill;
		if(cells != null) {
			prefill = [];
			var count = 0;
			for( r = 0; r < 9; r++) {
				for(c = 0; c < 9; c++) {
					if(cells[r * 9 + c] > 0) {
						var pfw = new Array(3);
						pfw[0] = cells[r * 9 + c];
						pfw[1] = r;
						pfw[2] = c;
						prefill[count] = pfw;
						count++;
					}
				}
			}
		}
		// the matrix has the following dimensions
		// rows: number of cells (n*n) multiplied by number of possible digits (n)
		// columns: number of columns plus number of rows plus number of blocks (3*n)
		//          multiplied bz number of different digits (n) plus number of cells (n*n)
		//this.matrix = new Array(729*324);
		this.matrix = [];
		// iterate over all the possible digits d
		for(d = 0; d < 9; d++) { // iterate over all the possible rows r
			for(r = 0; r < 9; r++) { // iterator over all the possible columns c
				for(c = 0; c < 9; c++) {
					if(!this.cellIsFilled(d, r, c, prefill)) {
						var rowIndex = (c + (9 * r) + (9 * 9 * d)) * 324;
						// there are for 1's in each row, one for each constraint
						var blockIndex = (Math.floor(c / 3) + (Math.floor(r / 3) * 3));
						var colIndexRow = 27 * d + r;
						var colIndexCol = 27 * d + 9 + c;
						var colIndexBlock = 27 * d + 18 + blockIndex;
						var colIndexSimple = 27 * 9 + (c + 9 * r);
						// fill in the 1's
						this.matrix[rowIndex + colIndexRow] = 1;
						this.matrix[rowIndex + colIndexCol] = 1;
						this.matrix[rowIndex + colIndexBlock] = 1;
						this.matrix[rowIndex + colIndexSimple] = 1;
					}
				}
			}
		}
		return;
	},
	cellIsFilled: function(digit, row, col, prefill) {
		var cellIsFilled = false;
		if(prefill != null) {
			for(var i = 0; i < prefill.length; i++) {
				var d = prefill[i][0] - 1;
				var r = prefill[i][1];
				var c = prefill[i][2];
				// calculate the block indices
				var blockStartIndexCol = Math.floor(c / 3) * 3;
				var blockEndIndexCol = blockStartIndexCol + 3;
				var blockStartIndexRow = Math.floor(r / 3) * 3;
				var blockEndIndexRow = blockStartIndexRow + 3;
				if(d != digit && row == r && col == c) {
					cellIsFilled = true;
				} else if((d == digit) && (row == r || col == c) && !(row == r && col == c)) {
					cellIsFilled = true;
				} else if((d == digit) && (row > blockStartIndexRow) && (row < blockEndIndexRow) && (col > blockStartIndexCol) && (col < blockEndIndexCol) && !(row == r && col == c)) {
					cellIsFilled = true;
				}
			}
		}
		return cellIsFilled;
	},
	createDoubleLinkedLists: function() {
	    var colElement;
		this.root = new Sudoku.solver.Header();
		// create the headers
		var currentHeader = this.root;
		for(var col = 0; col < 324; col++) { // create the header name
			var info = new Sudoku.solver.HeaderInfo();
			if(col < 243) { // which digit this column covers?
				var digit = Math.floor(col / (27)) + 1;
				info.digit = digit;
				// is it for a row, column or block?
				var index = col - (digit - 1) * 27;
				if(index < 9) {
					info.type = Sudoku.solver._TYPE_ROW;
					info.position = index;
				} else if(index < 18) {
					info.type = Sudoku.solver._TYPE_COL;
					info.position = index - 9;
				} else {
					info.type = Sudoku.solver._TYPE_BLOCK;
					info.position = index - 18;
				}
			} else {
				info.type = Sudoku.solver._TYPE_CELL;
				info.position = col - 243;
			}
			currentHeader.right = new Sudoku.solver.Header();
			currentHeader.right.left = currentHeader;
			currentHeader = currentHeader.right;
			currentHeader.info = info;
			currentHeader.header = currentHeader;
		}
		currentHeader.right = this.root;
		this.root.left = currentHeader;
		// iterate over all the rows
		for(var row = 0; row < 729; row++) { // iterator over all the columns
			currentHeader = this.root.right;
			var lastCreatedElement = null;
			var firstElement = null;
			for(col = 0; col < 324; col++) {
				if(this.matrix[row * 4 * 81 + col] == 1) { // create a new data element and link it
					colElement = currentHeader;
					while(colElement.down != null) {
						colElement = colElement.down;
					}
					colElement.down = new Sudoku.solver.Cell();
					if(firstElement == null) {
						firstElement = colElement.down;
					}
					colElement.down.up = colElement;
					colElement.down.left = lastCreatedElement;
					colElement.down.header = currentHeader;
					if(lastCreatedElement != null) {
						colElement.down.left.right = colElement.down;
					}
					lastCreatedElement = colElement.down;
					currentHeader.CellCount++;
				}
				currentHeader = currentHeader.right;
			}
			// link the first and the last element
			if(lastCreatedElement != null) {
				lastCreatedElement.right = firstElement;
				firstElement.left = lastCreatedElement;
			}
		}
		currentHeader = this.root.right;
		// link the last column elements with the coresponding headers
		for(var i = 0; i < 324; i++) {
			colElement = currentHeader;
			while(colElement.down != null) {
				colElement = colElement.down;
			}
			colElement.down = currentHeader;
			currentHeader.up = colElement;
			currentHeader = currentHeader.right;
		}
		return;
	},
	search: function(k) { // Abbruchbedingung
		if(this.root.right == this.root) {
			return true;
		}
		var c = this.chooseColumn();
		this.coverColumn(c);
		var r = c.down;
		while(r != c) {
			if(k < this.solution.length) {
				this.solution.pop();
			}
			this.solution[k] = r;
			var j = r.right;
			while(j != r) {
				this.coverColumn(j.header);
				j = j.right;
			}
			if(!this.search(k + 1)) return false;
			// are r and c realy overwritten here??
			var r2 = this.solution[k];
			//c = r.header;
			var j2 = r2.left;
			while(j2 != r2) {
				this.uncoverColumn(j2.header);
				j2 = j2.left;
			}
			r = r.down;
			// here we can distinguis the different solutions
			if(k == 9 * 9 - 1) {
				this.printSolution();
				if(this.solutionCounter >= 2) {
					return false;
				}
				this.solutionCounter++;
			}
		}
		this.uncoverColumn(c);
		return true;
	},
	printSolution: function() { // this function does not actually "print" the solution but merely saves the solution as a string in this.SolutionSets!!!  
		this.Results = new Array(9 * 9);
		var j = 0;
		while(j < this.solution.length) {
			var digit = -1;
			var cell = -1;
			var element = this.solution[j];
			j++;
			var next = element;
			do {
				if(next.header.info.type == Sudoku.solver._TYPE_ROW) {
					digit = next.header.info.digit;
				} else if(next.header.info.type == Sudoku.solver._TYPE_CELL) {
					cell = next.header.info.position;
				}
				next = next.right;
			} while (element != next);
			this.Results[cell] = digit;
		}
		// Show the solution
		this.SolutionSets[this.solutionCounter] = "";
		for(var i = 0; i < this.Results.length; i++) {
			var tr = this.Results[i];
			if(typeof(tr) == "undefined") tr = "-";
			this.SolutionSets[this.solutionCounter] += tr;
		}
	},
	chooseColumn: function() { // its mostly efficient to always choose the column with the smales size      
		var h = this.root.right;
		var smalest = h;
		while(h.right != this.root) {
			h = h.right;
			if(h.CellCount < smalest.CellCount) {
				smalest = h;
			}
		}
		return smalest;
	},
	coverColumn: function(column) {
		column.right.left = column.left;
		column.left.right = column.right;
		var i = column.down;
		while(i != column) {
			var j = i.right;
			while(j != i) {
				j.down.up = j.up;
				j.up.down = j.down;
				j.header.CellCount--;
				j = j.right;
			} //end while(j != i) 
			i = i.down;
		} //end while(i != column)
	}, //end fuctnion
	uncoverColumn: function(column) {
		var i = column.up;
		while(i != column) {
			var j = i.left;
			while(j != i) {
				j.header.CellCount++;
				j.down.up = j;
				j.up.down = j;
				j = j.left;
			} // end while(j != i)
			i = i.up;
		} // end while(i != column)
		column.right.left = column;
		column.left.right = column;
	}, // end function
	Cell: function() {
		this.left = null;
		this.right = null;
		this.up = null;
		this.down = null;
		this.header = null; // pointer to Header
	},
	Header: function() {
		this.CellCount = 0;
		this.info = null; // pointer to HeaderInfo
	},
	HeaderInfo: function() {
		this.type = -1;
		this.digit = -1;
		this.position = -1;
	},
		solve: function(data) {
		data = data.replace(/ /g, "-");
		var matrix = data.split("");
		Sudoku.solver.init();
		Sudoku.solver.run(matrix);
		//console.log(this.SolutionSets );
		if (this.SolutionSets.length==0) return false;
		else return this.SolutionSets[0];
	},
};
//Sudoku.solver.solve('    5 6     4  2 9 2   973 1  8       3 9 1 88 524 3   5 97  4   7    6 9   2   1');
/*  Test Cases 
NakedSubset ="386471529..4532681251896347.....58.65.82631.4.....8235...1847538..659412145327968".replaceAll('.',' ');
HiddenSubset="6278941534351..9281892..746...312..9893...2142..489..5.....8561........7.685.14.2".replaceAll('.',' ');
BlockRowCol ="....7.9.89.7.56.24....937.5..8..7.4946...9..7379..2.5..4176..937.39..4..896...57.".replaceAll('.',' ');
BlockAndBlock=".2..37.8...829.3.73...81.2.235179864...842..3984356172.937....5152.637.8.4.....3.".replaceAll('.',' ');
XYWings ="357891264...2458732843679151..5.47...7361254...57.91...6912..575.2976.817..45.692".replaceAll('.',' ');
Coloring="..173645876485.3.95384.9.67..367...4.479.36.51.6.4897361.38.7.237..6.8.1482197536".replaceAll('.',' ');
xwings = "9.587..6.7.69.1..81.8...97.3627.8..9817.9.23.5943..78.481..76936794835..253169847".replaceAll('.',' ');
swordfish=".7.2.1.6.6.58.7..11..654..78915436725..176..97639281542..415..6.5..69218916.82.4.".replaceAll('.',' ');
S2015 = ".89.....6.1....2.86241...3735.7....2....137..97.....6.....918....54..6..846.25...".replaceAll('.',' ');
chainedPairs = "657134289329875164148.9.537.659..8.3..1.5.6.2.34.8.7.55.376.421.165..378.72.1.956".replaceAll('.',' ');
SFTest ='869213457417586239 5 74916879 85 613 8 6 794     9 78 9     876 78 6  94   978 21'
error1 =' 1   35  95  7 1 4 7    8 2 4  519   2    6455 74 6 81    6  5 48      67653 9 18'
error2 =' 1 2  35 57 4 9  8 9   57  62  9         35      6 1  7  1 896      6  1  59   83'
error3 ='275943168641827593 8 165247    5  1215 28 374 2 7 1 56 12 7 6 5   5124 95     721'
error4='781 2 3  54238 1  6394 12 8956812 3 4786935212137  68939 2   1 86413   212      3'
error5='3 51    426945 1  1 4   5  5326 491 948 1  5 61759  4 4518  329723941  5896235471'
error6=' 4  28 1 876  32942917463851  8795    9  4   4  2 5   9  4   52 2468             '
error7='194 8    5 89 4 1 6 2   849827456391961  3458453891267 49    8 716 4893  85  91 4'
error8='050490731900300658000065942039000576000703189817659324000980265002500093090236017'.replaceAll('0',' ');
Sudoku.generateHTML();
Sudoku.initializeEvents();
//Sudoku.addPuzzle(error8);
//Sudoku.addPuzzle(Sudoku.generatePuzzle('easy'));
*/
Sudoku.initializeEvents(); 
Sudoku.newGame();
Sudoku.test = async function() {
	function delay(seconds) {
		return new Promise(resolve=>setTimeout(resolve, seconds * 1000));
	} 
	for (let i=1;i<=5000;i++) {
		console.log("Game "+i);
		if (!Sudoku.newGame()) break;
		await delay(0.1);
	}
};