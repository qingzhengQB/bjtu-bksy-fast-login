chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install" || details.reason === "update") {
    chrome.windows.create({
      type: "popup",
      url: "popup.html",
      width: 400,
      height: 400,
    });
  }
});

var cookie_SAAS = "";
chrome.cookies.get(
  { url: "https://bksycenter.bjtu.edu.cn/", name: "EXESAC.SAAS.SessionId" },
  function (cookie) {
    if (cookie) {
      console.log("Cookie value:", cookie.value);
      cookie_SAAS = cookie.value;
    } else {
      console.log("Cookie not found");
    }
  }
);
chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    const secFetchModeHeaderIndex = details.requestHeaders.findIndex(
      (header) => header.name.toLowerCase() === "sec-fetch-mode"
    );
    if (secFetchModeHeaderIndex !== -1) {
      details.requestHeaders.splice(secFetchModeHeaderIndex, 1);
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["*://*/*"] },
  ["blocking", "requestHeaders"]
);

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.url.includes("https://bksy.bjtu.edu.cn/Scripts/Login.js")) {
      return { redirectUrl: chrome.runtime.getURL("login.js") };
    }
    return { cancel: false };
  },
  { urls: ["*://*/*"] },
  ["blocking", "extraHeaders"]
);

chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    const headers = details.responseHeaders;

    headers.push({
      name: "Access-Control-Allow-Origin",
      value: "https://bksy.bjtu.edu.cn",
    });
    headers.push({ name: "Access-Control-Allow-Credentials", value: "true" });
    details.responseHeaders = headers;
    return { responseHeaders: details.responseHeaders };
  },
  { urls: ["https://bksycenter.bjtu.edu.cn/LoginAjax.aspx?createvc=*"] },
  ["blocking", "responseHeaders"]
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "setData") {
    const { username, password } = message;
    console.log(message);
    window.localStorage.setItem("username", username);
    window.localStorage.setItem("password", password);
    sendResponse({ success: true });
  } else if (message.type === "getData") {
    const username = window.localStorage.getItem("username"),
      password = window.localStorage.getItem("password");
    if (username && password) {
      sendResponse({ success: true, username: username, password: password });
    } else {
      sendResponse({
        success: false,
        message: "数据不完整。请重新加载拓展填写完整正确账号密码",
      });
    }
  } else {
    sendResponse({ success: false, message: "Unknown message type" });
  }
  return true;
});
