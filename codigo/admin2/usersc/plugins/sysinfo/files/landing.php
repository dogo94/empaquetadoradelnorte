<?php
//Security and UserSpice Includes
$authorized = 0;
require_once '../../../../users/init.php';
$db = DB::getInstance();
if(!in_array($user->data()->id,$master_account)){
  logger($user->data()->id,"Errors","Attempted to access db manager");
  Redirect::to($us_url_root.'users/admin.php?err=Permission+denied');} //only allow master accounts to manage plugins!
  $check = $db->query("SELECT id FROM us_plugins WHERE plugin = ? and status = ?",array("sysinfo","active"))->count();
  if($check != 1) {
    logger($user->data()->id,"Errors","Attempted to access disabled db manager");
    Redirect::to($us_url_root.'users/admin.php?err=Plugin+is+disabled');
  }else{
    $authorized = 1;
  }

?>
<?php
if($authorized === 1){
  include('index.php');
}
