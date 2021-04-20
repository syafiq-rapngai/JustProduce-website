
var edit_btn = document.getElementById('edit_sku_btn');
var edit_section = document.getElementById('edit_sku');

//edit_section.style.display = "none";
edit_btn.addEventListener('click', function(){
    edit_section.style.display = "block";

    $('html, body').animate({
        scrollTop: $("#edit_sku").offset().top
    }, 700);
});

var edit_icon = document.getElementById('edit_icon');
var sku_select = document.getElementById('sku_select');
edit_icon.addEventListener('click', function(){
    window.location.href = "edit_sku/" + sku_select.value;
});
