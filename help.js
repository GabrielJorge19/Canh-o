class Help{
	constructor(options){
		this.ref = options.ref;
		this.visible = false;
		this.state = 'ready';
		this.timeSpeed = 3;
		this.speed = [0, 0];
		this.position = options.position;
		this.radius = 25;
		this.initScale = .5;
		this.scale = .5;
		this.endScale = 1;
		this.timeToScale = 200;
		this.startAnimation = 0;
		this.frame = 0;
	}
	
	throw(angle){
		let an = angle;
		angle = angle * Math.PI / 180;

		let vy = -10 * this.timeSpeed;
		let vx = Math.tan(angle) * 10 * this.timeSpeed;

		this.speed = [vx, vy];
		this.state = 'launched';
		this.startAnimation = this.frame;
		this.visible = true;
	}
			
	animate(){				
		this.frame++;

		if(this.ref.id == 0){
			//console.log(this.frame, (this.frame - this.startAnimation) < this.timeToScale);
		}

		if((this.frame - this.startAnimation) < this.timeToScale){
			let vScale = (this.endScale - this.initScale)/this.timeToScale;
			this.scale += vScale;
		}
	}
	
	click(){
		console.log("You clicked in a help", this.ref.id, this);
		h.stop();
		this.speed = [0,0];
		//this.position = [this.height + this.radius];
	}
}