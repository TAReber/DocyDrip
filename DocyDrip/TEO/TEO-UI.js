import { TextEditorObject as TEO } from "./TEO.js";

import {ObjectMap, Active, Const, StandardStructures, ConstColors, ConstFontSizes, ConstFontFamilies, ExtraOptionStart, ExtraOptionEnd,
 ListStructures } from "./TEO-Globals.js";

const CSS = {	
	UIMasterUIContainer: 'TEO-UI-Box',
	ButtonBoxFlexEnds: 'TEO-UI-Box-Ends',
	ButtonGroupBox: 'TEO-Button-Group',
	ButtonStyle: 'TEO-Button-Style',
	SelectorStyle: 'TEO-Selector-Style',
};

document.addEventListener('DOMContentLoaded', () => {
	Event_DripDocs_TEO_Selector();
});

function Event_DripDocs_TEO_Selector() {
	let toggle = document.querySelector('.TEO-Selector-Event');	
	toggle.addEventListener('click', (e) => {
		if(toggle.classList.contains(TEO.Active)){
			toggle.classList.remove(TEO.Active);
			Remove_OpenEditor_Toggles();
		}
		else{
			toggle.classList.add(TEO.Active);
			Add_OpenEditor_Toggles();
		}		
	});
};

function Add_OpenEditor_Toggles(){
	let queryTargets = document.querySelectorAll('.TEO-Editable-Container');
	Array.from(queryTargets).forEach((editableElement) => {
				
		let details = document.createElement('details');
		details.classList.add('TEO-ObjectCreator');
		editableElement.parentNode.prepend(details);
		let summary = document.createElement('summary');
		summary.classList.add('TEO-BlueBook');
		details.appendChild(summary);
		
		summary.addEventListener('click', function() {
			DocyDrip_OpenEditor_Event(editableElement);
		});			
	});
};

function Remove_OpenEditor_Toggles(){
	if(ObjectMap.size > 0){
		let result = window.confirm(`Editor Current Open: ${TEO.ObjectMap.count}, Press OK to Save, Cancel to Discard`);
		ObjectMap.forEach((texteditorobject, key) => {
			if(result === false){
				texteditorobject.RestoreOriginalContent();
			}
			texteditorobject.destroy();
			//TODO:: Call Your API to Update Database.
		});	
	}

	let toggles = document.querySelectorAll('.TEO-ObjectCreator');

	Array.from(toggles).forEach((bluebook) => {
		bluebook.remove();
		// if(editableElement.previousSibling.classList.contains('DocyDrop-TEO-ObjectCreator'))
			// editableElement.previousSibling.remove();
	});
};

function DocyDrip_OpenEditor_Event(editableContainer){
	let targetid = editableContainer.id;
    if (ObjectMap.has(targetid)) {
        const editor = ObjectMap.get(targetid);
        editor.destroy();
    }
    else {
		const editor = new TEO(editableContainer, editableContainer.getAttribute('data-TEO-BitCode'));       
		//TODO:: Call Your API to Update Database.
	}	
};


//Created the main structure of the object's UI, Main Container with 2 children that all buttons will be placed.
	export function CreateUIContainer(ContentEditableContainer){
		let UIContainer = document.createElement('div');
		UIContainer.classList.add(CSS.UIMasterUIContainer); 
		ContentEditableContainer.insertAdjacentElement('beforebegin', UIContainer);
		
		let BtnBoxone = document.createElement('div');
		BtnBoxone.classList.add(CSS.ButtonBoxFlexEnds);
		UIContainer.prepend(BtnBoxone);
		
		let BtnBoxtwo = document.createElement('div');
		BtnBoxtwo.classList.add(CSS.ButtonBoxFlexEnds);
		UIContainer.prepend(BtnBoxtwo);
		return UIContainer;
	};
	
	function CreateButton(handleBinding, symbol, description) {
		let button = document.createElement('button');
		button.classList.add(CSS.ButtonStyle);
		button.innerHTML = symbol;
		button.title = description;	
		button.addEventListener('click', handleBinding);
		return button;	
	};

	function AddNewOption(value, text) {
        let option = document.createElement('option');
        option.value = value;
        option.innerHTML = text;

        return option;
    };
	
	function  CreateGroupContainer(){
		let container = document.createElement('div');
		container.classList.add(CSS.ButtonGroupBox);				
		return container;
	};
	
	export function CreateBasicTag_Buttons(ObjectUIContainer, bindings){		
		let bold = CreateButton(bindings.boundHandleBoldClick, '&#914', 'Bold');
        let italic = CreateButton(bindings.boundHandleItalicClick, '&#1030', 'Italic');
        let underline = CreateButton(bindings.boundHandleUnderlineClick, '&#9078', 'Underline');

		let box = CreateGroupContainer();
		box.append(bold, italic, underline);
		ObjectUIContainer.firstChild.append(box);

		return { bold, italic, underline};
	};
	
	export function CreateAdvancedTag_Buttons(ObjectUIContainer, bindings){
		let strikethrough = CreateButton(bindings.boundHandleStrikeClick, 'S', 'Strike Through');
        let superscript = CreateButton(bindings.boundHandleSuperscriptClick, 'X<sup>2</sup>', 'Superscript');
        let subscript = CreateButton(bindings.boundHandleSubscriptClick, 'X<sub>2</sub>', 'Subscript');

		let box = CreateGroupContainer();
		box.append(strikethrough, superscript, subscript);
		ObjectUIContainer.firstChild.append(box);
		return {strikethrough, superscript, subscript };
	};

	export function CreateLinkButton(ObjectUIContainer, bindings) {
		let link = CreateButton(bindings.boundHandleLinkClick, '&#128279', 'Link');
		let unlink = CreateButton(bindings.boundHandleUnLinkClick, '&#128682', 'Unlink');
		let newbox = CreateGroupContainer();
		newbox.append(link, unlink);
		ObjectUIContainer.firstChild.append(newbox);
		return {link, unlink};
	}


	export function	CreateStandardBlockTextIndent_Buttons(ObjectUIContainer, bindings){
		let Indent = CreateButton(bindings.boundHandleIndentClick, '&#8640', 'Indent');
        let Outdent = CreateButton(bindings.boundHandleOutdentClick, '&#8636', 'Outdent');
		let newBox = CreateGroupContainer();
		newBox.append(Indent, Outdent);
		ObjectUIContainer.firstChild.append(newBox);
        return {Indent, Outdent};
	};
		
	export function CreateStandardBlockTextAlignment_Buttons(ObjectUIContainer, bindings) {
        let JustifyLeft = CreateButton(bindings.boundHandleJustifyLeftClick, '&#8676', 'Justify Left');
        let JustifyCenter = CreateButton(bindings.boundHandleJustifyCenterClick, '&#8633', 'Justify Center');
        let JustifyRight = CreateButton(bindings.boundHandleJustifyRightClick, '&#8677', 'Justify Right');
        let JustifyFull = CreateButton(bindings.boundHandleJustifyFullClick, '&#8700', 'Justify Full');
        let newBox = CreateGroupContainer();
		newBox.append(JustifyLeft, JustifyCenter, JustifyRight, JustifyFull);
		ObjectUIContainer.firstChild.append(newBox);
        return {JustifyLeft, JustifyCenter, JustifyRight, JustifyFull};
    };
	
	export function	CreateListBlockButtons(ObjectUIContainer, bindings) {
        let OL = CreateButton(bindings.boundHandleOrderedListClick, '&#9776', 'Ordered List');
        let UL = CreateButton(bindings.boundHandleUnorderedListClick, '&#9783', 'Unordered List');
        let box = CreateGroupContainer();
		box.append(OL, UL);
		ObjectUIContainer.firstChild.append(box);
        return {OL, UL};
    };
	
	export function CreateFontColorSelector(ObjectUIContainer, binding) {
		let selector = document.createElement('select');
		selector.classList.add(CSS.SelectorStyle);
		selector.title = "Font Color";
		ObjectUIContainer.firstChild.append(selector);
		selector.appendChild(AddNewOption("none", "Font Color"));
		selector.appendChild(AddNewOption(ExtraOptionStart.Value, ExtraOptionStart.Desc));
		selector.appendChild(AddNewOption(ExtraOptionEnd.Value, ExtraOptionEnd.Desc));
		Array.from(ConstColors.Options).forEach((color) => {
			if(color[1] === ConstColors.DefaultFont)
				selector.appendChild(AddNewOption('', ConstColors.DefaultFont));
			else
				selector.appendChild(AddNewOption(color[0], color[1]));
		});
		selector.addEventListener('change', binding);
		return selector;
	};
	
	export function CreateBackgroundColorSelector(ObjectUIContainer, bindings){
		let selector = document.createElement('select')
		selector.classList.add(CSS.SelectorStyle);
		selector.title = "Background Color";
		ObjectUIContainer.firstChild.append(selector);
		selector.appendChild(AddNewOption("none", "Background Color"));
		selector.appendChild(AddNewOption(ExtraOptionStart.Value, ExtraOptionStart.Desc));
		selector.appendChild(AddNewOption(ExtraOptionEnd.Value, ExtraOptionEnd.Desc));
		Array.from(ConstColors.Options).forEach((color) => {
			if(color[1] === ConstColors.DefaultBackground)
				selector.appendChild(AddNewOption("", ConstColors.DefaultBackground));
			else
				selector.appendChild(AddNewOption(color[0], color[1]));
		});
		selector.addEventListener('change', bindings);
		return selector;
	};
	
	export function CreateFontSizeSelector(ObjectUIContainer, bindings){
		let selector = document.createElement('select')
		selector.classList.add(CSS.SelectorStyle);
		selector.title = "Font Size";
		ObjectUIContainer.firstChild.append(selector);
		selector.appendChild(AddNewOption("none", "No Change"));
		selector.appendChild(AddNewOption(ExtraOptionStart.Value, ExtraOptionStart.Desc));
		selector.appendChild(AddNewOption(ExtraOptionEnd.Value, ExtraOptionEnd.Desc));
		Array.from(ConstFontSizes.Options).forEach((size) => {
			if(size === ConstFontSizes.DefaultSize)
				selector.appendChild(AddNewOption("", ConstFontSizes.DefaultSize));
			else
				selector.appendChild(AddNewOption(size, size));
		});
		selector.addEventListener('change', bindings);
		return selector;		
	};
	
	export function CreateFontFamilySelector(ObjectUIContainer, bindings){
		let selector = document.createElement('select');
		selector.classList.add(CSS.SelectorStyle);
		selector.title = "Font Family";
		ObjectUIContainer.firstChild.append(selector);
		selector.appendChild(AddNewOption("none", "Font Family"));
		selector.appendChild(AddNewOption(ExtraOptionStart.Value, ExtraOptionStart.Desc));
		selector.appendChild(AddNewOption(ExtraOptionEnd.Value, ExtraOptionEnd.Desc));
		Array.from(ConstFontFamilies.Options).forEach((font) => {
			if(font === ConstFontFamilies.DefaultFamily)
				selector.appendChild(AddNewOption('', ConstFontFamilies.DefaultFamily));
			else
				selector.appendChild(AddNewOption(font, font));
		});
		selector.addEventListener('change', bindings);
		return selector;
	};
	
	export function CreateStandardBlockOptions(ObjectUIContainer, bindings) {
        let selector = document.createElement('select');
		selector.classList.add(CSS.SelectorStyle);
        ObjectUIContainer.firstChild.append(selector);
        selector.appendChild(AddNewOption(Const.Block, 'Paragraph'));
        selector.appendChild(AddNewOption(StandardStructures.H1, 'Header 1'));
        selector.appendChild(AddNewOption(StandardStructures.H2, 'Header 2'));
        selector.appendChild(AddNewOption(StandardStructures.H3, 'Header 3'));
        selector.appendChild(AddNewOption(StandardStructures.H4, 'Header 4'));
        selector.appendChild(AddNewOption(StandardStructures.H5, 'Header 5'));
        selector.appendChild(AddNewOption(StandardStructures.H6, 'Header 6'));

        selector.addEventListener('change', bindings);
        return selector;
    };