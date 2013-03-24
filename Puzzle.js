
var Puzzle;
(function (Puzzle) {
    var path = "Img/vampire.jpg";
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.prototype.opposite = function () {
            return new Point(-this.x, -this.y);
        };
        Point.prototype.add = function (point) {
            return new Point(this.x + point.getX(), this.y + point.getY());
        };
        Point.prototype.getX = function () {
            return this.x;
        };
        Point.prototype.setX = function (x) {
            this.x = x;
        };
        Point.prototype.getY = function () {
            return this.y;
        };
        Point.prototype.setY = function (y) {
            this.y = y;
        };
        return Point;
    })();
    Puzzle.Point = Point;    
    var ImageLoader = (function () {
        function ImageLoader() { }
        ImageLoader.loadAndFitWindow = function loadAndFitWindow(path, display) {
            var myImage = new Image();
            myImage.name = path;
            var _this = this;
            myImage.onload = function () {
                var height = $(window).height() - 120;
                ImageLoader.imgWidth = height * this.width / this.height;
                ImageLoader.imgHeight = height;
                display();
            };
            myImage.src = path;
        };
        ImageLoader.load = function load(width, height, path, display) {
            var myImage = new Image();
            myImage.name = path;
            var _this = this;
            myImage.onload = function () {
                ImageLoader.imgWidth = width;
                ImageLoader.imgHeight = height;
                display();
            };
            myImage.src = path;
        };
        ImageLoader.loadNumbers = function loadNumbers(display) {
            var myImage = new Image();
            myImage.name = path;
            var _this = this;
            myImage.onload = function () {
                var height = $(window).height() - 200;
                ImageLoader.imgWidth = $(window).height() - 200;
                ImageLoader.imgHeight = height;
                display();
            };
            myImage.src = path;
        };
        ImageLoader.loadNumbersWH = function loadNumbersWH(width, height, display) {
            var myImage = new Image();
            myImage.name = path;
            var _this = this;
            myImage.onload = function () {
                ImageLoader.imgWidth = width;
                ImageLoader.imgHeight = height;
                display();
            };
            myImage.src = path;
        };
        return ImageLoader;
    })();    
    var ItemPuzzle = (function () {
        function ItemPuzzle(puzzleId, pos, size) {
            this.puzzleId = puzzleId;
            this.pos = pos;
            this.size = size;
            this.itemId = "itemPuzzle_" + pos.getX() + "_" + pos.getY();
        }
        ItemPuzzle.prototype.isSolved = function () {
            return this.itemId == $("#" + this.itemId).attr("name");
        };
        ItemPuzzle.prototype.animate = function () {
            var _this = this;
            $("#" + this.itemId).fadeOut(180, function () {
                $("#" + _this.itemId).fadeIn();
            });
        };
        ItemPuzzle.prototype.display = function () {
            this.xUnit = ImageLoader.imgWidth / this.size;
            this.yUnit = ImageLoader.imgHeight / this.size;
            var xPos = this.pos.getX() * this.xUnit;
            var yPos = this.pos.getY() * this.yUnit;
            $(this.puzzleId).append("<div id='" + this.itemId + "' ></div>");
            $("#" + this.itemId).attr("name", this.itemId);
            $("#" + this.itemId).css({
                "position": "absolute",
                "left": xPos + "px",
                "top": yPos + "px",
                "width": this.xUnit + "px",
                "height": this.yUnit + "px",
                "background-image": "url(" + path + ")",
                "background-position": "" + (ImageLoader.imgWidth - xPos) + "px " + (ImageLoader.imgHeight - yPos) + "px",
                "background-size": ImageLoader.imgWidth + "px " + ImageLoader.imgHeight + "px",
                "border": "2px",
                "border-style": "solid"
            });
        };
        ItemPuzzle.prototype.displayNumber = function () {
            var num = (this.size * this.pos.getY() + this.pos.getX()) % 10 + 1;
            this.xUnit = ImageLoader.imgWidth / this.size;
            this.yUnit = ImageLoader.imgHeight / this.size;
            var xPos = this.pos.getX() * this.xUnit;
            var yPos = this.pos.getY() * this.yUnit;
            $(this.puzzleId).append("<div id='" + this.itemId + "' ></div>");
            $("#" + this.itemId).attr("name", this.itemId);
            $("#" + this.itemId).css({
                "position": "absolute",
                "left": xPos + "px",
                "top": yPos + "px",
                "width": this.xUnit + "px",
                "height": this.yUnit + "px",
                "background-image": "url(Img/numbers/" + num + ".png)",
                "background-position": "" + (ImageLoader.imgWidth - xPos) + "px " + (ImageLoader.imgHeight - yPos) + "px",
                "background-size": this.xUnit + "px " + this.yUnit + "px",
                "border": "2px",
                "border-style": "solid"
            });
        };
        ItemPuzzle.prototype.remove = function () {
            $("#" + this.itemId).remove();
        };
        return ItemPuzzle;
    })();    
    var SlidingPuzzle = (function () {
        function SlidingPuzzle(id) {
            this.puzzle = new Pz(id);
        }
        SlidingPuzzle.prototype.display = function (options) {
            this.puzzle.display(options);
        };
        SlidingPuzzle.prototype.shuffle = function () {
            this.puzzle.shuffle();
        };
        SlidingPuzzle.prototype.solve = function () {
            this.puzzle.solve();
        };
        return SlidingPuzzle;
    })();
    Puzzle.SlidingPuzzle = SlidingPuzzle;    
    var Pz = (function () {
        function Pz(id) {
            this.id = id;
            this.puzzleItems = new Array();
            this.options = {
                size: 3,
                image: "",
                position: {
                    x: -1,
                    y: -1
                },
                width: 0,
                height: 0
            };
        }
        Pz.prototype.isSolved = function () {
            var solved = true;
            for(var i = 0; i < this.options.size * this.options.size - 1; i++) {
                solved = solved && this.puzzleItems[i].isSolved();
            }
            return solved;
        };
        Pz.prototype.solve = function () {
            var _this = this;
            var parseName = function (name) {
                return new Point(parseInt(name[11], 10), parseInt(name[13], 10));
            };
            var solved = function () {
                _this.resetItemsId();
                $(_this.id).trigger("puzzleAutoSolve");
            };
            for(var i = 0; i < this.options.size; i++) {
                for(var j = 0; j < this.options.size; j++) {
                    var p = new Point(i, j);
                    var id = "#itemPuzzle_" + p.getX() + "_" + p.getY();
                    var name = $(id).attr("name");
                    if(name) {
                        var to = parseName(name);
                        if(i != this.options.size - 1 || j != this.options.size - 1) {
                            this.moveItemTo(id, to);
                        } else {
                            this.moveItemTo(id, to);
                        }
                    }
                }
            }
            solved();
        };
        Pz.prototype.resetItemsId = function () {
            for(var i = 0; i < this.options.size; i++) {
                for(var j = 0; j < this.options.size; j++) {
                    var p = new Point(i, j);
                    var name = "itemPuzzle_" + p.getX() + "_" + p.getY();
                    $('[name="' + name + '"]').attr("id", name);
                }
            }
        };
        Pz.prototype.createItems = function () {
            Pz.empty = new Point(this.options.size - 1, this.options.size - 1);
            var border_left_width = parseInt($(this.id).css("border-left-width"), 10);
            var border_top_width = parseInt($(this.id).css("border-top-width"), 10);
            if(this.options.position.x >= 0 && this.options.position.y >= 0) {
                $(this.id).css({
                    "left": (this.options.position.x - border_left_width) + "px",
                    "top": (this.options.position.y - border_top_width) + "px"
                });
            }
            $(this.id).css({
                "position": "absolute",
                "width": ImageLoader.imgWidth + "px",
                "height": ImageLoader.imgHeight + "px",
                "background-color": "white"
            });
            this.options.position.x = ($(this.id).position().left + border_left_width);
            this.options.position.y = ($(this.id).position().top + border_top_width);
            for(var i = 0; i < this.options.size; i++) {
                for(var j = 0; j < this.options.size; j++) {
                    var position = new Point(i, j);
                    this.puzzleItems.push(new ItemPuzzle(this.id, position, this.options.size));
                }
            }
        };
        Pz.prototype.display = function (options) {
            this.options = $.extend({
            }, this.options, options);
            this.shuffler = new Shuffler(this.options.size, this);
            if(this.options.image != "") {
                this.displayPicture();
            } else {
                this.displayNumbers();
            }
        };
        Pz.prototype.displayPicture = function () {
            var _this = this;
            if(this.options.width != 0 && this.options.height != 0) {
                ImageLoader.load(this.options.width, this.options.height, this.options.image, function () {
                    _this.createItems();
                    for(var i = 0; i < _this.options.size * _this.options.size - 1; i++) {
                        _this.puzzleItems[i].display();
                    }
                    new dragManager(_this, _this.options.size).start();
                });
            } else {
                ImageLoader.loadAndFitWindow(this.options.image, function () {
                    _this.createItems();
                    for(var i = 0; i < _this.options.size * _this.options.size - 1; i++) {
                        _this.puzzleItems[i].display();
                    }
                    new dragManager(_this, _this.options.size).start();
                });
            }
        };
        Pz.prototype.displayNumbers = function () {
            var _this = this;
            if(this.options.width != 0 && this.options.height != 0) {
                ImageLoader.loadNumbersWH(this.options.width, this.options.height, function () {
                    _this.createItems();
                    for(var i = 0; i < _this.options.size * _this.options.size - 1; i++) {
                        _this.puzzleItems[i].displayNumber();
                    }
                    new dragManager(_this, _this.options.size).start();
                });
            } else {
                ImageLoader.loadNumbers(function () {
                    _this.createItems();
                    for(var i = 0; i < _this.options.size * _this.options.size - 1; i++) {
                        _this.puzzleItems[i].displayNumber();
                    }
                    new dragManager(_this, _this.options.size).start();
                });
            }
        };
        Pz.prototype.shuffle = function () {
            if(this.isSolved()) {
                var onItemToRemove = this.puzzleItems[this.options.size * this.options.size - 1];
                onItemToRemove.remove();
            }
            this.arrangeItems();
            this.shuffler.shuffle();
        };
        Pz.prototype.displaySolved = function () {
            var missingItem = this.puzzleItems[this.options.size * this.options.size - 1];
            if(this.options.image) {
                missingItem.display();
            } else {
                missingItem.displayNumber();
            }
            for(var i = 0; i < this.options.size * this.options.size; i++) {
                this.puzzleItems[i].animate();
            }
            $(this.id).trigger("puzzleSolve");
        };
        Pz.prototype.arrangeItems = function () {
            var xUnit = ImageLoader.imgWidth / this.options.size;
            var yUnit = ImageLoader.imgHeight / this.options.size;
            for(var i = 0; i < this.options.size; i++) {
                for(var j = 0; j < this.options.size; j++) {
                    var itemP = "itemPuzzle_" + i + "_" + j;
                    $("#" + itemP).css({
                        "left": i * xUnit + "px",
                        "top": j * yUnit + "px"
                    });
                }
            }
        };
        Pz.prototype.move = function (p, direction, nextmove) {
            var itemP = "itemPuzzle_" + p.getX() + "_" + p.getY();
            var xUnit = ImageLoader.imgWidth / this.options.size;
            var yUnit = ImageLoader.imgHeight / this.options.size;
            $("#" + itemP).animate({
                left: "+=" + direction.getX() * xUnit,
                top: "+=" + direction.getY() * yUnit
            }, 80, function () {
                console.log(nextmove());
                nextmove();
            });
            $("#" + itemP).attr("id", "itemPuzzle_" + (p.getX() + direction.getX()) + "_" + (p.getY() + direction.getY()));
        };
        Pz.prototype.moveItemTo = function (id, p, nextmove) {
            var xUnit = ImageLoader.imgWidth / this.options.size;
            var yUnit = ImageLoader.imgHeight / this.options.size;
            var name = $(id).attr("name");
            $(id).css({
                left: p.getX() * xUnit + "px",
                top: p.getY() * yUnit + "px"
            });
        };
        Pz.prototype.getPosition = function () {
            return this.options.position;
        };
        Pz.prototype.getId = function () {
            return this.id;
        };
        return Pz;
    })();    
    var dragManager = (function () {
        function dragManager(puzzle, size) {
            this.puzzle = puzzle;
            this.size = size;
            this.xUnit = (ImageLoader.imgWidth / this.size);
            this.yUnit = (ImageLoader.imgHeight / this.size);
            this.xPos = puzzle.getPosition().x;
            this.yPos = puzzle.getPosition().y;
        }
        dragManager.prototype.start = function () {
            this.handleEvent();
            this.makeDraggableAll();
        };
        dragManager.prototype.stop = function () {
            $("*").off("dragstop");
            $(":ui-draggable").draggable("destroy");
        };
        dragManager.prototype.makeDraggableAll = function () {
            this.makeDraggableItemUp();
            this.makeDraggableItemDown();
            this.makeDraggableItemLeft();
            this.makeDraggableItemRight();
        };
        dragManager.prototype.makeDraggableItemUp = function () {
            var _this = this;
            if(Pz.empty.getY() != 0) {
                var x = Pz.empty.getX(), y = Pz.empty.getY();
                var itemIdUp = "itemPuzzle_" + x + "_" + (y - 1);
                $("#" + itemIdUp).draggable({
                    containment: [
                        x * this.xUnit + this.xPos, 
                        (y - 1) * this.yUnit + this.yPos, 
                        x * this.xUnit + this.xPos, 
                        y * this.yUnit + this.yPos
                    ],
                    cursor: "move"
                });
                $("#" + itemIdUp).on("dragstop", function (event, ui) {
                    _this.checkDrag(itemIdUp, new Point(x, y - 1));
                });
                $("#" + itemIdUp).draggable("enable");
            }
        };
        dragManager.prototype.makeDraggableItemDown = function () {
            var _this = this;
            if(Pz.empty.getY() != this.size - 1) {
                var x = Pz.empty.getX(), y = Pz.empty.getY();
                var itemIdUp = "itemPuzzle_" + x + "_" + (y + 1);
                $("#" + itemIdUp).draggable({
                    containment: [
                        x * this.xUnit + this.xPos, 
                        (y + 1) * this.yUnit + this.yPos, 
                        x * this.xUnit + this.xPos, 
                        y * this.yUnit + this.yPos
                    ],
                    cursor: "move"
                });
                $("#" + itemIdUp).on("dragstop", function (event, ui) {
                    _this.checkDrag(itemIdUp, new Point(x, y + 1));
                });
                $("#" + itemIdUp).draggable("enable");
            }
        };
        dragManager.prototype.makeDraggableItemLeft = function () {
            var _this = this;
            if(Pz.empty.getX() != 0) {
                var x = Pz.empty.getX(), y = Pz.empty.getY();
                var itemIdUp = "itemPuzzle_" + (x - 1) + "_" + y;
                $("#" + itemIdUp).draggable({
                    containment: [
                        (x - 1) * this.xUnit + this.xPos, 
                        y * this.yUnit + this.yPos, 
                        x * this.xUnit + this.xPos, 
                        y * this.yUnit + this.yPos
                    ],
                    cursor: "move"
                });
                $("#" + itemIdUp).on("dragstop", function (event, ui) {
                    _this.checkDrag(itemIdUp, new Point(x - 1, y));
                });
                $("#" + itemIdUp).draggable("enable");
            }
        };
        dragManager.prototype.makeDraggableItemRight = function () {
            var _this = this;
            if(Pz.empty.getX() != this.size - 1) {
                var x = Pz.empty.getX(), y = Pz.empty.getY();
                var itemIdUp = "itemPuzzle_" + (x + 1) + "_" + y;
                $("#" + itemIdUp).draggable({
                    containment: [
                        (x + 1) * this.xUnit + this.xPos, 
                        y * this.yUnit + this.yPos, 
                        x * this.xUnit + this.xPos, 
                        y * this.yUnit + this.yPos
                    ],
                    cursor: "move"
                });
                $("#" + itemIdUp).on("dragstop", function (event, ui) {
                    _this.checkDrag(itemIdUp, new Point(x + 1, y));
                });
                $("#" + itemIdUp).draggable("enable");
            }
        };
        dragManager.prototype.checkDrag = function (itemId, newEmpty) {
            var xEmpty = Pz.empty.getX() * this.xUnit, yEmpty = Pz.empty.getY() * this.yUnit, xItem = $("#" + itemId).position().left, yItem = $("#" + itemId).position().top, xNewEmpty = newEmpty.getX() * this.xUnit, yNewEmpty = newEmpty.getY() * this.yUnit;
            if((xEmpty <= xItem || xEmpty - 1 <= xItem) && (yEmpty <= yItem || yEmpty - 1 <= yItem)) {
                this.disableDrags();
                console.log("empty = " + newEmpty.getX() + "," + newEmpty.getY());
                console.log("itemPuzzle_" + Pz.empty.getX() + "_" + Pz.empty.getY());
                this.unsubscribe();
                $("#" + itemId).css({
                    "left": xEmpty + "px",
                    "top": yEmpty + "px"
                });
                $("#" + itemId).attr("id", "itemPuzzle_" + Pz.empty.getX() + "_" + Pz.empty.getY());
                Pz.empty = newEmpty;
                this.makeDraggableAll();
                $(this.puzzle.getId()).trigger("puzzleMove");
                if(this.puzzle.isSolved()) {
                    this.puzzle.displaySolved();
                }
            } else if((xNewEmpty >= xItem || xNewEmpty + 1 >= xItem) && (yNewEmpty >= yItem || yNewEmpty + 1 >= yItem)) {
                this.unsubscribe();
                this.makeDraggableAll();
            } else {
                this.disableDragsExcept("#" + itemId);
            }
        };
        dragManager.prototype.disableDrags = function () {
            var x = Pz.empty.getX(), y = Pz.empty.getY();
            $("#itemPuzzle_" + (x + 1) + "_" + y).draggable("disable");
            $("#itemPuzzle_" + (x - 1) + "_" + y).draggable("disable");
            $("#itemPuzzle_" + x + "_" + (y + 1)).draggable("disable");
            $("#itemPuzzle_" + x + "_" + (y - 1)).draggable("disable");
        };
        dragManager.prototype.disableDragsExcept = function (itemId) {
            var x = Pz.empty.getX(), y = Pz.empty.getY(), id;
            id = "#itemPuzzle_" + (x + 1) + "_" + y;
            if(itemId != id) {
                $(id).draggable("disable");
            }
            id = "#itemPuzzle_" + (x - 1) + "_" + y;
            if(itemId != id) {
                $(id).draggable("disable");
            }
            id = "#itemPuzzle_" + x + "_" + (y + 1);
            if(itemId != id) {
                $(id).draggable("disable");
            }
            id = "#itemPuzzle_" + x + "_" + (y - 1);
            if(itemId != id) {
                $(id).draggable("disable");
            }
        };
        dragManager.prototype.unsubscribe = function () {
            var x = Pz.empty.getX(), y = Pz.empty.getY();
            $("#itemPuzzle_" + (x + 1) + "_" + y).off("dragstop");
            $("#itemPuzzle_" + (x - 1) + "_" + y).off("dragstop");
            $("#itemPuzzle_" + x + "_" + (y + 1)).off("dragstop");
            $("#itemPuzzle_" + x + "_" + (y - 1)).off("dragstop");
        };
        dragManager.prototype.handleEvent = function () {
            var _this = this;
            $(this.puzzle.getId()).on("puzzleShuffle", function () {
                _this.stop();
                _this.makeDraggableAll();
            });
            $(this.puzzle.getId()).on("puzzleSolve", function () {
                _this.stop();
            });
            $(this.puzzle.getId()).on("puzzleAutoSolve", function () {
                Pz.empty = new Point(_this.size - 1, _this.size - 1);
                _this.stop();
                _this.makeDraggableAll();
            });
        };
        return dragManager;
    })();    
    var Shuffler = (function () {
        function Shuffler(dimension, puzzle) {
            this.dimension = dimension;
            this.puzzle = puzzle;
            this.lastDirection = new Point(0, 0);
            Pz.empty = new Point(dimension - 1, dimension - 1);
        }
        Shuffler.prototype.shuffle = function () {
            var _this = this;
            var i = 20;
            var sh = function () {
                if(i > 0) {
                    _this.doRandomMove(sh);
                } else if(i == -20) {
                    $(_this.puzzle.getId()).trigger("puzzleShuffle");
                }
                i--;
            };
            sh();
        };
        Shuffler.prototype.shuffleFast = function () {
            for(var i = 0; i < 10; i++) {
                this.doRandomMove();
            }
        };
        Shuffler.prototype.doRandomMove = function (nextmove) {
            var rDirection = this.getRandom();
            var item = Pz.empty.add(rDirection);
            this.puzzle.move(item, rDirection.opposite(), nextmove);
            Pz.empty = item;
        };
        Shuffler.prototype.getRandom = function () {
            var directions = this.getPossibleDirections();
            var random = Math.floor(Math.random() * directions.length);
            this.lastDirection = directions[random];
            return this.lastDirection;
        };
        Shuffler.prototype.getPossibleDirections = function () {
            var x = Pz.empty.getX(), y = Pz.empty.getY();
            var directions = new Array();
            if(x != 0) {
                directions.push(new Point(-1, 0));
            }
            if(x != this.dimension - 1) {
                directions.push(new Point(1, 0));
            }
            if(y != 0) {
                directions.push(new Point(0, -1));
            }
            if(y != this.dimension - 1) {
                directions.push(new Point(0, 1));
            }
            var backDirection = this.lastDirection.opposite();
            directions = $.grep(directions, function (value) {
                return value.getX() != backDirection.getX() || value.getY() != backDirection.getY();
            });
            return directions;
        };
        return Shuffler;
    })();    
    var stats = (function () {
        function stats() { }
        stats.prototype.countMoves = function () {
            $("#puzzle").on("puzzleMove", function () {
                console.log("moooooooooooooooooooove");
            });
        };
        stats.prototype.getCountMoves = function () {
            return this.moves;
        };
        return stats;
    })();    
})(Puzzle || (Puzzle = {}));
