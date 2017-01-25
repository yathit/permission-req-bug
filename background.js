



chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    console.log('receiving msg', msg);
    chrome.permissions.request(msg.perm, function(grant) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        msg.result = chrome.runtime.lastError.message;
        port.postMessage(msg);
      } else {
        msg.result = 'OK';
        port.postMessage(msg);
      }
    });
  });
});
