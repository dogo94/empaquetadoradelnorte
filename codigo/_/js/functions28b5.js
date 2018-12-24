'use strict';
//Estructura Front-End V3
//Gustavo Adolfo Vera Gomez
//gustavovg@outlook.com

var Site = window.Site || {};
var timeSubastaGetRanking = 1000*2,
ajax,
thisWidth,
thisHeight,
banderaEnvio = true,
chapt,
oferta = 0,
textCaptcha = null;


$.breakpoint = {
  els: $(),
  init: false
};

$.fn.breakpoint = function() {
  $.breakpoint.els = $.breakpoint.els.add(this);

  if (!$.breakpoint.init) {
    $(window).on('resize.breakpoint', function(){
      $.breakpoint.els.trigger('swapres.breakpoint');
      $(".return_parent").each(function (index){
        var imgSrc = $(this).attr('src');
        $(this).parent('.src_return').css('background-image', 'url(' + imgSrc + ')');
      });
    });
  }

  return this.each(function(){
    var $el = $(this),
      maxWidths = [],
      minWidths = [];

    $el.data('m1src', $el.attr('src'));

    // parse breakpoints.
    $.each( $el.data(), function(key, value) {
      if (key && (key.toLowerCase().indexOf('maxwidth') === 0 || key.toLowerCase().indexOf('minwidth') === 0)) {
        var width = key.substring(3).match( /\d+/g );
        if (width.length === 1) {
          var bp = {
            key: key,
            type: ( key.toLowerCase().indexOf('max') === 0 ? 'max' : 'min' ),
            width: width[0]
          };

          if ( bp.type === 'max' ) {
            maxWidths.push( bp );
          }
          else {
            minWidths.push( bp )
          }
        }
      }
    });
    //console.log(minWidths);
    // sort low to high.
    minWidths.sort(function( a, b ) {
      return a.width - b.width;
    });
    //console.log(minWidths);

    //console.log(maxWidths);
    // sort high to low.
    maxWidths.sort(function( a, b ) {
      return b.width - a.width;
    });
    //console.log(maxWidths);

    $el
      .on('swapres.breakpoint', function(){
        //console.log('swapres');

        // if breakpoints are defined just use them and ignore the rest.
        if ( maxWidths.length > 0 || minWidths.length > 0 ) {

          // loop threw each break point and try apply it.
          var windowWidth = $(window).width();
          var activeBreakpoint = null;
          $.each( maxWidths, function(index, bp) {
            if ( windowWidth <= bp.width ) {
              //console.log('matched breakpoint: ' +  bp.key);
              activeBreakpoint = bp;
            }
          });
          $.each( minWidths, function(index, bp) {
            if ( windowWidth >= bp.width ) {
              //console.log('matched breakpoint: ' +  bp.key);
              activeBreakpoint = bp;
            }
          });
          // fallback to mobile first if no matches.
          if ( activeBreakpoint != null ) {
            //console.log('using breakpoint: ' + activeBreakpoint.key);
            $el.attr( 'src', $el.data( activeBreakpoint.key ) );

          } else {
            //console.log('using mobile1st');
            $el.attr( 'src', $el.data('m1src') );
          }

        } else {
          //console.log('using mobile1st');
          $el.attr( 'src', $el.data('m1src') );
        }
      })
      .trigger('swapres.breakpoint');
  });
};



/* Create a closure to maintain scope of the '$'
and remain compatible with other frameworks.  */
(function($) {
  $(window).on("load", function() {
    $("#loader").fadeOut(500);
  });

  $(document).ready(function(){
    general();
    // Anchor animate
    // -----
    $(".frm_submit").click(function (event) {
      event.preventDefault();
      var nameClassError = "input_error";
      var showError = '';
      var banderaFunction = true;
      var formSubmit = false;
      var stringJSON = "";

      $($(this).attr("data-frm-content") + " .frm_field").each(function (index) {
        $(this).removeClass(nameClassError);
        var valueTemp = $(this).val() == undefined ? '' : $(this).val();
        var idTempObj = ($(this).attr("id") != "" ? $(this).attr("id") : 'def');
        valueTemp = escape(valueTemp);

        if (idTempObj == "myForm") {
          formSubmit = valueTemp;
        } else if (idTempObj == "myFunct") {
          if (banderaFunction) {
            banderaFunction = false;
            stringJSON += (stringJSON != "" ? ", " : "") + idTempObj + ':"' + valueTemp + '"';
          }
        } else if ($(this).attr("type") == "radio" || $(this).attr("type") == "checkbox") {
          if ($(this).is(':checked'))
            stringJSON += (stringJSON != "" ? ", " : "") + idTempObj + ':"' + valueTemp + '"';
        } else {
          stringJSON += (stringJSON != "" ? ", " : "") + idTempObj + ':"' + valueTemp + '"';
        }

        if ($(this).is(".val_required")) {
          var tInput = $(this).attr("type");
          if (((tInput == "radio" || tInput == "checkbox") && !$(this).is(':checked')) || trim(valueTemp) == "") {
            if ($(this).attr("data-required-text")) {
              showError = $(this).attr("data-required-text");
            } else if ($(this).attr("title")) {
              showError = $(this).attr("title");
            } else if ($(this).attr("placeholder")) {
              showError = $(this).attr("placeholder");
            } else {
              showError = "Este campo es requerido";
            }
          }
        }
        if ($(this).is('.val_email') && trim(valueTemp) != "" && !validar_email(valueTemp))
          showError = 'Tu correo electrónico no es válido.';
        if ($(this).is('.val_num') && trim(valueTemp) != "" && !validar_numeros(valueTemp))
          showError = 'Debes escribir un número válido.';
        if ($(this).is('.val_txt') && trim(valueTemp) != "" && !validar_texto(valueTemp))
          showError = 'Debes escribir un texto válido.';
        if ($(this).is('.val_tel') && trim(valueTemp) != "" && !validar_telefono(valueTemp))
          showError = 'El número de teléfono debe tener mínimo 7 caracteres y máximo 10.';

        if (showError != '') {
          // alert('¡Lo sentimos!\n' + showError)
          alertLighbox('¡Lo sentimos!', showError);
          //alerts('¡Lo sentimos!', showError, '', false);
          $(this).focus();
          $(this).addClass(nameClassError);
          return false;
        }
      });

      if (formSubmit && showError == '') {
        $("#" + formSubmit).submit();
      } else if (showError == '') {
        if (banderaEnvio) {
          banderaEnvio = false;
          //var myObject = JSON.stringify(eval("({" + stringJSON + "})"));
          var myObject = {};
          eval("myObject = { " + stringJSON + " };");
          $.ajax({
            data: myObject, url: ajaxRutaAbs, type: "POST", dataType: "json",
            success: function (data) {
              banderaEnvio = true;
              if (data.title) {
                if (data.message)
                  alertLighbox(data.title, data.message+':::::');
                else
                  alertLighbox(data.title, '');
              }
              if (data.event != null)
                eval(data.event);
            },
            error: function (jqXHR, textStatus, errorThrown) {
              banderaEnvio = true;
              LanzarAlerta("¡Lo sentimos!", "Debido a fallas de conexión de este equipo con el servidor\nes necesario recargar la página o intenta de nuevo");
            }
          });
        }
      }
    });

    $('.compartir_pro a, .social_receta a').each(function (index) {
      $(this).attr('target', '_blank');
      var url_face = 'http://www.facebook.com/sharer.php?u=',
              url_twit = 'http://twitter.com/home?status=';
      if ($(this).hasClass('btn_blue')) {
        $(this).attr('href', url_face + encodeURI(window.location.href));
      } else if ($(this).hasClass('btn_blue2')) {
        $(this).attr('href', url_twit + encodeURI(window.location.href));
      }
    });

    function LanzarAlertaTrivias(newTit, newMess) {
      // alerts(newTit, newMess);
      alert(newTit + '\n' + newMess)
    }

    function LimpiarFormulario(refFrm, noLimpiar) {
      $(refFrm+" .frm_field").each(function (index) {
        if (!in_array($(this).attr("id"), noLimpiar)) {
          $(this).removeAttr('checked');
          $(this).find('option:eq(0)').prop('selected', true);
          $(this).val("");
        }
      });
    }

    function in_array(needle, haystack) {
      for (var i in haystack) {
        if (haystack[i] == needle)
          return true;
      }
      return false;
    }

    $(".img_respon").breakpoint();





    // ------



    var width, height;
    function doneResizing(){
      general();
    }
    //RESIZE
    $(window).resize(function() {
      //recalculo fotos para el seo
      var newWidth = $(window).width();
      var newHeight = $(window).height();
      if( newWidth != width || newHeight != height ) {
        width = newWidth;
        height = newHeight;
        doneResizing();
      }
    });

    $(".l_menu").on('click', function (event) {
      $('header').removeClass('activeSearch');
      if ($('.c_menu_div').css("display") == "none") {
        $('.c_menu_div').slideDown(500);
      } else {
        $('.c_menu_div').slideUp(500);
      }
    });

    $(".lnkMobile").on('click', function (event) {
      $('.c_menu_div').slideUp(500);
    });

    $(".linkPro").on('click', function (event) {
      if ($('.l_menu_products > div').css("opacity") != 1) {
        $('.l_menu_products').addClass('show').delay(10000).addClass('closeshow');
      }else{
        $('.l_menu_products').removeClass('show').delay(1000).removeClass('closeshow');
      }
    });

    $(".problemas").on('click', function (event) {
      if ($('.c_iframe_contact').css("display") == 'none') {
        $('.c_iframe_contact').slideDown(600);
      }else{
        $('.c_iframe_contact').slideUp(600);
      }
    });





    $(".lnk_historia").on('click', function (event) {
      var anchor = $(this).data('anchor');
      var resultado = $(anchor).next('.resul_historia');
      var h5 = $(this).find('h5').html();
      var p = $(this).data('info');
      $('.resul_historia').slideUp(400);
      $('.lnk_historia').removeClass('active');

      $(this).addClass('active');
      // if ($(resultado).css("display") == 'none') {

        $(resultado).find('h3').html(h5);
        $(resultado).find('p').html(p);
        $(resultado).slideDown(400);
        setTimeout(function(){
          $('html,body').animate({scrollTop: $(anchor).offset().top - 81},'slow');
        }, 400);
      // }else{

      // }
    });


    $(".lnkclose").on('click', function (event) {
      var anchors = $(this).data('anchor');
      $('.lnk_historia').removeClass('active');
      $('.resul_historia').slideUp(400);
      setTimeout(function(){
        $('html,body').animate({scrollTop: $(anchors).offset().top - 81},'slow');
      }, 400);
    });

    var navInfo = window.navigator.appVersion.toLowerCase();
      // var so = 'Sistema Operativo';
      if(navInfo.indexOf('win') != -1)
      {
        $('html').addClass('windows');
      }
      else if(navInfo.indexOf('linux') != -1)
      {
        $('html').addClass('linux');
      }
      else if(navInfo.indexOf('mac') != -1)
      {
        $('html').addClass('mac');
      }
      // alert(so);


    if (navigator.userAgent.indexOf('Mac OS X') != -1) {
            // Mac
      if ($.browser.opera) { $('html').addClass('opera'); }
      if ($.browser.webkit) { $('html').addClass('webkit'); }
      if ($.browser.mozilla) { $('html').addClass('mozilla'); }
      if (/camino/.test(navigator.userAgent.toLowerCase())){ $('html').addClass('camino'); }
      if (/chrome/.test(navigator.userAgent.toLowerCase())) { $('html').addClass('chrome'); }
      if (navigator && navigator.platform && navigator.platform.match(/^(iPad|iPod|iPhone)$/)) { $('html').addClass('apple'); }
      if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) { $('html').addClass('safari'); }
        } else {
            // Not Mac
      if ($.browser.opera) { $('html').addClass('opera-pc'); }
      if ($.browser.webkit) { $('html').addClass('webkit-pc'); }
      if ($.browser.mozilla) { $('html').addClass('mozilla-pc'); }
      if (document.all && document.addEventListener) { $('html').addClass('ie9'); }
      if (/chrome/.test(navigator.userAgent.toLowerCase())) { $('html').addClass('chrome-pc'); }
      if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) { $('html').addClass('safari-pc'); }
    }


    // $(".lnk_lightbox").on('click', function (event) {
    //   if ($('.lightbox').css("display") == 'none') {
    //     $('.lightbox').fadeIn(300);
    //   }else{
    //     $('.lightbox').fadeOut(300);
    //   }
    // });


    $(document).keyup(function (e) {
      if (e.keyCode === 27)
        closeLightbox();
    });




    //return image
    $(".return_parent").each(function (index){
      var imgSrc = $(this).attr('src');
      $(this).parent('.src_return').css('background-image', 'url(' + imgSrc + ')');
    });

    $(window).on('scroll resize load',function(){
      var alto = $('.slider_detalle_receta').height() - 300;
      if ($(this).scrollTop() <= alto) {
        $('.one, .two, .three, .four').circleProgress({
          value: $(this).attr('data-value'),
          fill: {
              gradient: ["#cb7473", "#940507"]
            },
          size: 100,
          thickness:4,
          duration: 3000, easing: "circleProgressEase"
        }).on('circle-animation-progress', function(event, progress) {
          //llamada dinamico
        });
        alto = 0;
      }

      if ($(this).scrollTop() >= 95) {
        $('header, section').addClass("active");
      }else{
        $('header, section').removeClass("active");
      }
      var valScroll = $(window).scrollTop();
      var winHeight = $(window).innerHeight();

      $('.to_view, .to_viewleft, .to_viewright').each(function(index, element) {
        var thisTop = $(this).offset().top;
        if(valScroll>= thisTop-(winHeight)){
          $(this).addClass('visible');
        }
      });
    })


    $(".sli_2").slick({
      dots: true,
      infinite: false,
      arrows: false
    });


    $(".sli_1").slick({
      dots: true,
      infinite: true,
      arrows: false,
      autoplaySpeed: 4000,
      autoplay: true,
    });

    $(".sli_auto").slick({
      dots: false,
      infinite: true,
      arrows: false,
      autoplay: true,
      fade: true,
      autoplaySpeed: 6000
    });

    $(".sli_recomendados").slick({
      dots: false,
      arrows: false,
      infinite: true,
      slidesToShow: 3,
      autoplay: true,
      autoplaySpeed: 6000,
      responsive: [
          {
            breakpoint: 2000,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 800,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
    });
    $(".sli_recomendados2").slick({
      dots: false,
      arrows: false,
      infinite: true,
      slidesToShow: 2,
      autoplay: true,
      autoplaySpeed: 6000,
      responsive: [

          {
            breakpoint: 800,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
    });




    $('.sli_2').on('beforeChange', function(event, slick, currentSlide, nextSlide){
      $('.video_slider').attr('src', '');
      $('.sli_2 .slick-slide').eq(nextSlide).find('.video_slider').attr('src', $('.sli_2 .slick-slide').eq(nextSlide).find('.video_slider').attr('data-src'));

    });

    $('.relative li a').each(function(){
        var uri = $(this).attr('href');
        $( ".relative li" ).first().addClass('arrow_paginator prev first');
        $( ".relative li" ).last().addClass('arrow_paginator next last');
        // console.log($(this).attr('rel','prev'))
        if (uri !== undefined) {
          var tempUrl = uri.replace('indexa54e.html?page=', 'page/index.html');
          $(this).attr('href', tempUrl)
        }
      });

      //info sedes - contacto
      if($('#sp_control_contacto').length > 0) {
        $(window).on('load', function() { $('#categoria_select').change(); });
      }
      $('#categoria_select').on('change', function(){
        var info = $(this).val();
        if(info) {
          var myObject = {service: 'contactoSedes', info: info};
    		  $.ajax({
    		    url: ajaxRutaAbs,
    		    type: "POST",
    		    data: myObject,
    		    dataType: "json",
    		    success: function(info) {
    		      // if (info.data) {
    		        $('#sedes_select').html(info.html)
    		        $('.list_info_contact').html(info.contacto)
                $('#sedes_select').change();
                initMap(info.lat, info.lng, 10, info.infoMap);
                // $('.content_infowindow').html(info.contacto)
                // console.log(info.html)
    		      // }
    		    }
    		  });
        }
      })

      $(document).on('change','#sedes_select', function(){
        var info = $(this).val();
        if(info) {
          var myObject = {service: 'listaSedes', info: info};
    		  $.ajax({
    		    url: ajaxRutaAbs,
    		    type: "POST",
    		    data: myObject,
    		    dataType: "json",
    		    success: function(info) {
    		      // if (info.data) {
    		        $('.list_info_contact').html(info.contacto)
                initMap(info.lat, info.lng, 10, info.infoMap);
                // $('.content_infowindow').html(info.contacto)
    		      // }
    		    }
    		  });
        }
      })

  });
  //buscadores
  $('.ico_search').on('click', function(){
    if($.trim($('input[name=busq]').val())){
      $('#formBusqueda').submit();
      return false
    } else {
      return false
    }
  })
  $('#formBusqueda').on('submit', function(){
    if($.trim($('input[name=busq]').val())){
      var busqUri = $(this).attr('action')+'/'+$.trim($('input[name=busq]').val());
      window.location.href = busqUri;
      return false
    } else {
      return false
    }
  });
  $('.c_buscador .lvideo').on('click', function(){
    if($(".lvideo #video").is(':checked')) {
       $(".c_buscador #video").attr('checked', false);
       $(this).removeClass('active');
    } else {
       $(".lvideo #video").attr('checked', true);
       $(this).addClass('active');
       $('#frmRecetaInterno').submit();
    }
  });
  $('.btnBuscarReceta').on('click', function(){
    $('#frmRecetaInterno').submit();
  });

  $('#productos').on('change', function(){
    $('#frmRecetaInterno').submit();
  });

  $('.ico_search').on('click', function(){
    // $('.c_menu_div').slideUp(500);
    if ($('.cont_search').css("max-height") == "0px") {
       $('header').addClass('activeSearch');
    } else {
       $('header').removeClass('activeSearch');
    }
  });



})(jQuery);

var thisWidth, thisHeight;

function general (){
  thisHeight = $(window).height();
  thisWidth = $(window).width();

  // Responsive video
  var anchoVideo = 900,
  altoVideo = 506,
  nuevoancho = $('.c_video_memoria iframe').width(),
  nuevoAlto = nuevoancho * altoVideo / anchoVideo;
  $(".c_video_memoria iframe").height(nuevoAlto);
}




function buscador(){
  if($( '.c_buscador' ).css("max-height") == "0px"){
    $(".c_buscador").addClass('active');
    $('#input_q').focus();
  }else{
    $(".c_buscador").removeClass('active');
  }
}

/**
 * GLOBAL
 */
function LanzarAlerta(newTit, newMess) {
  $(".lightbox").fadeIn(300).addClass('active');
  $(".msj").html('<h3>' + newTit + '</h3><p>' + newMess + '</p>');
};

function closeAlert(){
  $(".lightbox").fadeOut(300).removeClass('active');
}


// Funcion que me devuelve cadena de string sin espacion en el final y al principio de la misma
function trim(cadena) {
  if (cadena == undefined || cadena == null)
    return "";
  return cadena.trim();//return cadena.replace(/\ /g, "");
}

// Funcion para hacer redirect de link por js
function hacerRedirect(link) {
  window.location = link;
}

function validar_email(valor) {
  var filter = /[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
  if (filter.test(valor)) {
    return true;
  }
  return false;
}

function validar_icfes(valor) {
  var filter = /[AC|VG|ac|vg][$0-9]{8,16}/;
  if (filter.test(valor)) {
    return true;
  }
  return false;
}

function validar_numeros(valor) {
  var filter = /^([0-9])*$/;
  if (filter.test(valor)) {
    return true;
  }
  return false;
}

function validar_telefono(valor) {
  var filter = /^([0-9]{7,10})*$/;
  if (filter.test(valor) && valor.toString().length > 6 && valor.toString().length < 11) {
    return true;
  }
  return false;
}

function validar_texto(valor) {
  var filter = /^([a-zA-ZáéíóúñÁÉÍÓÚÑ ])*$/;
  if (filter.test(valor)) {
    return true;
  }
  return false;
}

// Funcion para hacer redirect de link por js
function confirmRedirect(link, texto) {
  if (confirm(texto)) {
    window.location.href = link;
  }
}

// Funcion para abrir una URL en target _blank
function AbrirLinkBlank(url) {
  window.open(url);
}

// Funcion para hacer consukltas AJAX dinamicamente
function GenericAjax(funcion, valorEnviado) {
  var myObject = {myFunct: funcion, valor: valorEnviado};
  $.ajax({
    url: ajaxRutaAbs,
    type: "POST",
    data: myObject,
    dataType: "json",
    success: function(data) {
      // Si el ajax respondio
      if (data.event != null) {
        eval(data.event);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // Si se presento algun error, mostramos la descripcion
      //alert( "Error\nAlgo ha salido mal. Por favor int?ntalo de nuevo en unos minutos -> "+textStatus);
    }
  });
}


function MenuPro (div, obj){
  $('.list_menu_prod a').removeClass('active');
  $(obj).addClass('active');
  $('.list_prod > div').fadeOut(300).delay( 300 );
  $(div).fadeIn(300);
}

function closeLightbox(){
  $('.tabla_nu, .alert_error').fadeOut(300);
}

function LightBox (div){
  $('.tabla_nu').fadeIn(300);
  $('.tabla-nutricional').html(div);

}

function alertLighbox (tit, text){
  $('.alert_error').fadeIn(300);
  $('.c_alert_error h3').html(tit);
  $('.c_alert_error p').html(text);
}
