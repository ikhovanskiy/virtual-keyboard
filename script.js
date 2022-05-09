import { keysSettings } from './keysSettigs.js';

class Key {
  constructor(value, additValue, code, width = null, lastBtnInRow = false) {
    this.code = code;
    this.value = value;
    this.additValue = additValue;
    this.width = width;
    this.lastBtnInRow = lastBtnInRow;
  }
}
// localStorage.clear()
let lang = 'EN';
let shiftPress = false;
let capslockPress = false;
let pressed = new Set();
let container = [];
let selectionStart = 0;

if (localStorage.length !== 0 && localStorage.length !== 1) {
  lang = localStorage.getItem('lang');
  if (localStorage.getItem('capslockPress') === 'true') {
    capslockPress = true;
  } else { capslockPress = false; }
}

const Keyboard = {
  setting: {
    shiftPress: shiftPress,
    capslockPress: capslockPress,
    lang: lang
  },
  init() {
    document.head.innerHTML = `<meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Virtual Keyboard</title>
            <link rel="stylesheet" href="style.css">
            <script src="script.js" type="module"></script>`;
    const createContainerForKeyboard = document.createElement('div');
    createContainerForKeyboard.classList.add('wrapper');
    document.body.appendChild(createContainerForKeyboard);
    document.querySelector('.wrapper').innerHTML = '<div class="title"><p>Windows, ctrl+shift</p></div><textarea rows="10" type="text" id="input"></textarea> <div class="keyboard"> </div>';
  },
  clearKeys() {
    document.querySelector('.keyboard').innerHTML = '';
  },
  addKey(value, additValue, width, lastBtnInRow, code) {
    const key = new Key(value, additValue, code, width, lastBtnInRow);

    const createContainerForKey = document.querySelector('.keyboard').appendChild(document.createElement('div'));
    createContainerForKey.classList.add(`${key.code}`, 'key', `${width}`);

    createContainerForKey.innerHTML = `
        <p class="value ">${key.value}</p>
        <div class="additValueWrapper">
            <p class="additValue">${key.additValue}</p>
        </div>   
        `;
    if (key.lastBtnInRow) {
      const clearfix = document.querySelector('.keyboard').appendChild(document.createElement('div'));
      clearfix.classList.add('clearfix');
    }
  },
  createKeyboard(Settings) {
    Settings.forEach((element)=>{
      if (lang === 'EN') {
        let mainValue = element.valueEN;
        let additValue = element.additValueEN;
        if (capslockPress) {
          if (element.upperValueEN) {
            mainValue = element.upperValueEN;
          }
        }
        if (shiftPress) {
          if (mainValue === element.valueEN) {
            if (element.upperValueEN) {
              mainValue = element.upperValueEN;
            }
          } else {
            mainValue = element.valueEN;
          }
          if (element.additValueEN) {
            additValue = mainValue;
            mainValue = element.additValueEN;
          }
        }
        Keyboard.addKey(mainValue, additValue, element.width, element.lastBtnInRow, element.code);
      } else if (lang === 'RU') {
        let mainValue = element.valueRU;
        let additValue = element.additValueRU;
        if (capslockPress) {
          if (element.upperValueRU) {
            mainValue = element.upperValueRU;
          }
        }
        if (shiftPress) {
          if (mainValue === element.valueRU) {
            if (element.upperValueRU) {
              mainValue = element.upperValueRU;
            }
          } else {
            mainValue = element.valueRU;
          }
          if (element.additValueRU) {
            additValue = mainValue;
            mainValue = element.additValueRU;
          }
        }
        Keyboard.addKey(mainValue, additValue, element.width, element.lastBtnInRow, element.code);
      }
    });
    let keys = document.querySelectorAll('.key');
    keys.forEach((key) => {
      key.addEventListener('mousedown', ()=>{
        regenerateKeyboardUnderPressDown(key.classList[0]);
        generateValueFromPressedButton(key);
      });
      key.addEventListener('mouseup', ()=>{
        regenerateKeyboardUnderPressUp(key.classList[0]);
        removeAllActiveClassFromKeys();
        document.querySelector('#input').focus();
      });
    });
  }
};
window.onload = () => {
  Keyboard.init();
  Keyboard.createKeyboard(keysSettings);
};

function regenerateKeyboardUnderPressDown(value) {
  if (document.querySelector(`.${value}`)) {
    document.querySelector(`.${value}`).classList.add('active');
  }
  if (value === 'ShiftLeft' || value === 'ShiftRight') {
    if (!shiftPress) {
      shiftPress = true;
      Keyboard.clearKeys();
      Keyboard.createKeyboard(keysSettings);
    }
  }

  pressed.add(value);
  for (let code of ['ShiftLeft', 'AltLeft']) {
    if (!pressed.has(code)) {
      return;
    }
  }
  pressed.clear();
  if (lang === 'EN') {
    lang = 'RU';
    localStorage.setItem('lang', lang);
    Keyboard.clearKeys();
    Keyboard.createKeyboard(keysSettings);
  } else {
    lang = 'EN';
    localStorage.setItem('lang', lang);
    Keyboard.clearKeys();
    Keyboard.createKeyboard(keysSettings);
  }
}
function regenerateKeyboardUnderPressUp(value) {
  if (document.querySelector(`.${value}`)) {
    document.querySelector(`.${value}`).classList.remove('active');
  }
  if (value === 'ShiftLeft' || value === 'ShiftRight') {
    shiftPress = false;
    Keyboard.clearKeys();
    Keyboard.createKeyboard(keysSettings);
  }
  if (value === 'CapsLock') {
    if (capslockPress) {
      capslockPress = false;
      localStorage.setItem('capslockPress', capslockPress);
      Keyboard.clearKeys();
      Keyboard.createKeyboard(keysSettings);
    } else {
      capslockPress = true;
      localStorage.setItem('capslockPress', capslockPress);
      Keyboard.clearKeys();
      Keyboard.createKeyboard(keysSettings);
    }
  }

  pressed.delete(value);
}
function removeAllActiveClassFromKeys() {
  const keys = document.querySelectorAll('.key');
  keys.forEach((key) => {
    if (key.classList.contains('active')) {
      key.classList.remove('active');
    }
  });
}
function generateValueFromPressedButton(button) {
  if (button !== null) {
    const buttonValue = button.firstElementChild.innerHTML;
    if (buttonValue === '←') {
      if (selectionStart !== 0) { selectionStart -= 1; }
    }
    if (buttonValue === '→') {
      if (selectionStart < document.querySelector('#input').textLength) {
        selectionStart += 1;
      }
    }

    if (
      buttonValue !== 'Tab'
        && buttonValue !== 'Caps Lock'
        && buttonValue !== 'Shift Left'
        && buttonValue !== 'Ctrl'
        && buttonValue !== 'Win'
        && buttonValue !== 'Alt'
        && buttonValue !== 'Shift'
        && buttonValue !== '→'
        && buttonValue !== '←'
    ) {
      let inputValue = '';
      if (buttonValue === 'DEL') {
        container.splice(selectionStart, 1);
        for (let i = 0; i < container.length; i += 1) {
          inputValue += container[i];
        }
      } else if (buttonValue === 'Backspace') {
        container.splice(selectionStart - 1, 1);
        for (let i = 0; i < container.length; i += 1) {
          inputValue += container[i];
        }
        if (selectionStart !== 0) { selectionStart -= 1; }

        currentCursor(selectionStart);
      } else if (buttonValue === 'Enter') {
        container.splice(selectionStart, 0, '\n');
        for (let i = 0; i < container.length; i += 1) {
          inputValue += container[i];
        }
        if (selectionStart !== document.querySelector('#input').textLength) {
          if (selectionStart < document.querySelector('#input').textLength) {
            selectionStart += 1;
          }
        } else {
          selectionStart = document.querySelector('#input').textLength + 1;
        }
        currentCursor(selectionStart);
      } else {
        container.splice(selectionStart, 0, buttonValue);
        for (let i = 0; i < container.length; i += 1) {
          inputValue += container[i];
        }
        if (selectionStart !== document.querySelector('#input').textLength) {
          if (selectionStart < document.querySelector('#input').textLength) {
            selectionStart += 1;
          }
        } else {
          selectionStart = document.querySelector('#input').textLength + 1;
        }
      }

      document.querySelector('#input').value = inputValue;
    }
  }
  document.querySelector('#input').focus();
  currentCursor(selectionStart);
}
function currentCursor(selectStart) {
  const selectEnd = selectStart;
  document.querySelector('#input').selectionStart = selectStart;
  document.querySelector('#input').selectionEnd = selectEnd;
}
document.addEventListener('keydown', (event) => {
  document.querySelector('#input').blur();
  regenerateKeyboardUnderPressDown(event.code);
});
document.addEventListener('keyup', (event) => {
  regenerateKeyboardUnderPressUp(event.code);

  generateValueFromPressedButton(document.querySelector(`.${event.code}`));
});
window.addEventListener('blur', () => {
  removeAllActiveClassFromKeys();
});
