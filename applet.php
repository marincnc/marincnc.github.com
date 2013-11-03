<html>
<head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title></title>
        <style type="text/css">
<!--
.style1 {
	font-size: 20px;
	font-family: Verdana, Arial, Helvetica, sans-serif;
}
.style2 {font-family: Verdana, Arial, Helvetica, sans-serif}
body {
	margin-left: 20px;
}
.style3 {
	font-size: 25px;
	font-weight: bold;
}
.style7 {
	font-size: 24px;
	font-weight: bold;
}
.style9 {font-size: 24px}
-->
        </style>
</head>
<body>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <table border="0" valign="middle" align="left" cellpadding="15">
        <tr>
           <td width="148" valign="middle">
                   
             <div style="border: 0px groove #336699; padding:4px">
                  <?      
    $useApplet=0;
    $user_agent = $_SERVER['HTTP_USER_AGENT'];

    if(stristr($user_agent,"konqueror") || stristr($user_agent,"macintosh") || stristr($user_agent,"opera"))
    {
        $useApplet=1;
        echo '<applet name="Rad Upload Plus"
                        archive="dndplus.jar"
                        code="com.radinks.dnd.DNDAppletPlus"
                        width="280"
                        height="280">';
            
    }
    else
    {
        if(strstr($user_agent,"MSIE")) {
                echo '<script language="javascript" src="embed.js" type="text/javascript"></script>';
                echo '<script>IELoader()</script>';
        } else {
                echo '<object type="application/x-java-applet;version=1.4.1"
                        width= "290" height= "280"  id="rup" name="rup">';
                echo '  <param name="archive" value="dndplus.jar">
                    <param name="code" value="com.radinks.dnd.DNDAppletPlus">
                    <param name="name" value="Rad Upload Plus">';

        }
    }
?>
                  <!-- BEGIN APPLET CONFIGURATION PARAMETERS -->
                  <param name="max_upload" value="100000">
                  <!-- size in kilobytes (takes effect only in Rad Upload Plus) -->
                  <param name = "message" value="Dosyayı bu alana sürükleyip bırakınız">
                  <!-- edit the above line to customize the welcome message displayed. example
            value='http://www.radinks.com/upload/init.html' -->
                  <param name='url' value='http://marincnc.com/upload.php'>
                  <!-- you can pass additional parameters by adding them to the url-->
                  <!-- to upload to an ftp server instead of a web server, please specify a url
                    in the following format:
            ftp://username:password@ftp.myserver.com
            replacing username, password and ftp.myserver.com with corresponding entries for your site -->
                  <!-- END APPLET CONFIGURATION PARAMETERS -->
                  <?
		if(isset($_SERVER['PHP_AUTH_USER']))
		{
			printf('<param name="chap" value="%s">',
				base64_encode($_SERVER['PHP_AUTH_USER'].":".$_SERVER['PHP_AUTH_PW']));
		}
		
		if($useApplet == 1)
		{
			echo '</applet>';
		}
		else
		{
                        echo '</object>';
                }
?>
             </div>
          </td>
           <td width="425"><p class="style2"><span class="style1 style3" style="color:#000033"><span class="style7">Dosya Gönderim Sihirbazı</span></span><br>
  <br>             
    3D Dosyalarınızı sol taraftaki kutucuğa sürükleyip bırakarak ya da Ctrl+C / Ctrl+V fonksiyonunu kullanarak gönderi yapabilirsiniz.</p>
             <p class="style2">Sihirbazı göremiyorsanız; <a href="http://www.java.com" target="_blank">http://www.java.com</a>/ adresinden java yazılımını yüklemelisiniz.</p>
          <p class="style2"><span class="style7">FTP Bilgileri</span></p>
          <p class="style2">adres: <a href="ftp://up%40marincnc.com:loads@ftp.marincnc.com" target="_blank">ftp.marincnc.com</a><br>
            kullanıcı adı: upmarin<br>
            parola: Up1oads</p>
          </td>
        </tr>
  </table>
</body>
</html>

