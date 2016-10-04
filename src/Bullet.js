"use strict";

GBGJ.Bullet = me.Entity.extend({
		init : function (x, y, settings) {
		settings = settings || {};

		settings.image = "bullet";
		settings.width = 15;
		settings.height = 8;
		settings.framewidth = 15;
		settings.frameheight = 8;
		this._super(me.Entity, 'init', [x, y, settings]);
		this.pos.z = 10;
		this.speed = settings.speed || 5;
		this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
		this.body.setVelocity(0, 0);
		this.body.setMaxVelocity(this.speed, this.speed);
		this.body.setFriction(0, 0);
		this.body.gravity = 0;
		this.setDirection(settings.dir);
		this.setMask(me.collision.types.ENEMY_OBJECT);
	},

	setMask: function(add) {
		this.body.setCollisionMask( 0
			| me.collision.types.WORLD_SHAPE
			| me.collision.types.COLLECTABLE_OBJECT
			| me.collision.types.ACTION_OBJECT
			| add
		)
	},

	setDirection: function(dir) {
		this.body.vel.x = dir.x * this.speed;
		this.body.vel.y = dir.y * this.speed;
		this.renderable.angle = Math.atan2(dir.y, dir.x);
	},

	onDeactivateEvent: function() {
	},

	update : function (dt) {
		this.body.update(dt);
		me.collision.check(this);
		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},

	onCollision : function (response, other) {
		if(other.body.collisionType == me.collision.types.ENEMY_OBJECT) {
			//other.damage();
		}
		if(other.body.collisionType == me.collision.types.PLAYER_OBJECT) {
			//other.damage();
		}

		// Bullets never respond to collisions other than with destruction.
		this.body.setCollisionMask(me.collision.types.NO_OBJECT);
		me.game.world.removeChild(this);

		return false;
	}
});