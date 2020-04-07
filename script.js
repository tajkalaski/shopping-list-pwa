
// const addButton = document.getElementById('add-button');
// const list = document.querySelector('ul');
// const listItems = document.getElementsByTagName('li');
// var buttonList = document.getElementsByClassName("toggleButton");


window.onload = function() {
  
	// Display the todo items.
	itemDb.open(refreshItems);
	
	const newItemForm = document.getElementById('new-item-form');
	const inputField = document.getElementById('input-field');
	
	// Handle new todo item form submissions.
	newItemForm.onsubmit = function() {
	  // Get the todo text.
	  const text = inputField.value;
	  
	  // Check to make sure the text is not blank (or just spaces).
	  if (text.replace(/ /g,'') != '') {
		// Create the todo item.
		itemDb.createItem(text, function() {
		  refreshItems();
		});
	  }
	  
	  // Reset the input field.
	  inputField.value = '';
	  
	  // Don't send the form.
	  return false;
	};
	
  }

  function refreshItems() {  
	itemDb.fetchItems(function(items) {
	  const list = document.getElementById('list');
	  list.innerHTML = '';
	  
	  for(let i = 0; i < items.length; i++) {
		// Read the todo items backwards (most recent first).
		const item = items[(items.length - 1 - i)];
  
		const li = document.createElement('li');
		const checkbox = document.createElement('input');
		checkbox.type = "checkbox";
		checkbox.className = "item-checkbox";
		checkbox.setAttribute("data-id", item.timestamp);
		
		li.appendChild(checkbox);
		
		const span = document.createElement('span');
		span.innerHTML = item.text;
		
		li.appendChild(span);
		
		list.appendChild(li);
  
		checkbox.addEventListener('click', function(e) {
		  const id = parseInt(e.target.getAttribute('data-id'));
  
		  itemDb.deleteItem(id, refreshItems);
		})
		
		// TODO: Setup an event listener for the checkbox.
		// hint: you have to get the id of the clicked element, and then call the deleteTodo function on that element
		
	  }
  
	});
  }

// function createListElement() {
// 	var newListElement = document.createElement("li");
// 	var newButton = document.createElement("button");
// 	newButton.className = "toggleButton";
// 	newButton.appendChild(document.createTextNode("X"));
// 	newListElement.appendChild(newButton);
// 	newListElement.appendChild(document.createTextNode(" " + inputField.value));
// 	list.appendChild(newListElement);
//     inputField.value = "";
//     console.log('wtf');
// 	itemEvents();
// }

// function toggleItem() {
// 	this.classList.toggle("done");
// }

// function deleteItem() {
// 	this.parentElement.remove();
// }

// function itemEvents() {
// 	for(var i = 0; i < listItems.length; i++) {
// 		listItems[i].addEventListener("click", toggleItem);
// 	}
// 	for(var i = 0; i < buttonList.length; i++) {
// 		buttonList[i].addEventListener("click", deleteItem);
// 	}
// }

// console.log(inputField);
// console.log(addButton);
// console.log(list);
// console.log(listItems);

// addButton.addEventListener("click", createListElement);
// itemEvents();