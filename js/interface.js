function initSelections(idTag, minVal, maxVal, defVal) {
  var selectionList = "";
  for (var j = minVal; j <= maxVal; j++) {
    selectionList += ("<option" + ((j == defVal) ? " selected = 'selected'" : "") + ">" + j + "</option>");
  };
  $(idTag).html(selectionList);
}