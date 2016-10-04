"use strict";
(function() {
	var pathCache = {};

	GBGJ.PathEntity = me.Entity.extend({
		init: function(x, y, settings) {
			this._super(me.Entity, 'init', [x, y, {height: settings.height, width: settings.width}]);
			this.points = settings.points.map((e) => {return new me.Vector2d(~~(x + e.x), ~~(y + e.y))});
			this.id = settings.id;
			pathCache[this.id] = this;
			this.body.setCollisionMask(me.collision.types.NO_OBJECT);
			var enemy = me.pool.pull(settings.type, x, y, {path: this});
			me.game.world.addChild(enemy);
		},

		onDeactivateEvent: function() {
			console.log("Deleting path")
			delete pathCache[this.id];
		},

	});

	GBGJ.EnemyEntity = me.Entity.extend({
		init : function (x, y, settings) {
			settings = settings || {};
			settings.image = 'enemy';
			settings.width = 25;
			settings.height = 25;
			settings.frameheight = 25;
			settings.framewidth = 25;
			settings.shapes = [ new me.Rect(0, 0, 25, 25) ]
			this._super(me.Entity, 'init', [x, y, settings]);

			this.body.setMaxVelocity(1, 1);
			this.body.gravity = 0;
			if(!settings.path) {
				throw "Can't find a path property!";
			}
			this.path = settings.path;

			this.pos.z = 5;
			this.currentPoint = 0;
		},

		// melon's default entity renderer seems to wiggle a lot at low resolution...
		draw : function (renderer) {
			// draw the renderable's anchorPoint at the entity's anchor point
			// the entity's anchor point is a scale from body position to body width/height
			var x = ~~( this.pos.x + this.body.pos.x + (this.anchorPoint.x * this.body.width));
			var y = ~~( this.pos.y + this.body.pos.y + (this.anchorPoint.y * this.body.height));

			renderer.translate(x, y);
			this.renderable.draw(renderer);
			renderer.translate(-x, -y);
		},

		update : function (dt) {
			var points = this.path.points;
			var point = points[this.currentPoint];
			if(point) {
				var dir = point.clone().sub(this.pos);
				if(dir.length() < 2) {
					this.currentPoint++;
				}
				point = points[this.currentPoint];
				if(point) {
					dir = point.clone().sub(this.pos).normalize();
				}
				else {
					dir.x = 0;
					dir.y = 0;
				}

				this.body.vel.x = dir.x * me.timer.tick;
				this.body.vel.y = dir.y * me.timer.tick;

				this.body.update(dt);
			}

			me.collision.check(this);

			return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
		},

		changeAnimation: function(dest, next) {
			if(!this.renderable.isCurrentAnimation(dest)) {
				if(next) {
					next = next.bind(this);
				}
				this.renderable.setCurrentAnimation(dest, next);
			}
		},

		onCollision : function (response, other) {
			if(other.body.collisionType == me.collision.types.PROJECTILE_OBJECT) {
				console.log("Killed an enemy");
				me.game.world.removeChild(this);
			}
			if(other.body.collisionType == me.collision.types.ENEMY_OBJECT){
				return false;
			}
			if(other.body.collisionType == me.collision.types.PLAYER_OBJECT){
				return false;
			}
			return true;
		}
	});
})();