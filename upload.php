<html>
<head><title></title>
<style type="text/css">
<!--
.style1 {
	font-family: Verdana, Arial, Helvetica, sans-serif;
	font-size: 10px;
}
.style2 {
	font-size: 12px;
	font-weight: bold;
	font-family: Verdana, Arial, Helvetica, sans-serif;
}
-->
</style>
</head>


<body  bgcolor="FFFFFF" style="margin: 1px">
<table border="0" cellpadding="5" width="100%" align="center">
<tr>
  <td colspan="2" bgcolor="#0066cc"><span class="style2"><font color="#FFFFFF" align="center">G&ouml;nderilen Dosyalar</font></span></td>
</tr>
<tr  bgcolor="#ffffFF"><td><span class="style1"><nobr>Dosya Adi</nobr></span></td>
	<td align="right" class="style1"><nobr>Dosya Boyutu</nobr></td>
</tr>
<?

/*
 * SET THE SAVE PATH by editing the line below. Make sure that the path
 * name ends with the correct file system path separator ('/' in linux and
 * '\\' in windows servers (eg "c:\\temp\\uploads\\" )
 */

$save_path="/home/content/m/a/r/marincnc/html/upmarin/";    


$file = $_FILES['userfile'];
$k = count($file['name']);


for($i=0 ; $i < $k ; $i++)
{
	if($i %2)
	{
		echo '<tr bgcolor="#FFFF99"> ';
	}
	else
	{	
		echo '<tr>';
	}
	
	echo '<td align="left">' . $file['name'][$i] ."</td>\n";
	echo '<td align="right">' . $file['size'][$i] ."</td></tr>\n";

	if(isset($save_path) && $save_path!="")
	{
		$name = split('/',$file['name'][$i]);
		
		move_uploaded_file($file['tmp_name'][$i], $save_path . $name[count($name)-1]);
	}
	
}

echo "<tr style='color: #0066cc'><td></td><td>". (($_SERVER[HTTPS] != 'off') ? '' : '') ."</td></tr>";
if(! isset($save_path) || $save_path =="")
{
	echo '<tr style="color: #0066cc"><td colspan=2 align="left">Dosyaniz yüklenemedi lütfen bizim ile baglantiya geçiniz.</td></tr>';
}


?>
</table>

</body>
</html>
