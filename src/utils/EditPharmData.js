const EditPharmData = data => {
  var EditedData = ``;
  var index = 0;
  const titleString = `title="`;
  const contentString = `[CDATA[`;

  function selectNextIndex(a, b) {
    if (a == -1 && b == -1) {
      index = -1;
    } else if (a == -1 || b == -1) {
      index = Math.max(a, b);
    } else {
      index = Math.min(a, b);
    }
  }

  while (index != -1) {
    var titleIndex = data.indexOf(titleString, index);
    var contentIndex = data.indexOf(contentString, index);
    var startIndex =
      titleIndex == -1 || contentIndex == -1
        ? Math.max(titleIndex, contentIndex)
        : Math.min(titleIndex, contentIndex);
    var endString =
      titleIndex == -1 || contentIndex == -1
        ? titleIndex >= contentIndex
          ? `"`
          : `]`
        : titleIndex < contentIndex
        ? `"`
        : `]`;

    var endIndex = data.indexOf(endString, startIndex + 7);
    var nextTitleIndex = data.indexOf(titleString, startIndex + 1);
    var nextContentIndex = data.indexOf(contentString, startIndex + 1);

    selectNextIndex(nextTitleIndex, nextContentIndex);

    EditedData += data.substring(startIndex + 7, endIndex) + `\n`;
  }
  return EditedData;
};

export default EditPharmData;
