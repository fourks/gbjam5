"use strict";

GBGJ.PlayerEntity = me.Entity.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.image = "player";
		settings.width = 16;
		settings.height = 16;
		settings.frameheight = 16;
		settings.framewidth = 16;
		settings.shapes = [ new me.Rect(0, 0, 16, 16) ]

		this._super(me.Entity, 'init', [x, y, settings]);
		this.pos.z = 6;
		this.minSpeed = .1

		this.renderable.anchorPoint.y = .5
		me.game.viewport.setDeadzone(10,10);

		this.cameraTargetPos = new me.Vector2d(this.pos.x, this.pos.y);

		me.game.viewport.follow(this.cameraTargetPos, me.game.viewport.AXIS.BOTH);

		this.alwaysUpdate = true;
		this.body.collisionType = me.collision.types.PLAYER_OBJECT;
		this.body.setMaxVelocity(1, 1);
		this.body.setFriction(0, 0);
		this.body.gravity = 0;

		this.shootSub = me.event.subscribe(me.event.KEYDOWN, this.tryToShoot.bind(this));
	},

	tryToShoot: function(action, keyCode, edge) {
	},

	changeAnimation: function(dest, next) {
		if(!this.renderable.isCurrentAnimation(this.getAnimationName(dest))) {
			if(next) {
				next = next.bind(this);
			}
			this.renderable.setCurrentAnimation(this.getAnimationName(dest), next);
		}
	},

	onDeactivateEvent: function() {
		me.event.unsubscribe(this.shootSub);
		me.event.unsubscribe(this.dashSub);
	},

	update : function (dt) {
		this.body.update(dt);
		// TODO: Force auto scroll here...
		if(me.input.isKeyPressed('right')) {
			this.body.vel.x += .1 * me.timer.tick;
		}
		if(me.input.isKeyPressed('left')) {
			this.body.vel.x -= .1 * me.timer.tick;
		}

		if(this.body.vel.x < this.minSpeed) {
			this.body.vel.x = this.minSpeed;
		}
		this.cameraTargetPos.x = this.pos.x;
		this.cameraTargetPos.y = this.pos.y;
		me.collision.check(this);
		this._super(me.Entity, 'update', [dt]);
		return true;
	},

	onCollision : function (response, other) {
	},
});
