jQuery(document).on('submit','#formlg', function(event){
	event.preventDefault();
		
	jQuery.ajax({
		url: '../login/main_app/login.php',
		type: 'POST',
		dataType: 'json',
		data: $(this).serialize(),
		beforeSend: function(){
			$('.botonlg').val('Validando...');

		}
	})
	.done(function(respuesta){
		console.log(respuesta);
		if(!respuesta.error){
			if(respuesta.tipo == 'Administrador'){
				location.href = '../login/main_app/logintranseico/AdminLTE/';
			}else if(respuesta.tipo == 'Usuario'){
				location.href = '../login/main_app/logintranseico/PanelUsuarios/';
			}
		}else{
			$('.error').slideDown('slow');
			setTimeout(function(){
				$('.error').slideUp('slow');
			},3000);
			$('.botonlg').val('Iníciar Sesión');

		}
	})
	.fail(function(resp){
		console.log(resp.responseText);
	})
	.always(function(){
		console.log("complete");
	});
});

  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: { 0: { items: 1 }, 768: { items: 2 }, 900: { items: 3 } }
  });