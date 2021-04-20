// var delete_btn = document.getElementById('delete_btn');

// delete_btn.addEventListener('click', function () {
//   var confirm2 = confirm("Are you sure?");
//   if(confirm2){
//   	var id = document.getElementById('sku_select').value;
//     fetch('products', {
//       method: 'delete',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({
//         'id': id,
//       })
//     })
//     .then(response => {
//       if (response.ok) console.log(response.json())
//         // throw new Error(response.json());
//     })
//     .then(data => {
//       //console.log(data);
//       window.location.reload(true)
//     })
// }});

function delete_this(id)
{
  var confirm2 = confirm("Are you sure?");
  if(confirm2){
    fetch('edit_partner', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'id': id,
      })
    })
    .then(response => {
      if (response.ok) console.log(response.json())
        // throw new Error(response.json());
    })
    .then(data => {
      //console.log(data);
      window.location.reload(true)
    })
}
}