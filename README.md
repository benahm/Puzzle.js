Puzzle.js
================
<p align="center">
    <img alt="Sliding Puzzle" src="http://24.media.tumblr.com/tumblr_ma2679pvjo1r948g4o1_400.gif" />
</p>
Create puzzles using Puzzle.js

You can create a sliding puzzle right now
```javascript
var puzzle=Puzzle.SlidingPuzzle("#puzzle");
puzzle.display({ size: 3, image: "Img/vampire.jpg" });
$("#shuffle").on("click",function () {
    puzzle.shuffle();
    $("#solve").attr("disabled", true);
});
$("#puzzle").on("puzzleShuffle",function () {
    $("#solve").removeAttr("disabled");
})
$("#solve").on("click",function () {
    puzzle.solve();
});
```
## Options 
    * size: size of the puzzle default 3
    * image: image url, default empty and shows numbers
    * position: position on the id elements
    * width: width of the puzzle
    * height: height of the puzzle
    
## Events
    * puzzleSolve : event fired when the puzzle is solved
    * puzzleAutoSolve : event fired when the puzzle is auto solved (when puzzle.solve called) 
    * puzzleShuffle : event fired when the puzzle is shuffled (when puzzle.shuffle called)
    * puzzleMove : event fired when an item of the puzzle is moved 

## Requirements
    * JQuery
    * JQuery-ui


## [Live demo](http://benahm.github.com/Puzzle.js/)

