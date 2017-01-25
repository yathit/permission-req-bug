// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var pagePort = chrome.runtime.connect({name: "knockknock"});


var fg = document.createElement('div');
fg.style.position = 'fixed';
fg.style.top = '0';
fg.style.backgroundColor = 'lightgoldenrodyellow';
fg.innerHTML = `<button id="btnp">Positive</button> 
<button id="btn_t2">Positive 2</button>
<button id="btnt">Test</button>
<dialog id="dialog">
  Request to background?
  <div>
    <button id="btn_ok" value="OK">OK</button>
    <button id="btn_cancel" value="Cancel">Cancel</button>
  </div>
</div>
</dialog>
<div id="result" style="margin-top: 8px; padding: 8px; "></div>
`;
document.body.appendChild(fg);

var perm = {'origins': [location.origin + '/*']};

document.getElementById('btnp').onclick = function(ev) {
  pagePort.postMessage({action: 'Test', perm: perm});
};

document.getElementById('btn_t2').onclick = function(ev) {
  if (window.confirm('Request to background?')) {
    pagePort.postMessage({action: 'Test 2', perm: perm});
  }
};

document.getElementById('btnt').onclick = function(ev) {
  var dialog = document.getElementById('dialog');
  dialog.onclose = function(ev) {
    if (dialog.returnValue == 'OK') {
      console.log('posting message');
      pagePort.postMessage({action: dialog.returnValue, perm: perm});
    } else {
      if (!window.confirm('Are you sure you do not want to request to background?')) {
        pagePort.postMessage({action: 'Neg 2', perm: perm});
      }
    }
  };
  dialog.showModal();
};

document.getElementById('btn_ok').onclick = function(ev) {
  dialog.close(ev.target.value);
};


document.getElementById('btn_cancel').onclick = function(ev) {
  dialog.close(ev.target.value);
};

pagePort.onMessage.addListener(function(msg) {
  console.log(msg);
  document.getElementById('result').innerText += '\n' + msg.action + ' ' + msg.result;
});