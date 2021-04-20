
var ingre_name = document.getElementsByName('ingre_name');
var ingre_desc = document.getElementsByName('ingre_desc');
var ingredients = document.getElementById('ingredients');
var submit_btn = document.getElementById('submit');
var ingredients_list = document.getElementById('ingredients_list');

var new_row_btn = document.getElementById('new_row_btn');
var delete_btn = document.getElementById('delete_btn');

// var temparray = {name: tests[0].value, description: tests[1].value}
var temparray;
var temparray2;

var ingredients_option;
var option_markup = "";

$(document).ready(function (){
    $.ajax({
        url: "/ingredients",
        method: "get",
        success: function(data){
            //console.log(data);
            var select = document.getElementsByName('ingre_name')[0];
            ingredients_option = data;
            for(var i=0; i<data.length; i++)
            {
                var opt = document.createElement("option");
                opt.value = data[i].name;
                opt.innerHTML = data[i].name;

                select.appendChild(opt);

                option_markup += "<option>" + data[i].name + "</option>";
            }


        }
    });
});

submit_btn.addEventListener('click', function(){
    // if(validation())
    // {
        temparray2 = new Array();
        for(var i=0; i<ingre_name.length; i++)
        {
            temparray = {name: ingre_name[i].value, description: ingre_desc[i].value}
            temparray2.push(JSON.stringify(temparray))
        }

        //console.log(temparray2);
        ingredients.value = (temparray2);
    // }
});

new_row_btn.addEventListener('click', function(){
    var markup = '<div class="row">'
                    +'<div class="col-sm-1"></div>'
                    +'<label class="col-sm-2 col-form-label">Name:</label>'
                    +'<div class="col-sm-3"><select name="ingre_name">'+option_markup+'</select></div>'
                    +'<label class="col-sm-2 col-form-label">Description:</label>'
                    +'<div class="col-sm-3"><textarea type="text" name="ingre_desc" rows="4"></textarea></div>'
                    +'<div class="col-sm-1"><button type="button" id="delete_btn" class="btn btn-danger " onclick="delete_row(this)">Delete</button></div>'
                    +'</div>';

    $('#ingredients_list').append(markup);               
})

function delete_row(button)
{
    $(button).parent().parent().remove();
}

// function validation(){
//     // Variables to be captured
//     var name = document.getElementById('name').value;
//     var synopsis = document.getElementById('synopsis').value;
//     var weight = document.getElementById('weight').value;
//     var description = document.getElementById('description').value;

//     // Error variables
//     var name_error = document.getElementById('name_error');
//     var synopsis_error = document.getElementById('synopsis_error');
//     var weight_error = document.getElementById('weight_error');
//     var description_error = document.getElementById('description_error');

//     var flag = 0;

//     if(name.length === 0){
//         flag = 1;
//         name_error.display = "block";
//     }

//     if(synopsis.length === 0){
//         flag = 1;
//         synopsis_error.display = "block";
//     }

//     if(weight.length === 0){
//         flag = 1;
//         weight_error.display = "block";
//     }

//     if(description.length === 0){
//         flag = 1;
//         description_error.display = "block";
//     }

//     console.log(flag);

//     if(flag == 1)
//         return false
//     else 
//         return true
// }