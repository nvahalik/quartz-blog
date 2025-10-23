---
title: "Custom Google Apps Scripts Spreadsheet Functions for Technical Sales"
date: "2013-10-19"
tags:
draft:
---

A couple of years ago, I wrote some custom functions to help speed up working on estimates for our clients. Well, those functions have been lost since I left Classy Llama, but I think the these versions are much improved anyway.

Anyway, here are some Google Apps Script functions for Spreadsheets which might be useful for those in Technical Sales or software development. They can be used to add up and manipulate hour ranges (e.g. `SUMRANGE(["1-2",2,"2-5"])` would yield "5-9"). Those functions are `SUMRANGE`, `SUMRANGEHIGH`, `SUMRANGELOW`, `RANGEMULT`, and `RANGEADD`.

There are also some functions which can sum up natural language times. Those functions are `SUMTIME` and `TIMEHOURS`. `TIMEHOURS` takes a string with a time length in natural language e.g. 1 week, 4 weeks, 2.5 weeks, 5 days, 1 w 4 d and turns them into an integer (hour) value. Those values are taken from the global variable at the top of the script. So based on the paste below, you'd get 40, 160, 100, 40, and 72 respectively.

`SUMTIME` takes a range and adds up the `TIMEHOURS` values for every value in the range and spits out the final value.

Finally, `EFFORT(hours, frac=0)` is a helper function to take the results of `SUMTIME` and provide a more elegant way of display the information. `EFFORT(10)` yields "1 d 2 h", `EFFORT(52)` yields "1 w 1 d 4 h". `EFFORT(10, 1)` yields "1.25 days" and `EFFORT(160, 1)` yields "4 weeks"). It tries to be smart about the way that it displays the information. If you pass in 1 (true) as the second param of `EFFORT`, you'll get a fractional value for the first (largest) result and the whole word for the unit.

Hope this helps someone. Posted as a gist so you can iterate. Have fun!

It is available as a [Gist on Github](https://gist.github.com/nvahalik/7057859#file-custom-google-apps-scripts-for-tech-sales).

```javascript
/* Global vars. */
var hoursPerDay = 8;
var hoursPerWeek = hoursPerDay * 5;

/**
 * We calculate the number of hours in a given range.
 */
function SUMTIME(allData) {
  var numHours = 0;
  var numCells = allData.length;

  for (var i = 0; i <= numCells; i++) {
    var value = allData[i]; //.getValue();

    numHours += TIMEHOURS(value);
  }
  return numHours;
}

/**
 * For a given value, return the amount of time in hours.
 */
function TIMEHOURS(value) {
  /* Short circuit for plain number values, which should be hours. */
  if (typeof value == "number") {
    return value;
  }

  var numHours = 0;
  var weekRegex = new RegExp(/(\\d+(?:\\.\\d+)?)\\W?w(?:ee)?k?s?/);
  var dayRegex = new RegExp(/(\\d+(?:\\.\\d+)?)\\W?d(?:ay)?s?/);
  var emptyRegex = new RegExp(/\\d/);

  if (weekRegex.test(value)) {
    numHours += (parseFloat(value) * hoursPerWeek);
    value = value.toString().replace(weekRegex.exec(value)[0], '');
  }
  if (dayRegex.test(value)) {
    numHours += (parseInt(value) * hoursPerDay);
    value = value.toString().replace(dayRegex.exec(value)[0], '');
  }
  if (!emptyRegex.test(value)) {
    // Don't touch it.
  }
  else {
    numHours += parseInt(value);
  }

  return numHours;
}

/**
 * Return the value of a named range.
 */
function getNRValue(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getRangeByName(name).getValue();
}

/**
 * For a given range, return an array with all of the data from the cells. This
 * mimics how functions used in formulas actually get their data.
 */
function getAllCells(someRange) {
  var range = someRange;
  var numRows = range.getNumRows();
  var numCols = range.getNumColumns();
  var cells = [];
  for (var i = 1; i <= numRows; i++) {
    for (var j = 1; j <= numCols; j++) {
      var currentValue = range.getCell(i,j).getValue();
      cells.push(range.getCell(i,j).getValue());
    }
  }
  return cells;
}

/** Sum a range of ranges.  Running SUMRANGE on this set of data:
 *
 * +-------+--------+
 * | 1 - 2 | 3 - 4  |
 * | 5     | 4 - 10 |
 * +-------+--------+
 *
 * Would return "13 - 21".
 *
 * Non range values are applied to both the high and low-end of the
 * data.  To get either side of the range, use SUMRANGEHIGH() or
 * SUMRANGELOW().
 *
 * If you want to multiply/divide a range by something, use RANGEMULT().
 * If you want to add/subtract to a range, use RANGEADD().
 */
function SUMRANGE(data) {
  var retVal = actuallySumRange(data);
  return retVal[0] + " - " + retVal[1];
}

/**
 * This is where all the logic lives for actually summing a range.  Hence
 * the name.
 */
function actuallySumRange(data) {
  var numCells = data.length;
  var low = high = 0.0;
  var replace = new RegExp(/\\s/g);
  var value = '';

  for (var i = 0; i <= numCells; i++) {
    if (typeof data[i] != "object") continue;
    value = data[i].toString();
    value = value.replace(/^\\s\\s*/, "");
    thisCell = value.replace(/\\s\\s*$/, "");
    if (thisCell.length == 0) continue;

    var values = thisCell.split('-');
    if (values.length == 2) {
      low += parseFloat(values[0].trim());
      high += parseFloat(values[1].trim());
    }
    else {
      low += parseFloat(values[0].trim());
      high += parseFloat(values[0].trim());
    }
  }
  return [low, high];
}

/**
 * Returns just the high end of a range.
 */
function SUMRANGEHIGH(someRange) {
  var retVal = actuallySumRange(data);
  return retVal[1];
}

/**
 * Returns just the low end of a range.
 */
function SUMRANGELOW(data) {
  var retVal = actuallySumRange(data);
  return retVal[0];
}

/**
 * Adds (or subtracts, if you use a number <0) a number from a range.
 *
 * For example, RANGEADD("1 - 2", 4) would yield you "5 - 6".
 */
function RANGEADD(data, value) {
  var retVal = actuallySumRange(data);
  return (retVal[0]+value) + " - " + (retVal[1]+value);
}

/**
 * Multiplies (or divides, if 0 < value < 1) a number against a range.
 *
 * For example, RANGEMULT("1 - 2", 4) would yield you "4 - 8".
 */
function RANGEMULT(data, value) {
  var retVal = actuallySumRange(data);
  return (retVal[0]*value) + " - " + (retVal[1]*value);
}

/**
 * Create a string for showing the amount of effort involved for a given amount
 * of hours.  It attemps to be fairly elegant in the returned value.
 *
 * If their is only one unit to show, it will use the full pluralized unit name.
 * Otherwise, it will use "1 w 2 d" etc.
 */
function EFFORT(hours, frac) {
  if (frac == undefined) frac = false;
  var retArr = [];
  if (hours < hoursPerDay) {
    return hours + " hour" + (hours > 1 ? "s" : "");
  }
  else if (hours < hoursPerWeek && frac) {
    days = (hours / hoursPerDay);
    return days + " day" + (days > 1 ? "s" : "");
  }
  else if (frac) {
    weeks = (hours / hoursPerWeek);
    return weeks + " week" + (weeks > 1 ? "s" : "");
  }
  else {
    var weeks = parseInt(hours / hoursPerWeek);
    hours %= hoursPerWeek;
    var days = parseInt(hours / hoursPerDay);
    hours %= hoursPerDay;
    if (weeks > 0) {
      retArr.push(weeks + " " + ((days == 0 && hours == 0) ? "week" + (weeks > 1 ? "s" : "") : "w"));
    }
    if (days > 0) {
      retArr.push(days + " " + ((weeks == 0 && hours == 0) ? "day" + (days > 1 ? "s" : "") : "d"));
    }
    if (hours > 0) {
      retArr.push(hours + " " + ((weeks == 0 && days == 0) ? "hour" + (hours > 1 ? "s" : "") : "h"));
    }
    return retArr.join(" ");
  }
}
```
