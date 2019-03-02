<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>用户登录</title>
</head>
<style>
    <!--
    .randPic{
        vertical-align: bottom;
        margin-bottom: 1px;
        margin-left: 3px;
        width: 46px;
        height: 23px
    }
    -->
</style>
<script src="/src/scripts/jquery.js" type="text/javascript"></script>
<script type="text/javascript">
    function createCode() {
        $("#img_validateCode").attr("src","${ctx}/resources-code.jpg?" + new Date().getTime());
    }
</script>
<body>
<form action="${pageContext.request.contextPath }/user/login"
      method="post">
    用户名:<input type="text" name="userName"/><br/>
    密码:<input type="text" name="password"/><br/>
    验证码： <input type="text" name="verifycode" />
<%--OK--%>
    <%--<img ref="code_img" src=/resources-code.jpg + "?t=" + timestamp() }--%>
    <%--onClick={this.refreshCodeImg }/>--%>

    <label id="validateCodeLabelId"
           onclick="javascript:createCode();">
    <img src="${ctx}/resources-code.jpg?" + new Date().getTime() class="randPic"
            id="img_validateCode">
    </label>
    <input type="submit" value="登陆"/>
</form>
</body>
</html>