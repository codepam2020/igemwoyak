const list = [
  'I need you to help me',
  'I like listening to music',
  'I was washing the dishes',
  'What are you looking for?',
  'Why are you doing it?',
];

var target = 'Why';

function findWord(element) {
  if (element.indexOf(target) == -1) {
    return false;
  } else {
    return true;
  }
}

const ans = list.filter(findWord);

console.log(ans);
