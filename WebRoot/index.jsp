<%@page import="java.sql.Array"%>
<%@ page language="java" import="java.util.*, com.mh.commons.constants.AuthConstant,  com.mh.service.impl.LoginServiceImpl" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %> 
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%
LoginServiceImpl loginService = new LoginServiceImpl();
loginService.refresh(request);
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String resourceRoot = "/common/appmobile";
request.setAttribute("ver", "20170007");
request.setAttribute("dev", true);
Map<String, String> header = (HashMap<String, String>)request.getSession().getAttribute("header");
if (null != header) {
    request.setAttribute("_userName", header.get(AuthConstant.HEADER_USERNAME));
    request.setAttribute("_hasSetWithdrawProfile", header.get(AuthConstant.HAVE_SET_WITHDRAW_PROFILE));
}
String agent = request.getParameter("p");
Object oldagent = request.getSession().getAttribute("agent");
if ( agent != null && agent != "" ) {
    request.getSession().setAttribute("agent", agent);
    oldagent = agent;
}
request.setAttribute("_agent", oldagent != null && oldagent != "" ? oldagent.toString(): "");
%> 

<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1, minimum-scale=1"> 
	
	<script type="text/javascript">
	   var _userName = "${_userName }";
	   var _agent = "${_agent}";
	   var _hasSetWithdrawProfile = "${_hasSetWithdrawProfile}";
	</script> 
	
	<!-- http://stackoverflow.com/questions/11761864/how-to-define-the-website-screen-shortcut-icon  -->
	
	<c:choose>
	<c:when test="${dev eq true }">
	 <!--<link rel="stylesheet" href="http://192.168.0.129:3939/dist/style.css?ver=${ver }">-->
	 <link rel="stylesheet" href="http://127.0.0.1:3939/dist/style.css?ver=${ver }">  
     <script src="http://127.0.0.1:3939/target/target-script-min.js#anonymous"></script> 
	</c:when>
	<c:otherwise>
	 <link rel="stylesheet" href="./dist/style.css?ver=${ver }"> 
	</c:otherwise>
	</c:choose>
 
	 <style type="text/css">
		 body.openning  > .loading {
	        position: fixed;
	        width: 100%;
	        top: 0px;
	        height: 100%;
	        left: 0px;
	        background: #eaeaea;
	        z-index: 1111;
		 }
		 
		 body.openning  > .loading .inner {
		    height: 60px;
		    width: 50px;
		    z-index: 10;
		    opacity: 1;
		    display: inline-block;
		    position: relative;
		    -webkit-transition: all 0.3s ease-in-out;
		    transition: all 0.3s ease-in-out;
		    top: 20%;
		    left: 50%;
		    margin-left: -25px;
		 }
		 
		 body.openning  > .loading .inner > div {
	        height: 100%;
	        width: 7px;
	        margin: 0 3px 0 0;
	        background-color: #76c4f1;;
	        display: inline-block;
	        -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
	        animation: sk-stretchdelay 1.2s infinite ease-in-out;
	        float: left;
		 }
		
	     body.openning  > .loading .inner .rect2 {
	       -webkit-animation-delay: -1.1s;
	       animation-delay: -1.1s;
	     }
	
	     body.openning  > .loading .inner .rect3 {
	       -webkit-animation-delay: -1.0s;
	       animation-delay: -1.0s;
	     }
	
	     body.openning  > .loading .inner .rect4 {
	       -webkit-animation-delay: -0.9s;
	       animation-delay: -0.9s;
	     }
	
	     body.openning  > .loading .inner .rect5 {
	       -webkit-animation-delay: -0.8s;
	       animation-delay: -0.8s;
	     }
        
        @-webkit-keyframes sk-stretchdelay {
          0%, 40%, 100% { -webkit-transform: scaleY(0.4) }  
          20% { -webkit-transform: scaleY(1.0) }
        }
        
        @keyframes sk-stretchdelay {
          0%, 40%, 100% { 
            transform: scaleY(0.4);
            -webkit-transform: scaleY(0.4);
          }  20% { 
            transform: scaleY(1.0);
            -webkit-transform: scaleY(1.0);
          }
        }
		
		@keyframes sk-bg {
		  0% {
		    background: #fff;
		    opacity: 1;
		  }
		
		  100% {
		    background: #eee;
		    opacity: 0.8
		  }
		}
	 </style>
 
	
  </head>
  
<body class="openning">
  <div id="application"></div> 
  
  <c:choose>
     <c:when test="${dev eq true }">
      <script src="http://127.0.0.1:3939/dist/vendor.js?ver=${ver }"></script> 
      <script src="http://127.0.0.1:3939/dist/main.js?ver=${ver }"></script> 
     </c:when>
     <c:otherwise>
     <div class="loading">
        <div class="inner">
          <div class="rect1"></div>
          <div class="rect2"></div>
          <div class="rect3"></div>
          <div class="rect4"></div>
          <div class="rect5"></div>
        </div>
      </div>
      <script type="text/javascript">
        document.body.className = 'openning';
        var scripts = ["/dist/vendor.js", "/dist/main.js"];
        var crtIndex = 0;
        function finishLoad() {
          document.body.className = document.body.className.replace('openning', '');
        }
    
        (function loadScript(script) {
          if (crtIndex > scripts.length - 1) {
            finishLoad();
          } else {
            var html = document.createElement('script');
            html.type = 'text/javascript';
            html.src = script;
            html.onload = function () {
              crtIndex += 1;
              loadScript(scripts[crtIndex]);    
            };
            document.body.appendChild(html);
          }
    
        })(scripts[crtIndex]);
      </script>
     </c:otherwise>
    </c:choose>
  
</body>
</html>
