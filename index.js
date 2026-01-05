const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Cờ Vua với Bot Thông Minh</title>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css">
            <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
            <script src="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js"></script>
            <style>
                body { background-color: #1a1a1a; color: white; font-family: 'Segoe UI', sans-serif; display: flex; flex-direction: column; align-items: center; padding: 20px; }
                #myBoard { width: 450px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
                .info-panel { background: #2a2a2a; padding: 20px; border-radius: 12px; margin-top: 20px; width: 410px; text-align: center; border: 1px solid #444; }
                .status-text { font-size: 18px; margin-bottom: 15px; color: #4facfe; font-weight: bold; }
                button { background: #e74c3c; border: none; padding: 10px 25px; color: white; border-radius: 6px; cursor: pointer; font-size: 16px; transition: 0.3s; }
                button:hover { background: #c0392b; transform: scale(1.05); }
            </style>
        </head>
        <body>
            <h2 style="letter-spacing: 2px;">CHESS AI v1.0</h2>
            <div id="myBoard"></div>
            <div class="info-panel">
                <div id="status" class="status-text">Đến lượt bạn (Trắng)</div>
                <button onclick="resetGame()">LÀM MỚI TRẬN ĐẤU</button>
            </div>

            <script>
                var board = null;
                var game = new Chess();
                var $status = $('#status');

                // Hàm tính điểm quân cờ để Bot biết cái nào quan trọng
                function getPieceValue(piece) {
                    if (piece === null) return 0;
                    var values = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };
                    return values[piece.type];
                }

                // Bot quét tất cả nước đi và chọn nước có lợi nhất
                function makeBestMove() {
                    var possibleMoves = game.moves();
                    if (game.game_over()) return;

                    var bestMove = null;
                    var bestValue = -9999;

                    for (var i = 0; i < possibleMoves.length; i++) {
                        game.move(possibleMoves[i]);
                        
                        // Tính toán giá trị bàn cờ sau khi đi thử
                        var boardValue = 0;
                        game.board().forEach(row => {
                            row.forEach(piece => {
                                if (piece) {
                                    boardValue += (piece.color === 'b' ? getPieceValue(piece) : -getPieceValue(piece));
                                }
                            });
                        });

                        if (boardValue > bestValue) {
                            bestValue = boardValue;
                            bestMove = possibleMoves[i];
                        }
                        game.undo();
                    }

                    game.move(bestMove || possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);
                    board.position(game.fen());
                    updateStatus();
                }

                function onDrop(source, target) {
                    var move = game.move({ from: source, to: target, promotion: 'q' });
                    if (move === null) return 'snapback';
                    
                    $status.html("Bot đang suy nghĩ...");
                    window.setTimeout(makeBestMove, 500);
                    updateStatus();
                }

                function updateStatus() {
                    var status = '';
                    var moveColor = (game.turn() === 'b') ? 'Bot (Đen)' : 'Bạn (Trắng)';

                    if (game.in_checkmate()) { status = 'CHIẾU BÍ! ' + moveColor + ' thua.'; }
                    else if (game.in_draw()) { status = 'HÒA CỜ!'; }
                    else {
                        status = 'Lượt đi: ' + moveColor;
                        if (game.in_check()) { status += ' (ĐANG BỊ CHIẾU!)'; }
                    }
                    $status.html(status);
                }

                function resetGame() {
                    game.reset();
                    board.start();
                    updateStatus();
                }

                board = ChessBoard('myBoard', {
                    draggable: true,
                    position: 'start',
                    onDrop: onDrop
                });
                updateStatus();
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log('Bot Cờ Vua Thông Minh đang chạy tại port ' + PORT);
});
