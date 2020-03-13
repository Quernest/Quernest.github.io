let game = new Game();

QUnit.test( "images array length must be 3", function( assert ) {
  assert.equal( images.length, 3, "images array length = 3" );
});

QUnit.test( "5 classes must be created", function( assert ) {
  assert.ok( Game, "Class Game created" );
  assert.ok( Player, "Class Player created" );
  assert.ok( Enemy, "Class Enemy created" );
  assert.ok( Bullet, "Class Bullet created" );
  assert.ok( Keyboarder, "Class Keyboarder created" );
});

QUnit.test( "Canvas properties", function( assert ) {
  assert.ok(game.screen, "Canvas is ready");
  assert.equal( game.gameSize.x, 900, "Canvas width [coord x] = 900px" );
  assert.equal( game.gameSize.y, 600, "Canvas height [coord y] = 600px" );
});

QUnit.test( "Bodies test", function( assert ) {
  assert.equal( game.bodies.length, 25, "25 objects on the map");
});
