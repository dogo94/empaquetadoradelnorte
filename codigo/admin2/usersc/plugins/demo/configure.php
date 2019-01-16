  <?php if(!in_array($user->data()->id,$master_account)){ Redirect::to($us_url_root.'users/admin.php');} //only allow master accounts to manage plugins! ?>

 <?php
 if(!empty($_POST['plugin_demo'])){
   // Redirect::to('admin.php?err=I+agree!!!');
 }
 ?>
<div class="content mt-3">
 		<div class="row">
 			<div class="col-sm-12">
          <a href="<?=$us_url_root?>users/admin.php?view=plugins">Return to the Plugin Manager</a>
 					<h1>Configure the Demo Plugin!</h1>
          <form class="" action="" method="post">
            <input type="hidden" name="csrf" value="<?=$token?>" />
            How awesome is this demo plugin?
            <button type="button" name="button" class="btn btn-primary">Pretty Awesome</button>
          </form>
 			</div> <!-- /.col -->
 		</div> <!-- /.row -->
