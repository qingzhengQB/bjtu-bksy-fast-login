function setData(usernameValue, passwordValue, callback) {
  // 存储数据
  chrome.runtime.sendMessage(
    { type: "setData", username: usernameValue, password: passwordValue },
    (response) => {
      if (response.success) {
        callback(true);
      } else {
        console.log("Error:", response.message);
        callback(false);
      }
    }
  );
}
document.getElementById("close-button").addEventListener("click", () => {
  const username = document.getElementById("username").value,
    password = document.getElementById("password").value;
  if (username == "" || password == "") {
    alert("用户名或密码不能为空");
    return;
  }
  setData(username, password, (success) => {
    if (success) {
      console.log("保存成功");
      window.close();
    } else {
      alert("保存失败");
    }
  });
});
