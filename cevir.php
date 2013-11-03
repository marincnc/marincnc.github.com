<?

/*
yazan   : turker
e-mail  : turker.biz@gmail.com
version : 0.01
------------
Üstteki bilgilere dokunmadan, istediðiniz gibi kullanabilir, satabilir ve daðýtabilirsiniz.
*/
# karakter seti ayarlarý
$charset='utf8';
# baðlantý ayarlarý
$conn=mysql_connect("","","") or die('nerdesin mysql?');
mysql_select_db("",$conn) or die('taze bitti');
# karakter seti deðiþtirilecek alan tipleri
$types=array(
'CHAR',
'VARCHAR',
'TINYTEXT',
'TEXT',
'MEDIUMTEXT',
'LONGTEXT',
'TINYBLOB',
'BLOB',
'MEDIUMBLOB',
'LONGBLOB',
'ENUM',
'SET'
);
/*---------------- yeter bu kadar ayar ----------------------- */
# follow the white rabbit
$q1=mysql_query('SHOW TABLES');
while ($r1=mysql_fetch_array($q1)) {
$table=$r1[0];
$sql='ALTER TABLE '.$table.' CONVERT TO CHARACTER SET '.
$charset.' COLLATE '.$charset.'_turkish_ci';
mysql_query($sql);
echo "\n\n
$table tablosunun karakter seti deðiþtirildi";
$q2=mysql_query('SHOW FIELDS FROM `'.$table.'`');
while ($r2=mysql_fetch_assoc($q2)) {
//print_r($r2);
$field=$r2['Field'];
$type=strtoupper($r2['Type']);
$null=strtoupper($r2['Null']);
$default=strtoupper($r2['Default']);
if (in_array($type,$types)) {
if ($null=='YES') $null='NULL';
else $null='NOT NULL';
if (!empty($default)) $default='DEFAULT '.$default;
$sql='ALTER TABLE `'.$table.'` MODIFY COLUMN `'.$field.'` '.$type.' CHARACTER SET '.
$charset.' COLLATE '.$charset.'_turkish_ci '.$null.' '.$default;
mysql_query($sql);
} // if
} // while
echo "\n
$table tablosu içindeki alanlarýn karakter seti deðiþtirildi";
} // while

?>