var captchaRequestURL = "https://qpqpqpqpqp.com/captcha";
function createNotification(message, duration = 12000) {
  // 创建通知容器
  const notificationDiv = document.createElement("div");
  notificationDiv.textContent = message;

  // 添加样式
  Object.assign(notificationDiv.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#323232",
    color: "#ffffff",
    padding: "10px 20px",
    borderRadius: "5px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    opacity: "0",
    transform: "translateY(20px)",
    transition: "opacity 0.5s, transform 0.5s",
    zIndex: "1000",
    maxWidth: "300px",
    whiteSpace: "wrap",
    fontSize: "16px",
    boxSizing: "border-box",
    wordWrap: "break-word",
    wordBreak: "break-word",
  });

  // 添加到页面
  document.body.appendChild(notificationDiv);

  // 显示通知
  setTimeout(() => {
    notificationDiv.style.opacity = "1";
    notificationDiv.style.transform = "translateY(0)";
  }, 10);

  // 定时隐藏通知
  setTimeout(() => {
    notificationDiv.style.opacity = "0";
    notificationDiv.style.transform = "translateY(20px)";

    // 移除通知
    setTimeout(() => {
      notificationDiv.remove();
    }, 500); // 确保动画完成后移除
  }, duration);
}
function fillInfo(captcha) {
  chrome.runtime.sendMessage({ type: "getData" }, (response) => {
    console.log("Response:", response);
    if (response.success) {
      document.querySelector("#TextBoxUserName").value = response.username;
      document.querySelector("#TextBoxPassword").value = response.password;
      document.querySelector("#txtVerifyCode").value = captcha;
      console.log("Captcha auto-filled!");
      document.querySelector("button#btnLogin").click();
    } else {
      createNotification("错误: " + response.message);
    }
  });
}
function ImageToBlob(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => {
    canvas.toBlob(resolve); // implied image/png format
  });
}

function handleVarifyImage(imgElement) {
  console.log("imgElement", imgElement);
  if (imgElement) {
    ImageToBlob(imgElement).then((blob) => {
      const formData = new FormData();
      formData.append("image", blob, "captcha.png");
      console.log("form data builded");
      fetch(captchaRequestURL, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          console.log("Captcha recognized:", data);
          if (data.length == 0) {
            createNotification(
              `[来自验证码自动填入插件的信息] 拿到了一个空验证码？如果提示不安全，关掉网络代理再试试？`
            );
            return;
          }
          // document.querySelector("#TextBoxUserName").value = "22301167";
          // document.querySelector("#TextBoxPassword").value = "youziyv1";
          // document.querySelector("#txtVerifyCode").value = data;
          // console.log("Captcha auto-filled!");
          // document.querySelector("button#btnLogin").click();
          fillInfo(data);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          if (
            error.message.includes(
              "Cannot set properties of null (setting 'value')"
            )
          ) {
            return;
          }
          createNotification(
            `[来自验证码自动填入插件的信息] 验证码上传失败: ${error}，请暂时关闭代理或点击验证码重新加载尝试，或手动输入验证码。如果一直这样，访问 https://github.com/qingzhengQB/bjtu-bksy-fast-login 获取最新版本(或跑路消息 bushi)`
          );
        });
    });
  }
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.tagName === "IMG") {
        var img = document.getElementById("imgValidateCode");
        if (img) {
          if (img.complete) {
            handleVarifyImage(img);
          } else {
            img.onload = function () {
              console.log("img.onload");
              handleVarifyImage(img);
            };
          }
        }
      }
    });
  });
});

observer.observe(document, { childList: true, subtree: true });
