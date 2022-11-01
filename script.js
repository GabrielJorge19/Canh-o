class helper { 
	constructor(){
		this.canvas = document.getElementById("canvas");
		this.ctx = canvas.getContext("2d");
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.mapScale = 1.5;
		this.borders = {
			top: (1- this.mapScale) * this.height,
			right: this.width * this.mapScale,
			left: (1- this.mapScale) * this.width,
 			bottom: this.height * this.mapScale,
		};

		this.canhao = new Canhao(this.ctx, this.width, this.height);

		this.speed = .2;
		this.timeSpeed = 1;
		this.helpTypes = ["text", "audio", "video", "music", "photo"];
		this.icons = []; this.helpTypes.map((name) => {
			let image = new Image();
			image.src = `./icons/${name}.png`;
			this.icons[name] = image;
		})

		this.objs = [];
		this.helps = [];
		this.fps = {
			running: false,
			runState: false,
			frameRate: 30,
			fpsCount: 0,
		};

		document.getElementById('canvas').addEventListener('click', (event) => {
			const rect = this.canvas.getBoundingClientRect();
			const x = (event.clientX - rect.left) * this.width / (rect.width - 2);
			const y = (event.clientY - rect.top) * this.height / (rect.height - 2);
			this.checkClick(x, y);
		});
	}

	createHelp(refs){
		refs.map((ref) => {
			let helpOptions = {
				position: {
					x: this.width/2,
					y: this.height - 15,
				},
				ref: ref,
				startFrame: this.fps.fpsCount,
			}

			let help = new Help(helpOptions);
			this.objs.push(help);
		})
	}

	renderHelps(){
		this.objs.map((obj) =>{
			if(obj.visible){
				this.ctx.beginPath();
				this.ctx.arc(obj.position.x, obj.position.y, obj.scale * obj.radius, 0, 2 * Math.PI);
				this.ctx.fillStyle = "#fff";
				//this.ctx.shadowBlur = 10;
				this.ctx.shadowColor = '#eb8c34';
				this.ctx.fill();
				this.ctx.shadowBlur = 0;

				let imageSize = obj.scale * 30;
				this.ctx.drawImage(this.icons[obj.ref.type], obj.position.x-imageSize/2, obj.position.y-imageSize/2, imageSize, imageSize);
			}
		})
	}

	move(){
		this.objs.map((obj) =>{
			let x = obj.position.x + obj.speed[0] * this.speed;
			let y = obj.position.y + obj.speed[1] * this.speed;
			
			x = (x < this.borders.left)?x+(this.mapScale*this.width):x;
			x = (x > this.borders.right)?x-(this.mapScale*this.width):x;

			y = (y < this.borders.top)?y+(this.mapScale*this.height):y;
			y = (y > this.borders.bottom)?y-(this.mapScale*this.height):y;

			obj.position = {x: x, y: y};
		});
	}

	checkClick(x, y){
		this.objs.map((obj) => {
			let distance = this.calculateDistance([x, y], [obj.position.x, obj.position.y]);
			if(distance < obj.radius) obj.click();
		})
	}

	calculateDistance(place1, place2){
		let distanceX = (place1[0] > place2[0])?place1[0] - place2[0]:place2[0] - place1[0];
		let distanceY = (place1[1] > place2[1])?place1[1] - place2[1]:place2[1] - place1[1];
		return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
	}

	render(){
		this.ctx.fillStyle = "#222";
		this.ctx.fillRect(0, 0, this.width, this.height);
		
		this.objs.map((obj) => {
			obj.animate();
		})
		this.move();
		this.renderHelps();
	}

	shotHelps(helps){
		if(this.fps.running == false) this.run();
		
		this.helps = this.helps.concat(helps);
		this.canhao.shotHelps(helps);
	}


	// Fps

	run(helps){
		this.fps.runState = true;
		if(!this.fps.running) this.fpsControl();
		this.fps.running = true;

	}

	stop(){
		this.fps.runState = false;
		this.fps.running = false;
	}	

	fpsControl(running = this.fps.running){
		
		this.fps.fpsCount++;
		this.render();
		this.canhao.render();

		if(this.fps.fpsCount % 1000 == 0){
			console.log("Tempo de execução: " + this.fps.fpsCount / this.fps.frameRate + 's.');
		}

		if(this.fps.runState){
			let esse = this;
			setTimeout(() => {esse.fpsControl(false)}, 1000/esse.fps.frameRate);
		}
	}
}

let h = new helper;
h.createHelp(helps);
h.shotHelps(h.objs);
let esse = h;
