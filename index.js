const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Cờ Vua với Bot</title>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css">
            <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
            <script src="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js"></script>
            <style>
                body { background-color: #222; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; padding-top: 20px; }
                #myBoard { width: 400px; margin-bottom: 20px; }
                .info { background: #333; padding: 15px; border-radius: 10px; text-align: center; width: 370px; }
                button { background: #4facfe; border: none; padding: 10px 20px; color: white; border-radius: 5px; cursor: pointer; font-weight: bold; }
                button:hover { background: #00f2fe; }
            </style>
        </head>
        <body>
            <h2>TRẬN ĐẤU VỚI BOT</h2>
            <div id="myBoard"></div>
            <div class="info">
                <p id="status">Đến lượt bạn (Trắng)</p>
                <button onclick="resetGame()">Chơi lại</button>
            </div>

            <script>
                var board = null;
                var game = new Chess();
                var $status = $('#status');

                function makeRandomMove() {
                    var possibleMoves = game.moves();
                    if (game.game_over()) return;
                    var randomIdx = Math.floor(Math.random() * possibleMoves.length);
                    game.move(possibleMoves[randomIdx]);
                    board.position(game.fen());
                    updateStatus();
                }

                function onDrop(source, target) {
                    var move = game.move({ from: source, to: target, promotion: 'q' });
                    if (move === null) return 'snapback';
                    updateStatus();
                    window.setTimeout(makeRandomMove, 250);
                }

                function updateStatus() {
                    var status = '';
                    var moveColor = (game.turn() === 'b') ? 'Đen (Bot)' : 'Trắng (Bạn)';
                    if (game.in_checkmate()) { status = 'Trò chơi kết thúc, ' + moveColor + ' bị chiếu bí.'; }
                    else if (game.in_draw()) { status = 'Trò chơi kết thúc, hòa.'; }
                    else {
                        status = 'Lượt đi: ' + moveColor;
                        if (game.in_check()) { status += ' (Đang bị chiếu!)'; }
                    }
                    $status.html(status);
                }

                function resetGame() {
                    game.reset();
                    board.start();
                    updateStatus();
                }

                var config = { draggable: true, position: 'start', onDrop: onDrop };
                board = ChessBoard('myBoard', config);
                updateStatus();
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log('Web Cờ Vua đang chạy trên port ' + PORT);
});
