/*
=======================
BANNER
=======================
*/
$(".banner-slides").slick({
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
  arrows: false,
  autoplay: true,
  autoplaySpeed: 7000,
});

/*
=======================
SMOOTH SCROLL TO ID
=======================
*/
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

/*
=======================
CONTACT FORM CAPTCHA
=======================
*/
$(function () {
  $("#email-form").ebcaptcha();
});

(function ($) {
  jQuery.fn.ebcaptcha = function (options) {
    var element = this;
    var input = this.find("#captchainput");
    var label = this.find("#captchatext");
    $(element).find("input[type=submit]").attr("disabled", "disabled");
    $("#op-captcha-error").hide();
    var randomNr1 = 0;
    var randomNr2 = 0;
    var totalNr = 0;
    randomNr1 = Math.floor(Math.random() * 10);
    randomNr2 = Math.floor(Math.random() * 10);
    totalNr = randomNr1 + randomNr2;
    var texti = randomNr1 + " + " + randomNr2 + " =";
    $(label).text(texti);
    $(input).keyup(function () {
      var nr = $(this).val();
      if (nr == totalNr) {
        $(element).find("input[type=submit]").removeAttr("disabled");
        $("#op-captcha-error").hide();
      } else {
        $(element).find("input[type=submit]").attr("disabled", "disabled");
        $("#op-captcha-error").show();
      }
    });
    $(document).keypress(function (e) {
      if (e.which == 13) {
        if (element.find("input[type=submit]").is(":disabled") == true) {
          e.preventDefault();
          return false;
        }
      }
    });
  };
})(jQuery);

/*
=======================
CONTACT FORM SUBMIT
=======================
*/
var request;
var defaultSubmitValue = $("#email-form-submit").val();
$("#email-form").submit((e) => {
  e.preventDefault();
  if (request) {
    request.abort();
  }
  var $form = $("#email-form");
  $($form).find("input[type=submit]").val("Einen Moment bitte...");

  var $inputs = $form.find("input, select, button, textarea");
  var serializedData = $form.serialize();

  $inputs.prop("disabled", true);
  $('#op-required-field-error').hide();

  if(validateContactForm()){
    request = $.ajax({
      url: "contact-form/email.php",
      type: "post",
      data: serializedData,
    });

    request.done(function (response, textStatus, jqXHR) {
      console.log("RESPONSE", response);
    });

    request.fail(function (jqXHR, textStatus, errorThrown) {
      console.error("The following error occurred: " + textStatus, errorThrown);
    });

    request.always(function () {
      $inputs.prop("disabled", false);
    });
  }else{
    $inputs.prop("disabled", false);
    $('#op-required-field-error').show();
    $($form).find("input[type=submit]").val(defaultSubmitValue);
  }
});

/*
=======================
CONTACT FORM VALIDATE
=======================
*/
function validateContactForm(){
  var isFilled = true;
  $('#email-form .required').each(function() {
    if ($(this).val().trim() === '') {
      isFilled = false;
      return false;
    }
  });
  return isFilled;
}