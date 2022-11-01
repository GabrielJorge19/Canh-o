class Canhao{
	constructor(ctx, width, height){
		this.state = "off";
		this.angle = 0;
		this.angleTarget = 0; 
		this.angleSpeed = .2;
		this.timeSpeed = 5;
		this.sizeAndPosition = {
			width: width * 0.105,
			height: height * 0.13,
			x: width/2,
			y: height * 1.13,
			positionOn: height - 15,
			positionOff: height * 1.13,
			centerX: width * 0.105*.5,
			centerY: height * 0.13*0.75,
		}
		this.ctx = ctx;
		this.img = new Image();
		this.img.src = `./icons/canhao.png`;
		this.xxxx = this;
		this.objs = [];
		this.frame = 0;
		this.frameWait = 10;
		this.frameWaitCallback = () => {console.log("Wait callback")};
	}

	shotHelps(helps){
		this.objs = this.objs.concat(helps);
		if(this.state == "off") this.state = "goingUp";
	}

	spinTo(angle, callback){
		this.angleTarget = angle;
		this.onAngleTarget = callback;
		this.state = "spining";
	}

	spinCannon(){
		let angleVariation = this.xxxx.angleTarget - this.xxxx.angle;
		let direction = (angleVariation > 0)?1:-1;

		angleVariation = (angleVariation * direction > this.xxxx.angleSpeed)?this.xxxx.angleSpeed:angleVariation * direction;
		this.xxxx.angle += angleVariation * direction * this.timeSpeed;
			
		if(this.xxxx.angleTarget == this.xxxx.angle) this.state = "onAngleTarget";
	}

	render(){
		switch(this.state){
			case "off":
			break;
			case "goingUp":
				this.turnOnAndOff(true);
			break;
			case "goingDown":
				this.turnOnAndOff(false);
			break;
			case "spining":
				this.spinCannon();
			break;
			case "on":
				if(this.objs.length > 0){
					let angle = Math.floor(Math.random() * 90 - 45);
					this.spinTo(angle, this.fire);
				} else {
					this.spinTo(0, () => {
						this.state = "goingDown";
					})
				}
			break;
			case "onAngleTarget":
				this.state = "standBy";
				this.onAngleTarget();
			break;
			case "standBy":
			break;
			case "out":
				if(this.frameWait == 0){
					this.frameWaitCallback();
				} else {
					this.frameWait--;
				}
			break;
			default:
				console.log("Default: Canhao state is " + this.state);
			break;
		}

		this.drawCannon();
	}
		
	fire(){	
		this.objs[0].throw(this.angle);
		this.objs.shift();
		this.wait(10, () => {
			this.state = "on";
		});
	}

	wait(frameCount, callback){
		this.state = 'out';
		this.frameWait = frameCount;
		this.frameWaitCallback = callback;
	}
		
	drawCannon(){
		let angle = this.xxxx.angle * Math.PI / 180;
		let x = Math.cos(angle) * this.xxxx.sizeAndPosition.x + Math.sin(angle) * this.xxxx.sizeAndPosition.y - this.xxxx.sizeAndPosition.centerX;
		let y = Math.cos(angle) * this.xxxx.sizeAndPosition.y - Math.sin(angle) * this.xxxx.sizeAndPosition.x - this.xxxx.sizeAndPosition.centerY;
	
		this.ctx.save();
	    this.ctx.rotate(angle);
		this.ctx.drawImage(this.xxxx.img, x, y, this.xxxx.sizeAndPosition.width, this.xxxx.sizeAndPosition.height); 	
	    this.ctx.rotate(-angle);
	    this.ctx.restore();
	}
	
	turnOnAndOff(direction){
		let distance = (direction)?this.xxxx.sizeAndPosition.y - this.xxxx.sizeAndPosition.positionOn:this.xxxx.sizeAndPosition.positionOff - this.xxxx.sizeAndPosition.y;

		if(distance != 0){
			let sentido = (direction)?1:-1;
			let speedY = this.timeSpeed;
			let v = (distance < speedY)?distance:speedY;
			this.xxxx.sizeAndPosition.y -= v*sentido;
		} else {
			this.state = (direction)?"on":"off";
		}
	}
}