//=============================================================================
// QMovement Static Class

function QMovement() {
  throw new Error('This is a static class');
}

(function() {
  var _params = QPlus.getParams('<QMovement>');

  QMovement.grid = Number(_params['Grid']) || 1;
  QMovement.tileSize = Number(_params['Tile Size'])
  QMovement.offGrid = _params['Off Grid'] === 'true';
  QMovement.smartMove = Number(_params['Smart Move']);
  QMovement.midPass = _params['Mid Pass'] === 'true';
  QMovement.moveOnClick = _params['Move on click'] === 'true';
  QMovement.diagonal = _params['Diagonal'] === 'true';
  QMovement.collision = '#FF0000'; // will be changable in a separate addon
  QMovement.water1 = '#00FF00'; // will be changable in a separate addon
  QMovement.water2 = '#0000FF'; // will be changable in a separate addon
  QMovement.water1Tag = 1; // will be changable in a separate addon
  QMovement.water2Tag = 2; // will be changable in a separate addon
  QMovement.playerCollider = _params['Player Collider'];
  QMovement.eventCollider = _params['Event Collider'];
  QMovement.showColliders = _params['Show Colliders'] === 'true';
  QMovement.tileBoxes = {
    1537: [48, 6, 0, 42],
    1538: [6, 48],
    1539: [[48, 6, 0, 42], [6, 48]],
    1540: [6, 48, 42],
    1541: [[48, 6, 0, 42], [6, 48, 42]],
    1542: [[6, 48], [6, 48, 42]],
    1543: [[48, 6, 0, 42], [6, 48], [6, 48, 42]],
    1544: [48, 6],
    1545: [[48, 6], [48, 6, 0, 42]],
    1546: [[48, 6], [6, 48]],
    1547: [[48, 6], [48, 6, 0, 42], [6, 48]],
    1548: [[48, 6], [6, 48, 42]],
    1549: [[48, 6], [48, 6, 0, 42], [6, 48, 42]],
    1550: [[48, 6], [6, 48], [6, 48, 42]],
    1551: [48, 48], // Impassable A5, B
    2063: [48, 48], // Impassable A1
    2575: [48, 48],
    3586: [6, 48],
    3588: [6, 48, 42],
    3590: [[6, 48], [6, 48, 42]],
    3592: [48, 6],
    3594: [[48, 6], [6, 48]],
    3596: [[48, 6], [6, 48, 42]],
    3598: [[48, 6], [6, 48], [6, 48, 42]],
    3599: [48, 48],  // Impassable A2, A3, A4
    3727: [48, 48]
  };
  QMovement.regionColliders = {}; // will be changable in a separate addon
})();
