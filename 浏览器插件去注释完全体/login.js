// 修改了函数 DoFresh，将img对象新增了crossOrigin属性，解决了跨域问题
var userCenterPath = "https://bksycenter.bjtu.edu.cn";
var type = "4"; //1是学生，2是家长，4是校友，3是教师
var isDefine = false;
$(function () {
  showLogin();
  DoFresh();
  getLoginInfo();
  $(window).resize(function () {
    resizeSplit();
  });
  $("#imgValidateCode").click(function () {
    DoFresh();
  });
  $(".right4").click(function () {
    DoFresh();
  });
});
function resizeSplit() {
  var height = Math.max(
    $("#divSplit").prev().height(),
    $("#divSplit").next().height()
  );
  $("#divSplit").height(height);
}
function getLoginInfo() {
  jQuery.ajax({
    type: "post",
    timeout: 20000, //超时时间设置，单位毫秒
    url: userCenterPath + "/LoginAjax.aspx",
    dataType: "jsonp",
    jsonp: "callback",
    data: "callback=?&TestConnect=1",
    success: function (msg) {
      var result = msg.result;
      var LoginInUIA = msg.LoginInUIA;
      var UserName = msg.UserName;
      if (UserName != "") {
        showLoginOver(LoginInUIA);
      } else {
        //  showLogin();
      }
    },
    complete: function (XMLHttpRequest, status) {
      //请求完成后最终执行参数
    },
  });
}
function showLoginOver(LoginInUIA) {
  $(".semester").show();
  $(".not_teacher").hide();
  $(".login_teacher").hide();
  $(".loginOver").show();
  $("header").hide();
  $(".top").show();
  $(".topTime").hide();
  $(".impor_teacher").remove();
  $(".tdCommonBusness").remove();

  $("#divMiddle").addClass("divSubMenuList");
  var loginTable = '<div class="speedWay' + (type == 3 ? 1 : 3) + '">';
  loginTable += '<p class="speedWay">欢迎：' + LoginInUIA + "</p>";
  loginTable +=
    '<div><a href=\'https://bksycenter.bjtu.edu.cn\'>进入个人中心</a><a id="aLogOut" onclick="javascript:ExitAndLogOut();">注销</a></div></div>';
  $("#divLogin").html(loginTable);
  getMenu();
}
function getMenu() {
  var url = userCenterPath + "/IndexMenuHandler.ashx";
  jQuery.ajax({
    type: "post",
    timeout: 20000, //超时时间设置，单位毫秒
    url: url,
    dataType: "jsonp",
    jsonp: "callback",
    data: "callback=?&method=BulidMenuFromJSONP&pid=0",
    success: function (msg) {
      $("#spUserName").text(msg[1].userName);
      menuJson = msg[0].menu;
      var menuTwoModel =
        '<div class="divSubMenu"><a href="{0}" data-id="{2}" target="_blank" title="{1}">{1}</a></div>';
      var menuOneModel =
        '<div class="divSubMenu"><a data-id="{1}" target="_blank" title="{0}">{0}</a></div>';
      var menuThirdModel =
        '<div class=""><a href="{0}" data-id="{2}" target="_blank" title="{1}">{1}</a></div>';
      for (var i = 0; i < menuJson.length; i++) {
        if (menuJson[i].href != null) {
          if (menuJson[i].orderMenu < 100) {
            $("#div1")
              .next()
              .append(
                menuTwoModel.format(
                  userCenterPath + menuJson[i].href,
                  menuJson[i].name,
                  menuJson[i].id
                )
              );
          } else if (menuJson[i].orderMenu < 200) {
            $("#div2")
              .next()
              .append(
                menuTwoModel.format(
                  userCenterPath + menuJson[i].href,
                  menuJson[i].name,
                  menuJson[i].id
                )
              );
          } else if (menuJson[i].orderMenu < 300) {
            $("#div3")
              .next()
              .append(
                menuTwoModel.format(
                  userCenterPath + menuJson[i].href,
                  menuJson[i].name,
                  menuJson[i].id
                )
              );
          } else if (menuJson[i].orderMenu < 310) {
            $("#div45")
              .next()
              .append(
                menuTwoModel.format(
                  userCenterPath + menuJson[i].href,
                  menuJson[i].name,
                  menuJson[i].id
                )
              );
          } else {
            $("#div5")
              .next()
              .append(
                menuTwoModel.format(
                  userCenterPath + menuJson[i].href,
                  menuJson[i].name,
                  menuJson[i].id
                )
              );
          }
        } else {
          $("#div5")
            .next()
            .append(menuOneModel.format(menuJson[i].name, menuJson[i].id));
          var div = $("<p></p>");
          $("a[data-id='" + menuJson[i].id + "']")
            .parent()
            .append(div);
          for (var j = 0; j < menuJson[i].children.length; j++) {
            div.append(
              menuThirdModel.format(
                userCenterPath + menuJson[i].children[j].href,
                menuJson[i].children[j].name,
                menuJson[i].children[j].id
              )
            );
          }
        }
      }
      if ($("#div1").next().children().length == 0) {
        $("#div1").hide();
      }
      if ($("#div2").next().children().length == 0) {
        $("#div2").hide();
      }
      if ($("#div3").next().children().length == 0) {
        $("#div3").hide();
      }
      setSemesterHeight();
    },
    complete: function (XMLHttpRequest, status) {
      //请求完成后最终执行参数
      resizeSplit();
    },
  });
}
function DoFresh() {
  if (!$("#pVerifyCode").is(":hidden")) {
    var img = $("#imgValidateCode");
    console.log("inner ", img);
    if (!isDefine) {
      img.attr("crossOrigin", "use-credentials");
      console.log('set crossOrigin "use-credentials"');
      isDefine = true;
    }
    img.attr(
      "src",
      "https://bksycenter.bjtu.edu.cn/LoginAjax.aspx?createvc=true&random=" +
        Math.random()
    );
  }
}
function showLogin() {
  $(".semester").hide();
  $(".not_teacher").show();
  $(".login_teacher").show();
  $(".loginOver").hide();
  $("header").show();
  $(".top").hide();
  $(".topTime").show();
  $("#divMiddle").removeClass("divSubMenuList");
  $("#divLogin").html("");
  $("#divLogin").append(
    '<h4 class="text-center"><strong>' +
      (type == 3 ? "教师" : type == 4 ? "校友" : "学生") +
      "登录</strong></h4>"
  );
  $("#divLogin").append(
    '<input type="text" class="form-control1 marginTop20" id="TextBoxUserName" name="TextBoxUserName" placeholder="' +
      (type == 3 ? "工" : "学") +
      '号" />'
  );
  $("#divLogin").append(
    '<input type="password" class="form-control2 marginTop20" id="TextBoxPassword" name="TextBoxPassword" placeholder="密码" />'
  );
  $("#divLogin").append(
    '<input type="text" class="form-control2 marginTop20" id="txtVerifyCode" name="TextBoxPassword" placeholder="验证码" style="width: 50%;display: inline-block;float: left;" />'
  );
  $("#divLogin").append(
    '<img src="https://bksycenter.bjtu.edu.cn/LoginHandler.ashx?createvc=true" alt="点击刷新" id="imgValidateCode" style="height: 46px;vertical-align: top;cursor: pointer;margin: 20px 0px 0px 18px;display: inline-block;float: left;">'
  );
  $("#divLogin").append(
    '<p class="right4" style="height: 30px;vertical-align: top;float: right;cursor: pointer;margin: 24px 23px 0px 0px;text-align: right;display: inline-block;">点击图片刷新</p>'
  );
  $("#divLogin").append(
    '<a href="https://bksycenter.bjtu.edu.cn/UserInfoSettings/PasswordRetake.aspx?type=3">忘记密码？</a>'
  );
  $("#divLogin").append(
    '<button id="btnLogin" onclick="login()">登 录</button>'
  );
  $("#divLogin").append(
    '<input id="rbWeb" name="to" value="rbWeb" type="radio" style="display:none;" />'
  );
  $("#divLogin").append(
    '<input id="rbUserCenter" name="to" value="rbUserCenter" checked="checked" type="radio" style="display:none;" />'
  );
  $("#TextBoxUserName")[0].onkeypress = function (e) {
    var e = typeof event != "undefined" ? window.event : e; // IE : Moz
    if (e.keyCode == 13 || e.which == 13) {
      if (document.activeElement.id == "TextBoxUserName")
        $("#TextBoxPassword").focus();
      else {
        login();
      }
    }
  };
  $("#TextBoxPassword")[0].onkeypress = function (e) {
    var e = typeof event != "undefined" ? window.event : e; // IE : Moz
    if (e.keyCode == 13 || e.which == 13) {
      if (document.activeElement.id == "TextBoxPassword")
        $("#txtVerifyCode").focus();
      else {
        login();
      }
    }
  };
  $("#txtVerifyCode")[0].onkeypress = function (e) {
    var e = typeof event != "undefined" ? window.event : e; // IE : Moz
    if (e.keyCode == 13 || e.which == 13) {
      login();
    }
  };
  $("#TextBoxUserName").focus();
}
function getKey(e) {
  var e = typeof event != "undefined" ? window.event : e; // IE : Moz
  if (e.keyCode == 13 || e.which == 13) {
    if (document.activeElement.id == "TextBoxUserName")
      $("#TextBoxPassword").focus();
    else {
      login();
    }
  }
}
function nameFocus() {
  DoFresh();
  $("#TextBoxUserName").focus();
}
function pwdFocus() {
  DoFresh();
  $("#TextBoxPassword").focus();
}
function vcFocus() {
  $("#txtVerifyCode").focus();
  $("#txtVerifyCode").select();
}
function login() {
  var name = $.trim($("#TextBoxUserName").val());
  var pwdData = $("#TextBoxPassword").val();
  var vc = $("#txtVerifyCode").val();
  if (name.length == 0) {
    alert("请输入用户名。");
    $("#divTip").show();
    nameFocus();
    return;
  } else if (pwdData.length == 0) {
    alert("请输入密码。");
    $("#divTip").show();
    pwdFocus();
    return;
  } else if (vc.length == 0 && !$("#txtVerifyCode").is(":hidden")) {
    alert("请输入验证码。");
    $("#divTip").show();
    vcFocus();
    return;
  }
  $("#btnLogin").attr("disabled", "true").text("登录中");
  ajaxTimeoutTest = jQuery.ajax({
    type: "post",
    timeout: 20000, //超时时间设置，单位毫秒
    url: "https://bksycenter.bjtu.edu.cn/LoginAjax.aspx",
    dataType: "jsonp",
    jsonp: "callback",
    data: { username: name, password: pwdData, verifyCode: vc, type: type },
    success: function (msg) {
      var result = msg.result;
      var LoginInUIA = msg.LoginInUIA;
      var UserName = msg.UserName;
      if (result == "0") {
        //首次登录需要修改密码
        window.location.href =
          "https://bksycenter.bjtu.edu.cn/UserInfoSettings/PasswordChange.aspx?PasswordChangeUserName=" +
          UserName;
      } else if (result == "1") {
        //成功
        var toweb = $("#rbWeb")[0].checked;
        //   if (toweb) {
        //       window.location.href = "https://bksy.bjtu.edu.cn/Admin/UserInfo/Login.aspx?LoginInUIA=" + LoginInUIA + "&UserName=" + UserName;
        //   }
        //   else {
        //       window.location.href = "https://bksy.bjtu.edu.cn/Admin/UserInfo/Login.aspx?LoginInUIA=" + LoginInUIA + "&UserName=" + UserName + "&LoginFor=";
        //   }
        getLoginInfo();
      } else if (result == "2") {
        alert("密码错误。");
        $("#TextBoxPassword").select();
        DoFresh();
      } else if (result == "3") {
        alert("用户不存在。");
        $("#TextBoxUserName").focus();
        DoFresh();
      } else if (result == "4") {
        alert("输入的信息有误。");
      } else if (result == "verifyCodeTimeOut") {
        $("#pVerifyCode").show();
        $(".right4").show();
        alert("验证码已过期，请重新获取。");
        $("#divTip").show();
      } else if (result == "wrongVerifyCode") {
        $("#pVerifyCode").show();
        $(".right4").show();
        alert("验证码错误请重新输入！");
        $("#divTip").show();
        vcFocus();
      } else {
        alert("请勿重复登录。");
      }
      $("#btnLogin").removeAttr("disabled").text("登录");
    },
    complete: function (XMLHttpRequest, status) {
      //请求完成后最终执行参数
      if (status == "timeout") {
        //超时,status还有success,error等值的情况
        ajaxTimeoutTest.abort();
        $("#screen").hide();
        alert(
          "您现在未接入我校校园网，若要访问，请先使用我校VPN通道登录，然后再进行其它操作。"
        );
      } else if (status == "error") {
        ajaxTimeoutTest.abort();
        $("#screen").hide();
        alert(
          "您现在未接入我校校园网，若要访问，请先使用我校VPN通道登录，然后再进行其它操作。"
        );
      }
      $("#ButtonLogin").removeAttr("disabled");
    },
  });
}
$(function () {
  $("body").delegate(".divSubMenu", "click", function (e) {
    var p = $(this).find("p");
    if (p.length > 0) {
      if (p.is(":visible")) {
        p.hide();
      } else {
        $(".divSubMenu").find("p").hide();
        p.show();
      }
    }
  });
});
