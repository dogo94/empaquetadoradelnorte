<?php

if(file_exists("install/index.php")){
	//perform redirect if installer files exist
	//this if{} block may be deleted once installed
	header("Location: install/index.php");
}

require_once 'users/init.php';
require_once $abs_us_root.$us_url_root.'users/includes/template/prep.php';
if(isset($user) && $user->isLoggedIn()){
}
?>
<div id="page-wrapper">
	<div class="container">
		<div class="jumbotron">
			<h1 align="center">Welcome to <?php echo $settings->site_name;?></h1>
			<p align="center" class="text-muted">An Open Source PHP User Management Framework. </p>
			<p align="center">
				<?php if($user->isLoggedIn()){?>
					<a class="btn btn-primary" href="users/account.php" role="button">User Account &raquo;</a>
				<?php }else{?>
					<a class="btn btn-warning" href="users/login.php" role="button">Log In &raquo;</a>
					<a class="btn btn-info" href="users/join.php" role="button">Sign Up &raquo;</a>
				<?php }	?>
			</p>

			<br>
			<p align="center">You have successfully installed UserSpice!<br>To view our getting started documentation, please visit</p>
			<h4 align="center"><a href="https://userspice.com/getting-started/">https://userspice.com/getting-started/</a></h4>
		</div>
	</div>
</div>

<!-- Place any per-page javascript here -->


<?php require_once $abs_us_root . $us_url_root . 'usersc/templates/' . $settings->template . '/footer.php'; //custom template footer ?>
