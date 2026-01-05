const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Cờ Vua Pro - Bot Thông Minh</title>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/chessboard-1.0.0.min.css">
            <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/chessboard-1.0.0.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js"></script>
            <style>
                body { background-color: #1a1a1a; color: white; font-family: 'Segoe UI', sans-serif; display: flex; justify-content: center; padding: 20px; gap: 20px; }
                .container { display: flex; flex-direction: column; align-items: center; }
                #myBoard { width: 450px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
                .sidebar { width: 250px; background: #2a2a2a; padding: 20px; border-radius: 10px; border: 1px solid #444; height: fit-content; }
                .info-panel { background: #2a2a2a; padding: 15px; border-radius: 10px; margin-top: 15px; width: 420px; text-align: center; border: 1px solid #444; }
                .status-text { font-size: 16px; margin-bottom: 10px; color: #4facfe; font-weight: bold; }
                .history { height: 300px; overflow-y: auto; background: #111; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 14px; color: #ccc; }
                button { background: #444; border: none; padding: 8px 15px; color: white; border-radius: 5px; cursor: pointer; margin: 5px; transition: 0.3s; }
                button:hover { background: #666; }
                .btn-danger { background: #e74c3c; }
                .btn-danger:hover { background: #c0392b; }
                select { background: #333; color: white; border: 1px solid #555; padding: 5px; border-radius: 5px; margin-bottom: 10px; width: 100%; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2 style="margin: 0 0 10px 0;">CHESS AI PRO</h2>
                <div id="myBoard"></div>
                <div class="info-panel">
                    <div id="status" class="status-text">Đến lượt bạn (Trắng)</div>
                    <button onclick="undoMove()">ĐI LẠI (UNDO)</button>
                    <button class="btn-danger" onclick="resetGame()">LÀM MỚI</button>
                </div>
            </div>

            <div class="sidebar">
                <label>ĐỘ KHÓ CỦA BOT:</label>
                <select id="difficulty">
                    <option value="1">Dễ (Đi ngẫu nhiên)</option>
                    <option value="2" selected>Trung bình (Biết ăn quân)</option>
                    <option value="3">Khó (Tính toán sâu)</option>
                </select>
                
                <label>LỊCH SỬ NƯỚC ĐI:</label>
                <div id="pgn" class="history"></div>
            </div>

            <script>
                var board = null;
                var game = new Chess();
                var $status = $('#status');
                var $pgn = $('#pgn');

                function getPieceValue(piece) {
                    if (piece === null) return 0;
                    var values = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };
                    return piece.color === 'b' ? values[piece.type] : -values[piece.type];
                }

                function evaluateBoard(currentBoard) {
                    var totalEvaluation = 0;
                    for (var i = 0; i < 8; i++) {
                        for (var j = 0; j < 8; j++) {
                            totalEvaluation += getPieceValue(currentBoard[i][j]);
                        }
                    }
                    return totalEvaluation;
                }

                function makeBotMove() {
                    var level = parseInt($('#difficulty').val());
                    var possibleMoves = game.moves();
                    if (game.game_over()) return;

                    var selectedMove = null;

                    if (level === 1) {
                        selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                    } else {
                        var bestValue = -9999;
                        for (var i = 0; i < possibleMoves.length; i++) {
                            game.move(possibleMoves[i]);
                            var boardValue = evaluateBoard(game.board());
                            game.undo();
                            if (boardValue > bestValue) {
                                bestValue = boardValue;
                                selectedMove = possibleMoves[i];
                            }
                        }
                    }

                    game.move(selectedMove || possibleMoves[0]);
                    board.position(game.fen());
                    updateStatus();
                }

                function undoMove() {
                    game.undo(); // Undo lượt bot
                    game.undo(); // Undo lượt người
                    board.position(game.fen());
                    updateStatus();
                }

                function onDrop(source, target) {
                    var move = game.move({ from: source, to: target, promotion: 'q' });
                    if (move === null) return 'snapback';
                    
                    window.setTimeout(makeBotMove, 500);
                    updateStatus();
                }

                function updateStatus() {
                    var status = '';
                    var moveColor = (game.turn() === 'b') ? 'Bot' : 'Bạn';
                    if (game.in_checkmate()) status = 'CHIẾU BÍ! ' + moveColor + ' thua.';
                    else if (game.in_draw()) status = 'HÒA CỜ!';
                    else {
                        status = 'Lượt đi: ' + moveColor;
                        if (game.in_check()) status += ' (CHIẾU!)';
                    }
                    $status.html(status);
                    $pgn.html(game.pgn().split(' ').join('<br>'));
                    $pgn.scrollTop($pgn[0].scrollHeight);
                }

                function resetGame() {
                    game.reset();
                    board.start();
                    updateStatus();
                }

                board = ChessBoard('myBoard', {
                    draggable: true,
                    position: 'start',
                    onDrop: onDrop,
                    // Sửa lỗi hình ảnh quân cờ bằng link chuẩn
                    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
                });
                updateStatus();
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log('Web Chess Pro is online!');
});
