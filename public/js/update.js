var update = document.getElementById('update');
//var message = document.getElementById('message');
var ingre_name = document.getElementsByName('ingre_name');
var ingre_desc = document.getElementsByName('ingre_desc');
var ingredients = document.getElementById('ingredients');
var update_btn = document.getElementById('update');
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

                option_markup += "<option>" + data[i].name + "</option>";
            }


        }
    });
});

update_btn.addEventListener('click', function(){
    temparray2 = new Array();
    for(var i=0; i<ingre_name.length; i++)
    {
        temparray = {name: ingre_name[i].value, description: ingre_desc[i].value}
        //console.log(temparray);
        temparray2.push(JSON.stringify(temparray))
    }

    ingredients.value = (temparray2);
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

// function add_new_row()
// {
//   var markup = '<div class="row">'
//                     +'<div class="col-sm-1"><input type="checkbox" name="record"></div>'
//                     +'<label class="col-sm-2 col-form-label">Name:</label>'

//                     +'<div class="col-sm-3"><input type="text" name="ingre_name" value="'+list+'"></div>'

//                     +'<label class="col-sm-2 col-form-label">Description:</label>'
//                     +'<div class="col-sm-3"><textarea type="text" name="ingre_desc"></textarea></div>'
//                     +'</div>';

//   $('#ingredients_list').append(markup); 
// }


function delete_row(row)
{
  $(row).parent().parent().remove();
}


// update.addEventListener('click', function () {
//   var name = document.getElementById('name').value;
//   var synopsis = document.getElementById('synopsis').value;
//   var weight = document.getElementById('weight').value;
//   var description = document.getElementById('description').value;
//   var id = document.getElementById('ObjectID').value;
//   var ingredients = document.getElementById('ingredients').value;
//   var image = document.getElementById('image').files[0];

//   console.log(typeof(image))

//   fetch("/edit_sku/" + id, {
//     method: 'put',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({
//       'id': id,
//       'name': name,
//       'synopsis': synopsis,
//       'weight' : weight,
//       'description': description,
//       'ingredients': ingredients
//     })
//   })
//   .then(response => {
//     if (response.ok) return response.json()
//   })
//   .then(data => {
//     // console.log(data.message);

//     //message.innerHTML = "Pikachu";
//     alert("SKU Updated");
//     window.location.replace("/admin_menu");
//     //throw new Error("message");
//     // window.location.reload(true)
//   })

//   // fetch("/image_upload", {
//   //   method: 'post',
//   //   body : {
//   //     filename : name,
//   //     image: image
//   //   }
//   // }).then(response => response.json())
//   // .then(data => {
//   //   console.log(data.path)
//   // })
//   // .catch(error => {
//   //   console.error(error)
//   // })

//   // var fd = new FormData();
//   // fd.append('image',image)
//   // fd.append('name',name)

//   // $.ajax({
//   //   url: '/image_upload',
//   //   type: 'post',
//   //   data: fd,
//   //   contentType: false,
//   //   processData: false,
//   //   success: function(response){
//   //     if(response != 0){
//   //       console.log(response)
//   //     }
//   //   }
//   // })
// });