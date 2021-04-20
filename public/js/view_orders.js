function update_paid(_id, button)
{
	$.ajax({
		url: '/update_paid',
		type: "POST",
		data: {_id : _id}, 
		success: function(result){
	    	button.value="Yes";
	    	button.classList.remove("btn-danger")
	    	button.classList.add("btn-success")
	    	button.disabled = true;
	  }});
}

function update_collected(_id, button)
{
	$.ajax({
		url: '/update_collected',
		type: "POST",
		data: {_id : _id}, 
		success: function(result){
	    	button.value="Yes";
	    	button.classList.remove("btn-danger")
	    	button.classList.add("btn-success")
	    	button.disabled = true;
	  }});
}

function delete_order(id)
{
  var confirm2 = confirm("Are you sure?");
  if(confirm2){
    fetch('delete_order', {
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