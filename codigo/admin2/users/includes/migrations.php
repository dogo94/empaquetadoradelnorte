<?php
//Every time we do an update to the db, a new migration will be added here
$migrations = array(
  '3GJYaKcqUtw7','2XQjsKYJAfn1','549DLFeHMNw7','69qa8h6E1bzG','3GJYaKcqUtz8',
  '4Dgt2XVjgz2x','VLBp32gTWvEo','1XdrInkjV86F','Q3KlhjdtxE5X','37wvsb5BzymK',
  'ug5D3pVrNvfS','69FbVbv4Jtrz','4A6BdJHyvP4a','c7tZQf926zKq','ockrg4eU33GP',
  'XX4zArPs4tor','pv7r2EHbVvhD','hcA5B3PLhq6E','FyMYJ2oeGCTX','iit5tHSLatiS',
  'VNEno3E4zaNz','qPEARSh49fob'
);
$applied = [];
$db_migrations = $db->query("SELECT migration FROM updates")->results();
foreach($db_migrations as $d){
$applied[] = $d->migration;
}
$missing = array_diff($migrations,$applied);
