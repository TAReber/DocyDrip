//This Script is Not required for the TEO,
// It Merely Updates the a value for the data attribute 

function update_one(){
	let element = document.getElementById('input1');
	let editor = document.getElementById('001');
	editor.setAttribute('data-TEO-BitCode', element.value);
}

function update_two(){
	let element = document.getElementById('input2');
	let editor = document.getElementById('002');
	editor.setAttribute('data-TEO-BitCode', element.value);
}

function update_three(){
	let element = document.getElementById('input3');
	let editor = document.getElementById('003');
	editor.setAttribute('data-teo-bitcode', element.value);
}