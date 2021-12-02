function DateConvert(data) {
  const week = weekConvert(data.substring(0, 3));
  const year = data.substring(11, 15);
  const date = dateConvert(data.substring(8, 10));
  const time = data.substring(16, 21);
  const month = monthConvert(data.substring(4, 7));

  function monthConvert(month) {
    switch (month) {
      case 'Jan':
        return '1';
      case 'Feb':
        return '2';
      case 'Mar':
        return '3';
      case 'Apr':
        return '4';
      case 'May':
        return '5';
      case 'Jun':
        return '6';
      case 'Jul':
        return '7';
      case 'Aug':
        return '8';
      case 'Sep':
        return '9';
      case 'Oct':
        return '10';
      case 'Nov':
        return '11';
      case 'Dec':
        return '12';
      default:
        return month;
    }
  }

  function dateConvert(date) {
    switch (date) {
      case '01':
        return '1';
      case '02':
        return '2';
      case '03':
        return '3';
      case '04':
        return '4';
      case '05':
        return '5';
      case '06':
        return '6';
      case '07':
        return '7';
      case '08':
        return '8';
      case '09':
        return '9';
      default:
        return date;
    }
  }

  function weekConvert(week) {
    switch (week) {
      case 'Mon':
        return '월';
      case 'Tue':
        return '화';
      case 'Wed':
        return '수';
      case 'Thu':
        return '목';
      case 'Fri':
        return '금';
      case 'Sat':
        return '토';
      case 'Sun':
        return '일';
    }
  }

  return {
    year: year,
    month: month,
    week: week,
    date: date,
    time: time,
  };
}

export default DateConvert;
