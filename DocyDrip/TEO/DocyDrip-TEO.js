// Attribution
// DocyDrip - Text Editor
// Organization - pig booger Studio
// Created By: Tyler Andrew Reber
// Date: 05/01/2024
// Version: 0.1a
// https://github.com/TAReber/DocyDrip

//Alpha Build

//Text Editor Object That Can be Created Created And Deleted Freely
// While remaining Isolated from Adjacent Text Editors


//When the text editors are openened, onlt then is the text editor created and stored.
const OpenEditors = new Map();


document.addEventListener('DOMContentLoaded', () => {
	Event_DripDocs_TEO_Selector();
});

function Event_DripDocs_TEO_Selector() {
	let toggle = document.querySelector('.DocyDrip-TEO-Selector-Event');	
	toggle.addEventListener('click', (e) => {
		if(toggle.classList.contains('Active')){
			toggle.classList.remove('Active');
			Remove_OpenEditor_Toggles();
		}
		else{
			toggle.classList.add('Active');
			Add_OpenEditor_Toggles();
		}		
	});
}

function Add_OpenEditor_Toggles(){
	let queryTargets = document.querySelectorAll('.DocyDrip-TEO-Editable-Container');
	Array.from(queryTargets).forEach((editableElement) => {
				
		let details = document.createElement('details');
		details.classList.add('DocyDrip-TEO-ObjectCreator');
		editableElement.parentNode.prepend(details);
		let summary = document.createElement('summary');
		summary.classList.add('DocyDrip-TEO-BlueBook');
		details.appendChild(summary);
		
		summary.addEventListener('click', function() {
			DocyDrip_OpenEditor_Event(editableElement);
		});			
	});
}

function Remove_OpenEditor_Toggles(){
	if(OpenEditors.size > 0){
		let result = window.confirm(`Editor Current Open: ${OpenEditors.count}, Press OK to Save, Cancel to Discard`);
		OpenEditors.forEach((texteditorobject, key) => {
			if(result === false){
				texteditorobject.RestoreOriginalContent();
			}
			texteditorobject.destroy();
			//TODO:: Call Your API to Update Database.
		});	
	}

	let toggles = document.querySelectorAll('.DocyDrip-TEO-ObjectCreator');

	Array.from(toggles).forEach((bluebook) => {
		bluebook.remove();
		// if(editableElement.previousSibling.classList.contains('DocyDrop-TEO-ObjectCreator'))
			// editableElement.previousSibling.remove();
	});
}

function DocyDrip_OpenEditor_Event(editableContainer){
    if (editableContainer.classList.contains(Active) === false) {		
        const editor = new RichTextEditorObject(editableContainer, editableContainer.getAttribute('data-TEO-BitCode'));
    }
    else {
		let targetid = editableContainer.id;
        const editor = OpenEditors.get(targetid);
        editor.destroy();
		//TODO:: Call Your API to Update Database.
	}	
}

//Initialization class name 
const Active = 'Active';

const ConstTree = 'SPAN';
//Standard Block Tags

const ConstBlock = 'P';
const ConstH1 = 'H1';
const ConstH2 = 'H2';
const ConstH3 = 'H3';
const ConstH4 = 'H4';
const ConstH5 = 'H5';
const ConstH6 = 'H6';
const StandardStructureTags = [ConstBlock, ConstH1, ConstH2, ConstH3, ConstH4, ConstH5, ConstH6];

//List Block Elements
const ConstUList = 'UL';
const ConstOList = 'OL';
const ConstListItem = 'LI';

//CSS CLASS Globals
const ClassUIButtonContainer = 'DocyDrip-TEO-UI-Box';
const ClassButtonUIFlexEnds = 'DocyDrip-TEO-UI-Box-Ends';
const ClassButtonGroupBox = 'DocyDrip-TEO-Button-Group';
const ClassButtonClickStyle = 'DocyDrip-TEO-Button-Style';
const ClassSelectorStyle = 'DocyDrip-TEO-Selector-Style';

//Options
const ClassIndent = 'indent';
const ClassOutdent = 'outdent';
const ClassJustifyLeft = 'justify-left';
const ClassJustifyCenter = 'justify-center';
const ClassJustifyRight = 'justify-right';
const ClassJustifyFull = 'justify-full';
const BlockClasses = [ClassJustifyLeft, ClassJustifyCenter, ClassJustifyRight, ClassJustifyFull];

//BitWise Constants //No Extras = 0
const Bit_BasicTags = 1; // (1) Bold, Italic, Underline
const Bit_AdvancedTags = (1 << 1); // (2) Strikethrough, Subscript, SuperScirpt
const Bit_FontColorsOptions = (1 << 2); // (4)
const Bit_FontBackgroundColorOptions = (1 << 3); // (8)
const Bit_FontSizeOptions = (1 << 4); // (16)
const Bit_FontFamilyOptions = (1 << 5);  // (32)
const Bit_StandardHeaders = (1 << 6); //  (64)  H1 - H6
const Bit_StandardBlockFormats = (1 << 7); // (128)   Standard Block Alignment and justify
const Bit_ListBlocks = (1 << 8); //  (256)   Ordered and Unordered Lists
const Bit_ListBlockFormats = (1 << 9); // (512) Not Used



//Void Element
const ConstBR = 'BR';

const ConstDefaultFontFamily = "Arial"; //Initialized Seperatly with ""
const ConstFontFamilies = [
    "Arial", "Verdana", "Times New Roman", "Georgia", "Trebuchet MS",
    "Tahoma", "Courier New", "Lucida Console", "Impact", "Comic Sans MS",
    "Palatino Linotype", "Book Antiqua", "Lucida Sans Unicode", "Garamond", "MS Serif",
    "MS Sans Serif", "Lucida Grande", "Geneva", "Helvetica", "Courier", "Monaco", "Optima",
    "Hoefler Text", "Baskerville", "Big Caslon", "American Typewriter", "Andale Mono", "Copperplate",
    "Papyrus", "Brush Script MT", "Snell Roundhand", "Zapf Chancery", "Zapfino"
];

const ConstDefaultFontColor = "Black"; //Trees with out a style will default to ""
const ConstDefaultBackgroundColor = "White"
const ConstColorOptions = [
  ["rgb(0, 0, 0)", "Black"],
  ["rgb(255, 255, 255)", "White"],
  ["rgb(255, 0, 0)", "Red"],
  ["rgb(0, 255, 0)", "Green"],
  ["rgb(0, 0, 255)", "Blue"],
  ["rgb(255, 255, 0)", "Yellow"],
  ["rgb(255, 0, 255)", "Magenta"],
  ["rgb(0, 255, 255)", "Cyan"],
  ["rgb(255, 165, 0)", "Orange"],
  ["rgb(128, 0, 128)", "Purple"],
  ["rgb(0, 128, 0)", "Dark Green"],
  ["rgb(0, 0, 128)",  "Navy"]
];

const ConstDefaultFontSize = '12px'; //Option Initialized Seperatly
const ConstFontSizes = [
	"12px",
	"14px",
	"18px",
	"22px",
	"26px",
	"30px",
]

const Behavior = {
    Add: 1,
    Remove: 2,
    Toggle: 3
}

const StyleType = {
	Color: 1,
	FontFamily: 2,
	BackgroundColor: 3,
	FontSize: 4
}

const ExtraOptionStart = {
	Value: "TEO-Sync-Start",
	Desc: "Normalize Start"
}

const ExtraOptionEnd = {
	Value:"TEO-Sync-End",
	Desc: "Normalize End"
}

class RichTextEditorObject {

    constructor(editableContainer, data) {
		this.Page = editableContainer;
        this.Page.contentEditable = true;
		this.id = this.Page.id;
		OpenEditors.set(this.id, this);
		
		this.UIContainer = this.CreateUIContainer(); //2 Children, first for Styling UI, Last for Settings.

		//Targeting Variables Surrounding Selections and clicking
        this.StartBlock = null;
        this.EndBlock = null;
        this.RangeTree_Start = null;
        this.RangeTree_End = null;
        this.XTargetStart = null;
        this.XTargetEnd = null;
				
		if(data === null){
			data = 0;		
		}		
		this.Options = data;
		
		//Essential Editor Behaviors
        this.boundHandlePageSelectionChange = this.HandlePageSelectionChange.bind(this);

        this.boundHandlePageKeyDown = this.HandlePageKeyDown.bind(this);
        this.boundHandlePageFocusOut = this.HandlePageFocusOut.bind(this);
        this.boundHandlePageMouseUp = this.HandlePageMouseUp.bind(this);
        this.boundHandlePageMouseDown = this.HandlePageMouseDown.bind(this);
        this.boundHandlePageInput = this.HandlePageInputEvent.bind(this);
        this.boundHandlePageDragStart = this.HandlePageDragStart.bind(this);
        this.boundHandlePageDragDrop = this.HandlePageDragDrop.bind(this);
        this.boundHandlePagePaste = this.HandlePagePasteText.bind(this);
		this.Initialize();


		this.BasicTags_Bindings;
		this.BasicTags_Buttons = null;
		if(this.Options & Bit_BasicTags){
			this.BasicTags_Bindings = {
				boundHandleBoldClick: this.HandleStyleButtonClick.bind(this, 'B'),
				boundHandleItalicClick: this.HandleStyleButtonClick.bind(this, 'I'),
				boundHandleUnderlineClick: this.HandleStyleButtonClick.bind(this, 'U')
			}
			this.BasicTags_Buttons = this.CreateBasicTag_Buttons(this.UIContainer.firstChild);
		}

		this.AdvancedTags_Bindings;
		this.AdvancedTags_Buttons = null;
		if(this.Options & Bit_AdvancedTags){
			this.AdvancedTags_Bindings = {
				boundHandleStrikeClick: this.HandleStyleButtonClick.bind(this, 'STRIKE'),
				boundHandleSuperscriptClick: this.HandleStyleButtonClick.bind(this, 'SUP'),
				boundHandleSubscriptClick: this.HandleStyleButtonClick.bind(this, 'SUB')
			}
			this.AdvancedTags_Buttons = this.CreateAdvancedTag_Buttons(this.UIContainer.firstChild);
		}
		
		this.boundHandleTextColorOptionChange = null;
		this.ColorSelector = null;
		if(this.Options & Bit_FontColorsOptions){
			this.boundHandleTextColorOptionChange = this.HandleTextColorOptionChange.bind(this);
			this.ColorSelector = this.CreateFontColorSelector(this.UIContainer.firstChild);
		}
		
		this.boundHandleBackgroundColorOptionsChange = null;
		this.BackgroundColorSelector = null;
		if(this.Options & Bit_FontBackgroundColorOptions) {
			this.boundHandleBackgroundColorOptionsChange = this.HandleBackgroundColorOptionsChange.bind(this);
			this.BackgroundColorSelector = this.CreateBackgroundColorSelector(this.UIContainer.firstChild);
		}
		
		this.boundHandleFontSizeOptionsChange = null;
		this.FontSizeSelector = null;
		if(this.Options & Bit_FontSizeOptions) {
			this.boundHandleFontSizeOptionsChange = this.HandleFontSizeOptionsChange.bind(this);
			this.FontSizeSelector = this.CreateFontSizeSelector(this.UIContainer.firstChild);
		}
		
		this.boundHandleFontFamilyOptionsChange = null;
		this.FontFamilySelector = null;	
		if(this.Options & Bit_FontFamilyOptions){
			this.boundHandleFontFamilyOptionsChange = this.HandleFontFamilyOptionsChange.bind(this);
			this.FontFamilySelector = this.CreateFontFamilySelector(this.UIContainer.firstChild);	
		}
		
		
		this.boundHandleStandardBlockOptionsChange = null;
		this.StandardBlockSelector = null;
		if(this.Options & Bit_StandardHeaders) {
			this.boundHandleStandardBlockOptionsChange = this.HandleStandardBlockOptionsChange.bind(this);
			this.StandardBlockSelector = this.CreateStandardBlockOptions(this.UIContainer.firstChild);
		}
		
		this.StandardBlockFormats_Bindings = null;
		this.StandardBlockFormat_Buttons = null;
		if(this.Options & Bit_StandardBlockFormats){
			this.StandardBlockFormats_Bindings = {
				boundHandleIndentClick: this.HandleBlockFormatClick.bind(this, ClassIndent),
				boundHandleOutdentClick: this.HandleBlockFormatClick.bind(this, ClassOutdent),
				boundHandleJustifyLeftClick: this.HandleBlockFormatClick.bind(this, ClassJustifyLeft),
				boundHandleJustifyCenterClick: this.HandleBlockFormatClick.bind(this, ClassJustifyCenter),
				boundHandleJustifyRightClick: this.HandleBlockFormatClick.bind(this, ClassJustifyRight),
				boundHandleJustifyFullClick: this.HandleBlockFormatClick.bind(this, ClassJustifyFull)
			}
			this.StandardBlockFormat_Buttons = this.CreateStandardBlockFormatButtons(this.UIContainer.firstChild);
		}
		
		this.ListBlock_Bindings = null;
		this.ListBlock_Buttons = null;
		if(this.Options & Bit_ListBlocks){
			this.ListBlock_Bindings = {
				boundHandleOrderedListClick: this.HandleBlockStyleClick.bind(this, 'OL'),
				boundHandleUnorderedListClick: this.HandleBlockStyleClick.bind(this, 'UL')
			}
			this.ListBlock_Buttons = this.CreateListBlockButtons(this.UIContainer.firstChild);
		}
		//Not Implemented
		if(this.Options & Bit_ListBlockFormats){
			//console.log('non existent list Options include');
		}
	

		let range = document.createRange();
		range.selectNodeContents(this.Page);
		this.OriginalHTMLContent = range.cloneContents();

    }
	
    destroy() {
        //console.log('Destroying Object');
        this.Page.classList.remove(Active);
        this.Page.contentEditable = false;
        document.removeEventListener('selectionchange', this.boundHandlePageSelectionChange);

        this.Page.removeEventListener('keydown', this.boundHandlePageKeyDown);
        this.Page.removeEventListener('focusout', this.boundHandlePageFocusOut);
        this.Page.removeEventListener('mouseup', this.boundHandlePageMouseUp);
        this.Page.removeEventListener('mousedown', this.boundHandlePageDown);
        this.Page.removeEventListener('input', this.boundHandlePageInput);
        this.Page.removeEventListener('dragstart', this.boundHandlePageDragStart);
        this.Page.removeEventListener('drop', this.boundHandlePageDragDrop);
        this.Page.removeEventListener('paste', this.boundHandlePagePaste);
				
		if(this.Options & Bit_BasicTags){
			this.BasicTags_Buttons.bold.removeEventListener('click', this.BasicTags_Bindings.boundHandleBoldClick);
			this.BasicTags_Buttons.italic.removeEventListener('click', this.BasicTags_Bindings.boundHandleItalicClick);
			this.BasicTags_Buttons.underline.removeEventListener('click', this.BasicTags_Bindings.boundHandleUnderlineClick);
		}		
		if(this.Options & Bit_AdvancedTags){
			this.AdvancedTags_Buttons.strikethrough.removeEventListener('click', this.AdvancedTags_Bindings.boundHandleStrikeThroughClick);
			this.AdvancedTags_Buttons.subscript.removeEventListener('click', this.AdvancedTags_Bindings.boundHandleSubscriptClick);
			this.AdvancedTags_Buttons.superscript.removeEventListener('click', this.AdvancedTags_Bindings.boundHandleSuperscriptClick);
		}		
		if(this.Options & Bit_FontColorsOptions){
			this.ColorSelector.removeEventListener('change', this.boundHandleTextColorOptionChange);
		}
		
		if(this.Options & Bit_FontBackgroundColorOptions) {
			this.BackgroundColorSelector.removeEventListener('change', this.boundHandleBackgroundColorOptionsChange);
		}
		
		if(this.Options & Bit_FontSizeOptions) {
			this.FontSizeSelector.removeEventListener('change', this.boundHandleFontSizeOptionsChange);
		}
		
		if(this.Options & Bit_FontFamilyOptions){
			this.FontFamilySelector.removeEventListener('change', this.boundHandleFontFamilyOptionsChange);
		}
				
		if(this.Options & Bit_StandardHeaders) {
			this.StandardBlockSelector.removeEventListener('change', this.boundHandleStandardBlockOptionsChange);
		}
		
		if(this.Options & Bit_StandardBlockFormats){
			this.StandardBlockFormat_Buttons.Indent.removeEventListener('click', this.StandardBlockFormats_Bindings.boundHandleIndentClick);
			this.StandardBlockFormat_Buttons.Outdent.removeEventListener('click', this.StandardBlockFormats_Bindings.boundHandleOutdentClick);
			this.StandardBlockFormat_Buttons.JustifyLeft.removeEventListener('click', this.StandardBlockFormats_Bindings.boundHandleJustifyLeftClick);
			this.StandardBlockFormat_Buttons.JustifyCenter.removeEventListener('click', this.StandardBlockFormats_Bindings.boundHandleJustifyCenterClick);
			this.StandardBlockFormat_Buttons.JustifyRight.removeEventListener('click', this.StandardBlockFormats_Bindings.boundHandleJustifyRightClick);
			this.StandardBlockFormat_Buttons.JustifyFull.removeEventListener('click', this.StandardBlockFormats_Bindings.boundHandleJustifyFullClick);
		}
		
		if(this.Options & Bit_ListBlocks){
			this.ListBlock_Buttons.OL.removeEventListener('click', this.ListBlock_Bindings.boundHandleOrderedListClick),
			this.ListBlock_Buttons.UL.removeEventListener('click', this.ListBlock_Bindings.boundHandleUnorderedListClick)
		}
		
		if(this.Options & Bit_ListBlockFormats){
			//No Formats Exist, or might ever exist.
		}

		this.UIContainer.remove();
	
        OpenEditors.delete(this.id);
    }
	RestoreOriginalContent() {
		console.log('restoring');
		this.Page.innerHTML = "";
		this.Page.appendChild(this.OriginalHTMLContent);
	}
	
	Initialize() {
        //this.Editor.classList.add(Active);
        this.Page.classList.add(Active);
			
        if (this.Page.children.length === 0) {
            let paragraph = this.CreateNewBlock();
            this.Page.append(paragraph);
        }
		Array.from(this.Page.childNodes).forEach((child) => {
			if(child.nodeType === Node.TEXT_NODE){
				this.Page.removeChild(child);
			}
		});
		document.getSelection().setPosition(this.GetFirstNode(this.Page), 0);

        document.addEventListener('selectionchange', this.boundHandlePageSelectionChange);

        this.Page.addEventListener('keydown', this.boundHandlePageKeyDown);
        this.Page.addEventListener('focusout', this.boundHandlePageFocusOut);
        this.Page.addEventListener('mouseup', this.boundHandlePageMouseUp);
        this.Page.addEventListener('mousedown', this.boundHandlePageMouseDown);
        this.Page.addEventListener('input', this.boundHandlePageInput);
        this.Page.addEventListener('dragstart', this.boundHandlePageDragStart);
        this.Page.addEventListener('drop', this.boundHandlePageDragDrop);
        this.Page.addEventListener('paste', this.boundHandlePagePaste);
    }
	
	
    HandlePageSelectionChange() {
        if (document.activeElement === this.Page) {
            this.ClearTargetSelections();
            this.RebuildTargetSelections();
        }
    }

    HandlePageKeyDown(events) {
        this.KeyBoardPageEvents(events);
    }
    HandlePageFocusOut() {
        //console.log('Focus Out');
        this.ClearTargetSelections();
    }
    HandlePageMouseUp() {
        //console.log('Mouse Up');
        //this.ClearTargetSelections();
    }
    HandlePageMouseDown() {
        //this.ClearTargetSelections();
    }
    HandlePageInputEvent(events) {
        //this.Selection_KeyInput(events);
    }
    HandlePageDragStart(event) {
        //console.log('start drag');
        event.preventDefault();
        event.stopPropagation();
    }
    HandlePagePasteText(event) {
        event.preventDefault();
        let plaintext = event.clipboardData.getData('text/plain');

        let selection = document.getSelection();
        let range = selection.getRangeAt(0);

        let offset = range.startOffset + plaintext.length;
        if (event.target.tagName === ConstBR) {
            let text = document.createTextNode(plaintext);          
            event.target.parentNode.prepend(text);
            event.target.remove();
        }
        else {
            let textarea = event.target;
            const textBefore = textarea.textContent.substring(0, range.startOffset);
            const textAfter = textarea.textContent.substring(range.endOffset);
            textarea.textContent = textBefore + plaintext + textAfter;           
        }
        selection.setPosition(this.GetTreeNode(this.RangeTree_Start), offset);
    }


    HandlePageDragDrop(event) {
        //console.log(event);
        event.preventDefault();
        event.stopPropagation();
    }

    HandleStyleButtonClick(tag) {
        this.ToggleTreeTag(tag);
    }
    HandleBlockStyleClick(tag) {
        this.ToggleBlockTag(tag);
    }
    HandleBlockFormatClick(style) {
        this.ToggleBlockFormat(style);
    }
    HandleStandardBlockOptionsChange(event) {
        if (event.isTrusted) {			
            this.ChangeBlockType(this.StandardBlockSelector.value);
        }
    }

	HandleTextColorOptionChange(event){
		if(event.isTrusted) {
			if(this.ColorSelector.value !== 'none'){				
				if(this.ColorSelector.value === ExtraOptionStart.Value)
					this.ToggleTreeStyle(this.RangeTree_Start.style.color, StyleType.Color);
				else if(this.ColorSelector.value === ExtraOptionEnd.Value)
					this.ToggleTreeStyle(this.RangeTree_End.style.color, StyleType.Color);
				else
					this.ToggleTreeStyle(this.ColorSelector.value, StyleType.Color);
			}
		}
	}
	HandleBackgroundColorOptionsChange(event){
		if(event.isTrusted){
			if(this.BackgroundColorSelector.value !== 'none') {
				if(this.BackgroundColorSelector.value === ExtraOptionStart.Value)
					this.ToggleTreeStyle(this.RangeTree_Start.style.backgroundColor, StyleType.BackgroundColor);
				else if(this.BackgroundColorSelector.value === ExtraOptionEnd.Value)
					this.ToggleTreeStyle(this.RangeTree_End.style.ackgroundColor, StyleType.BackgroundColor);
				else
					this.ToggleTreeStyle(this.BackgroundColorSelector.value, StyleType.BackgroundColor);
			}
		}
	}
	HandleFontSizeOptionsChange(event){
		if(event.isTrusted){
			if(this.FontSizeSelector.value !== 'none'){
				if(this.FontSizeSelector.value === ExtraOptionStart.Value)
					this.ToggleTreeStyle(this.RangeTree_Start.style.fontSize, StyleType.FontSize);
				else if(this.FontSizeSelector.value === ExtraOptionEnd.Value)
					this.ToggleTreeStyle(this.RangeTree_End.style.fontSize, StyleType.FontSize);
				else
					this.ToggleTreeStyle(this.FontSizeSelector.value, StyleType.FontSize);
			}
		}
	}
	
	HandleFontFamilyOptionsChange(event) {
		if(event.isTrusted) {
			if(this.FontFamilySelector.value !== 'none') {
				if(this.FontFamilySelector.value === ExtraOptionStart.Value)
					this.ToggleTreeStyle(this.RangeTree_Start.style.fontFamily, StyleType.FontFamily);
				else if(this.FontFamilySelector.value === ExtraOptionEnd.Value)
					this.ToggleTreeStyle(this.RangeTree_End.style.fontFamily, StyleType.FontFamily);
				else
					this.ToggleTreeStyle(this.FontFamilySelector.value, StyleType.FontFamily)
			}
		}
	}
	
	CreateUIContainer(){
		let UIContainer = document.createElement('div');
		UIContainer.classList.add(ClassUIButtonContainer); 
		this.Page.insertAdjacentElement('beforebegin', UIContainer);
		
		let BtnBoxone = document.createElement('div');
		BtnBoxone.classList.add(ClassButtonUIFlexEnds);
		UIContainer.prepend(BtnBoxone);
		
		let BtnBoxtwo = document.createElement('div');
		BtnBoxtwo.classList.add(ClassButtonUIFlexEnds);
		UIContainer.prepend(BtnBoxtwo);
		return UIContainer;
	}
	
	CreateGroupContainer(){
		let container = document.createElement('div');
		container.classList.add(ClassButtonGroupBox);				
		return container;
	}

	CreateBasicTag_Buttons(buttonContainer){		
		let bold = this.NewClickButton(this.BasicTags_Bindings.boundHandleBoldClick, '&#914', 'Bold');
        let italic = this.NewClickButton(this.BasicTags_Bindings.boundHandleItalicClick, '&#1030', 'Italic');
        let underline = this.NewClickButton(this.BasicTags_Bindings.boundHandleUnderlineClick, '&#9078', 'Underline');

		let box = this.CreateGroupContainer();
		box.append(bold, italic, underline);
		buttonContainer.append(box);

		return { bold, italic, underline};
	}
	
	CreateAdvancedTag_Buttons(buttonContainer){
		let strikethrough = this.NewClickButton(this.AdvancedTags_Bindings.boundHandleStrikeClick, 'S', 'Strike Through');
        let superscript = this.NewClickButton(this.AdvancedTags_Bindings.boundHandleSuperscriptClick, 'X<sup>2</sup>', 'Superscript');
        let subscript = this.NewClickButton(this.AdvancedTags_Bindings.boundHandleSubscriptClick, 'X<sub>2</sub>', 'Subscript');

		let box = this.CreateGroupContainer();
		box.append(strikethrough, superscript, subscript);
		buttonContainer.append(box);
		return {strikethrough, superscript, subscript };
	}
		
	CreateStandardBlockFormatButtons(buttonContainer) {
        let Indent = this.NewClickButton(this.StandardBlockFormats_Bindings.boundHandleIndentClick, '&#8640', 'Indent');
        let Outdent = this.NewClickButton(this.StandardBlockFormats_Bindings.boundHandleOutdentClick, '&#8636', 'Outdent');
        let JustifyLeft = this.NewClickButton(this.StandardBlockFormats_Bindings.boundHandleJustifyLeftClick, '&#8676', 'Justify Left');
        let JustifyCenter = this.NewClickButton(this.StandardBlockFormats_Bindings.boundHandleJustifyCenterClick, '&#8633', 'Justify Center');
        let JustifyRight = this.NewClickButton(this.StandardBlockFormats_Bindings.boundHandleJustifyRightClick, '&#8677', 'Justify Right');
        let JustifyFull = this.NewClickButton(this.StandardBlockFormats_Bindings.boundHandleJustifyFullClick, '&#8700', 'Justify Full');
        let newBox = this.CreateGroupContainer();

		newBox.append(Indent, Outdent, JustifyLeft, JustifyCenter, JustifyRight, JustifyFull);
		buttonContainer.append(newBox);
        return {Indent, Outdent, JustifyLeft, JustifyCenter, JustifyRight, JustifyFull};
    }
	
	    CreateListBlockButtons(buttonContainer) {
        let OL = this.NewClickButton(this.ListBlock_Bindings.boundHandleOrderedListClick, '&#9776', 'Ordered List');
        let UL = this.NewClickButton(this.ListBlock_Bindings.boundHandleUnorderedListClick, '&#9783', 'Unordered List');
        let box = this.CreateGroupContainer();
		box.append(OL, UL);
		buttonContainer.append(box);
        return {OL, UL};
    }

    NewClickButton(handleBinding, text, description) {
        let button = document.createElement('button');
        button.classList = ClassButtonClickStyle;
        button.innerHTML = text;
        button.title = description;	
        button.addEventListener('click', handleBinding);

        return button;
    }
	
	CreateStandardBlockOptions(container) {
        let selector = document.createElement('select');
		selector.classList.add(ClassSelectorStyle);
        container.append(selector);
        selector.appendChild(this.AddNewOption(ConstBlock, 'Paragraph'));
        selector.appendChild(this.AddNewOption(ConstH1, 'Header 1'));
        selector.appendChild(this.AddNewOption(ConstH2, 'Header 2'));
        selector.appendChild(this.AddNewOption(ConstH3, 'Header 3'));
        selector.appendChild(this.AddNewOption(ConstH4, 'Header 4'));
        selector.appendChild(this.AddNewOption(ConstH5, 'Header 5'));
        selector.appendChild(this.AddNewOption(ConstH6, 'Header 6'));

        selector.addEventListener('change', this.boundHandleStandardBlockOptionsChange);
        return selector
    }

	
	CreateFontColorSelector(container) {
		let selector = document.createElement('select');
		selector.classList.add(ClassSelectorStyle);
		selector.title = "Font Color";
		container.append(selector);
		selector.appendChild(this.AddNewOption("none", "Font Color"));
		selector.appendChild(this.AddNewOption(ExtraOptionStart.Value, ExtraOptionStart.Desc));
		selector.appendChild(this.AddNewOption(ExtraOptionEnd.Value, ExtraOptionEnd.Desc));
		Array.from(ConstColorOptions).forEach((color) => {
			if(color[1] === ConstDefaultFontColor)
				selector.appendChild(this.AddNewOption('', ConstDefaultFontColor));
			else
				selector.appendChild(this.AddNewOption(color[0], color[1]));
		});
		selector.addEventListener('change', this.boundHandleTextColorOptionChange);
		return selector;
	}
	
	CreateBackgroundColorSelector(container){
		let selector = document.createElement('select')
		selector.classList.add(ClassSelectorStyle);
		selector.title = "Background Color";
		container.append(selector);
		selector.appendChild(this.AddNewOption("none", "Background Color"));
		selector.appendChild(this.AddNewOption(ExtraOptionStart.Value, ExtraOptionStart.Desc));
		selector.appendChild(this.AddNewOption(ExtraOptionEnd.Value, ExtraOptionEnd.Desc));
		Array.from(ConstColorOptions).forEach((color) => {
			if(color[1] === ConstDefaultBackgroundColor)
				selector.appendChild(this.AddNewOption("", ConstDefaultBackgroundColor));
			else
				selector.appendChild(this.AddNewOption(color[0], color[1]));
		});
		selector.addEventListener('change', this.boundHandleBackgroundColorOptionsChange);
		return selector;
	}
	
	CreateFontSizeSelector(container){
		let selector = document.createElement('select');
		selector.classList.add(ClassSelectorStyle);
		selector.title = "Font Size";
		container.append(selector);
		selector.appendChild(this.AddNewOption("none", "Font Size"));
		selector.appendChild(this.AddNewOption(ExtraOptionStart.Value, ExtraOptionStart.Desc));
		selector.appendChild(this.AddNewOption(ExtraOptionEnd.Value, ExtraOptionEnd.Desc));
		Array.from(ConstFontSizes).forEach((fontsize) => {
			if(fontsize === ConstDefaultFontSize)
				selector.appendChild(this.AddNewOption('', fontsize));
			else
				selector.appendChild(this.AddNewOption(fontsize, fontsize));
		});
		selector.addEventListener('change', this.boundHandleFontSizeOptionsChange);
		return selector;
	}
	
	CreateFontFamilySelector(container){
		let selector = document.createElement('select');
		selector.classList.add(ClassSelectorStyle);
		selector.title = "Font Family";
		container.append(selector);
		selector.appendChild(this.AddNewOption("none", "Font Family"));
		selector.appendChild(this.AddNewOption(ExtraOptionStart.Value, ExtraOptionStart.Desc));
		selector.appendChild(this.AddNewOption(ExtraOptionEnd.Value, ExtraOptionEnd.Desc));
		Array.from(ConstFontFamilies).forEach((font) => {
			if(font === ConstDefaultFontFamily)
				selector.appendChild(this.AddNewOption('', ConstDefaultFontFamily));
			else
				selector.appendChild(this.AddNewOption(font, font));
		});
		selector.addEventListener('change', this.boundHandleFontFamilyOptionsChange);
		return selector;
	}

    AddNewOption(value, text) {
        let option = document.createElement('option');
        option.value = value;
        option.innerHTML = text;

        return option;
    }


    Selection_KeyInput(event) {
        console.log(event);
    }
    PrintTargets() {
        this.Selection_LazySelector_Word();
		console.log(this.StartBlock);
		console.log(this.EndBlock);
		console.log(document.getSelection().getRangeAt(0));
    }

    KeyBoardPageEvents(event) {
        if (event.keyCode === 192) {
            event.preventDefault();
            event.stopPropagation();
            this.PrintTargets();
        }
        else if (event.code === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            let selection = document.getSelection();
            let rangeclone = selection.getRangeAt(0).cloneRange();

            if (selection.type === 'Range') {
                rangeclone = this.Selection_Delete();
                rangeclone.setStart(rangeclone.endContainer, rangeclone.endOffset);

                selection.removeAllRanges();
                selection.addRange(rangeclone);
            }
            else { //Selection Type is Caret               
                if (event.shiftKey) {
                    if (this.Block_is_Standard_Structure(this.StartBlock)) {
                        rangeclone = this.Block_Standard_Behavior_ShiftEnterKey();
                    }
                    else {
                        if (this.Block_is_List_Structure(this.StartBlock)) {
                            rangeclone = this.Block_List_Behavior_ShiftEnterKey();
                        }
                    }
                }
                else { //Logic for a Normal Enter Key Press                   
                    if (this.Block_is_Standard_Structure(this.StartBlock)) {
                        rangeclone = this.Block_Standard_Behavior_EnterKey();
                    }
                    else {
                        //SubBlock Level Unique Enter Behaviors
                        if (this.Block_is_List_Structure(this.StartBlock)) {
                            rangeclone = this.Block_List_Behavior_EnterKey();
                        }
                    }
                }
            }
            selection.removeAllRanges();
            selection.addRange(rangeclone);

        }
        else if (event.code === 'Backspace') {

            //Create my Own behaviors to ensure I handle the paragraph creation and deletion for targeting system.
            let selection = document.getSelection();
            let rangeclone = selection.getRangeAt(0).cloneRange();

            if (selection.type === 'Range') {
                event.preventDefault();
                event.stopPropagation();

                rangeclone = this.Selection_Delete();
                rangeclone.setEnd(rangeclone.startContainer, rangeclone.startOffset);

                selection.removeAllRanges();
                selection.addRange(rangeclone);

            }
            else { //Selection Type is Caret

                if (this.Block_is_Standard_Structure(this.StartBlock)) {
                    rangeclone = this.Block_Standard_Behavior_BackspaceKey(event);
                }
                else { //Process Alternate Block Types

                    if (this.Block_is_List_Structure(this.StartBlock)) {
                        rangeclone = this.Block_List_Behavior_BackspaceKey(event);
                    }
                }
            }
        }

        else if (event.code === 'Delete') {
            let selection = document.getSelection();
            let rangeclone = selection.getRangeAt(0).cloneRange();

            if (selection.type === 'Range') {
                event.preventDefault();
                event.stopPropagation();

                rangeclone = this.Selection_Delete();
                rangeclone.setStart(rangeclone.endContainer, rangeclone.endOffset);

                selection.removeAllRanges();
                selection.addRange(rangeclone);

            }
            else { //Selection Type is Caret

                if (this.Block_is_Standard_Structure(this.StartBlock)) {
                    rangeclone = this.Block_Standard_Behavior_DeleteKey(event);
                }
                else {
                    if (this.Block_is_List_Structure(this.StartBlock)) {
                        rangeclone = this.Block_List_Behavior_DeleteKey(event);
                    }
                }

            }
        }
        else { //Default Behavior
            if (document.getSelection().type === 'Range') {

                if (event.key.startsWith('Arrow') === false &&
                    (!event.shiftKey && !event.altKey && !event.ctrlKey)) {
                    let selection = document.getSelection();
                    let range = selection.getRangeAt(0);
                    range = this.Selection_Delete();
                    range.setEnd(range.startContainer, range.startOffset);
                }
            }
        }
    }

    //Merges previous Blocks if its the same type or sets the caret to the end of the previous block
    BackSpace_BlockBehavior(previousBlock) {
        let range = document.createRange();
        //Turn into Function
        if (previousBlock.tagName === this.StartBlock.tagName) {
            //let lasttree = this.GetLastTreeNode(previousBlock);
            range.selectNodeContents(previousBlock);
            this.StartBlock.prepend(range.extractContents());
            this.Page.removeChild(previousBlock);
            let length = this.Core_MergeIdenticalTree_Previous(this.RangeTree_Start);
            let tempTextNode = this.GetLastNode(this.RangeTree_Start);

            if (tempTextNode.nodeType === Node.TEXT_NODE) {
                range.setStart(tempTextNode, length);
                range.setEnd(tempTextNode, length);
            }
            else { //This was a BR Tag, set caret to parent node and offset to position of child index to place caret on BR tags. Technically always 0, but this handles multiple BR Tags in a tree
                range.setStart(tempTextNode.parentNode, tempTextNode.parentNode.childNodes.length - 1);
                range.setEnd(tempTextNode.parentNode, tempTextNode.parentNode.childNodes.length - 1);
            }
        }
        else {
            let previousLast = this.GetLastNode(previousBlock);

            if (previousLast.tagName === ConstBR) {
                range.setStart(previousLast.parentNode, previousLast.parentNode.childNodes.length - 1);
                range.setEnd(previousLast.parentNode, previousLast.parentNode.childNodes.length - 1);
            }
            else {
                range.setStart(previousLast, previousLast.textContent.length);
                range.setEnd(previousLast, previousLast.textContent.length);
            }
            //Deletes
            if (this.StartBlock.textContent.length === 0) {
                this.Page.removeChild(this.StartBlock);
            }
        }

        return range;
    }

    //Merges Next Block if its the same type or sets the caret to the start of the next block
    Delete_BlockBehavior(nextBlock) { //Delete_BlockBehavior
        let rangeclone = document.createRange();
        if (nextBlock.tagName === this.StartBlock.tagName) {
            rangeclone.selectNodeContents(nextBlock);
            let fragment = rangeclone.extractContents();
            this.StartBlock.append(fragment);
            this.Page.removeChild(nextBlock);
            let length = this.RangeTree_Start.textContent.length;
            this.Core_MergeIdenticalTrees(this.RangeTree_Start);
            let savenode = this.GetLastNode(this.RangeTree_Start);

            if (savenode.nodeType === Node.TEXT_NODE) {
                rangeclone.setStart(savenode, length);
                rangeclone.setEnd(savenode, length);
            }
            else {
                rangeclone.setStart(savenode.parentNode, 0);
                rangeclone.setEnd(savenode.parentNode, 0);
            }
        }
        else {
            if (nextBlock.textContent.length === 0 && nextBlock.childNodes.length <= 1) {
                this.Page.removeChild(nextBlock);
            }
            else {
                let nextFirst = this.GetFirstNode(nextBlock);

                if (nextFirst.tagName === ConstBR) {
                    rangeclone.setStart(nextFirst.parentNode, nextFirst.parentNode.childNodes.length - 1);
                    rangeclone.setEnd(nextFirst.parentNode, nextFirst.parentNode.childNodes.length - 1);
                }
                else {
                    rangeclone.setStart(nextFirst, 0);
                    rangeclone.setEnd(nextFirst, 0);
                }
            }
        }
        return rangeclone;
    }
	
	//Deletes the selected Range and returns 
    Selection_Delete() {
        let resultRange = document.getSelection().getRangeAt(0);

		//Range Delete Solution Divides Blocks, deletes every block between the new outer blocks
        let outerend = this.EndBlock.nextSibling;
        if (this.atContainerEnd(this.EndBlock, resultRange) === false) {
			//Extra Check to prevent division of container with 2 or less BR tags, subsequent traversal code will clean up EndBlock
			if(this.EndBlock.textContent.length !== 0 && this.EndBlock.childNodes.length <= 2){
				this.Core_DivideContainer_New_End(this.EndBlock, this.EndBlock.tagName);
				outerend = this.EndBlock.nextSibling;
			}
        }

        if (this.atContainerStart(this.StartBlock, resultRange) === false) {
            this.Core_DivideContainer_New_Front(this.StartBlock, this.StartBlock.tagName);
        }
        else {
            if (this.StartBlock.previousSibling === null) {
                let block = this.CreateNewBlock();
                this.StartBlock.insertAdjacentElement('beforebegin', block);
            }
        }
        let outerstart = this.StartBlock.previousSibling;

        //Delete The Sandwiched Blocks
        let iter = this.StartBlock;
        while (iter !== this.EndBlock) {
            let temp = iter;
            iter = iter.nextSibling;
            temp.parentNode.removeChild(temp);
        }
        this.EndBlock.remove();
		
		//Merge and/or Set the Range
        let lastTree = this.GetLastTreeNode(outerstart);
        if (outerend !== null) {
            let firstTree = this.GetFirstTreeNode(outerend);
			
            if (outerstart.tagName === outerend.tagName) { //Merge Blocks if same
                resultRange.selectNodeContents(outerend);
                outerstart.append(resultRange.extractContents());
                this.Page.removeChild(outerend);
				
                let length = this.Core_MergeIdenticalTree_Previous(firstTree);
				
                let newend = this.GetTreeNode(firstTree);
                if (newend.nodeType === Node.TEXT_NODE) {
                    resultRange.setStart(newend, length);
                    resultRange.setEnd(newend, length);
                }
                else {
                    resultRange.setStart(newend.parentNode, newend.parentNode.childNodes.length - 1);
                    resultRange.setEnd(newend.parentNode, newend.parentNode.childNodes.length - 1);
                }
            }
            else {
                let newfront = this.GetTreeNode(lastTree);
                if (newfront.nodeType === Node.TEXT_NODE) {
                    resultRange.setStart(newfront, newfront.textContent.length);
                }
                else {
                    resultRange.setStart(newfront.parentNode, newfront.parentNode.childNodes.length - 1);
                }
                let newend = this.GetTreeNode(firstTree);
                if (newend.nodeType === Node.TEXT_NODE) {
                    resultRange.setEnd(newend, 0);
                }
                else {
                    resultRange.setEnd(newend.parentNode, newend.parentNode.childNodes.length - 1);
                }
            }
        }
        else {
            let node = this.GetTreeNode(lastTree);
            if (node.nodeType === Node.TEXT_NODE) {
                resultRange.setStart(node, node.textContent.length);
                resultRange.setEnd(node, node.textContent.length);
            }
            else {
                resultRange.setStart(node.parentNode, node.parentNode.childNodes.length - 1);
                resultRange.setEnd(node.parentNode, node.parentNode.childNodes.length - 1);
            }
        }
        return resultRange;
    }

    CreateNewBlock() {
        const element = document.createElement(ConstBlock);
        element.appendChild(this.CreateNewTextTree());
        return element;
    }

    CreateNewTextTree() {
        const texttree = document.createElement(ConstTree);
        const br = document.createElement(ConstBR);
        texttree.appendChild(br);
        return texttree;
    }
    CreateNewListItem() {
        const element = document.createElement('li');
        element.appendChild(this.CreateNewTextTree());
        return element;
    }

    isWhiteSpace(node) {
        return !/[^\t\n\r ]/.test(node.textContent);
    }

    isEmptyTag(node) {
        let isEmpty = false;

        if (node.textContent === "") {
            isEmpty = true;
        }
        else {
            node = this.GetTreeNode(node);
            if (node.nodeType !== Node.TEXT_NODE) {
                if (node.tagName !== ConstBR) {
                    isEmpty = true;
                }
            }
        }
        return isEmpty;
    }

    GetNextBlock(BlockNode) {
        BlockNode = BlockNode.nextSibling;
        return BlockNode;
    }

    GetPreviousBlock(BlockNode) {
        BlockNode = BlockNode.previousSibling;
        return BlockNode;
    }


    Core_MergeIdenticalTrees(treeNode) {
        let length = 0;
        if (treeNode.nextSibling !== null) {
            if (treeNode.nextSibling.textContent.length !== 0) {
                if (this.Core_hasIdentical_Tags(treeNode, treeNode.nextSibling) === true &&
					this.Core_hasIdenticalStyle(treeNode, treeNode.nextSibling) === true) {
                    this.GetTreeNode(treeNode).textContent += treeNode.nextSibling.textContent;
                    treeNode.nextSibling.remove();
                }
            }
        }
        length = this.Core_MergeIdenticalTree_Previous(treeNode);
        return length;
    }


    Core_MergeIdenticalTree_Previous(treeNode) {
        //let length = treeNode.textContent.length;

        let length = 0;
        if (treeNode.previousSibling !== null) {
            if (treeNode.previousSibling.textContent.length !== 0) {
                if (this.Core_hasIdentical_Tags(treeNode, treeNode.previousSibling) === true &&
					this.Core_hasIdenticalStyle(treeNode, treeNode.previousSibling) === true){
                    
					//This stops some kind of edge that was causing an issue setting the range
                    if (treeNode.previousSibling === this.RangeTree_Start) {
                        this.RangeTree_Start = treeNode;
                    }
                    let textNode = this.GetTreeNode(treeNode);
                    length = treeNode.previousSibling.textContent.length;

                    textNode.textContent = treeNode.previousSibling.textContent + textNode.textContent;
                    treeNode.previousSibling.remove();
                    treeNode = null;
                }
            }
        }
        return length;
    }
	
    Core_hasIdentical_Tags(anchorTreeNode, siblingTreeNode) {
        let isEqual = true;

        let left = anchorTreeNode;
        let right = siblingTreeNode;
        while (right.nodeType === Node.ELEMENT_NODE && isEqual) {
            if (this.Core_SearchTreeForTag(left, right)) {
                right = right.firstChild;
            }
            else {
                isEqual = false;
            }
        }

        left = anchorTreeNode;
        right = siblingTreeNode;
        while (left.nodeType === Node.ELEMENT_NODE && isEqual) {
            if (this.Core_SearchTreeForTag(right, left)) {
                left = left.firstChild;
            }
            else {
                isEqual = false;
            }
        }

        return isEqual;
    }

    Core_SearchTreeForTag(containerNode, style) {
        let test = false;
        while (containerNode.firstChild !== null) {
            if (containerNode.tagName === style.tagName) {
                test = true;
            }
            containerNode = containerNode.firstChild;
        }
        return test;
    }
	
	Core_hasIdenticalStyle(treenode, siblingtree) {
		let samestyles = true;
		if(treenode.style.color != siblingtree.style.color)
			samestyles = false;
		if(treenode.style.fontFamily != siblingtree.style.fontFamily)
			samestyles = false;
		if(treenode.style.backgroundColor != siblingtree.style.backgroundColor)
			samestyles = false;
		if(treenode.style.fontSize != siblingtree.style.fontSize)
			samestyles = false;
		
		return samestyles;
	}
	

    atContainerStart(container, range) {
        let atStart = false;
        let startNode = this.GetFirstNode(container);
        if (range.startOffset === 0) {
            if (startNode === range.startContainer) {
                atStart = true;
            }
            if (startNode.tagName === ConstBR) {
                if (startNode === range.startContainer.firstChild) {
                    atStart = true;
                }
            }
        }

        return atStart;
    }

    atContainerEnd(container, range) {
        let atEnd = false;
        let endNode = this.GetLastNode(container);

        if (endNode === range.endContainer && range.endOffset === endNode.textContent.length) {
            atEnd = true;
        }
        if (endNode.tagName === ConstBR) {
            if (endNode === range.endContainer.lastChild) {
                atEnd = true;
            }
        }
        return atEnd;
    }

    //TODO: Clean Up these GetNode Functions
    GetTreeNode(containerNode) {

        while (containerNode.firstChild !== null) {
            containerNode = containerNode.firstChild;
        }
        return containerNode;
    }

    GetFirstTreeNode(BlockContainer) {
        while (BlockContainer.tagName !== ConstTree) { //Change null checked BlockContainer
            BlockContainer = BlockContainer.firstChild;
        }
        return BlockContainer;
    }

    GetLastTreeNode(BlockContainer) {
        while (BlockContainer.tagName !== ConstTree) {
            BlockContainer = BlockContainer.lastChild;
        }
        return BlockContainer;
    }

    GetFirstNode(containerToSearch) {
        let result = null
        while (result === null) {

            if (containerToSearch.tagName === ConstBR) {
                result = containerToSearch;
            }
            else {
                if (containerToSearch.nodeType === Node.TEXT_NODE) {
                    result = containerToSearch;
                }
                else {
                    containerToSearch = containerToSearch.firstChild;
                }
            }

        }
        return result;
    }

    GetLastNode(containerToSearch) {
        let result = null;
        while (result === null) {
            if (containerToSearch.tagName === ConstBR) {
                result = containerToSearch;
            }
            else {
                if (containerToSearch.nodeType === Node.TEXT_NODE) {
                    result = containerToSearch;
                }
                else {
                    containerToSearch = containerToSearch.lastChild;
                }
            }
        }

        return result;
    }

    ToggleBlockTag(blocktag) {

        let element = document.createElement(blocktag);
        let item = this.CreateNewListItem();
        element.appendChild(item);
        this.StartBlock.insertAdjacentElement('afterend', element);
        let range = document.createRange();
        range.setStart(item.firstChild, 0);
        range.setEnd(item.firstChild, 0);
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(range);

    }

    Core_DivideContainer_New_End(container, TagString) {
        let range = document.getSelection().getRangeAt(0);
        let deepclone = new CloneWithRange(container, range);
        let backhalf = deepclone.GetEnd_nonInclusive(TagString);
        container.insertAdjacentElement('afterend', backhalf);

        let tempRange = document.createRange();
        tempRange.selectNodeContents(container);
        tempRange.setStart(range.endContainer, range.endOffset);
        tempRange.deleteContents();
        tempRange.detach();
        //Potential Edge Case for Empty Tags Caused by deleteContents Function	
		if(this.isEmptyTag(container.lastChild)){
			container.removeChild(container.lastChild);			
		}
		//copy Styles - won't worry if its been kicked out of the dom tree
		return backhalf;
    }

    Core_DivideContainer_New_Front(container, TagString) {
        let range = document.getSelection().getRangeAt(0);
        let deepclone = new CloneWithRange(container, range);
        let fronthalf = deepclone.GetFront_nonInclusive(TagString);
        container.insertAdjacentElement('beforebegin', fronthalf);

        let temprange = document.createRange();
        temprange.selectNodeContents(container);
        temprange.setEnd(range.startContainer, range.startOffset);
        temprange.deleteContents();

        if (this.isEmptyTag(container.firstChild)) {
            container.firstChild.remove();
        }
		//Copy Styles
		return fronthalf;
    }
	
    Core_ImplementTag_Tree(container, tag, behavior) {
        if (container.textContent.length !== 0) {
            let styledelement = container.querySelector(tag);
            if (styledelement === null && (behavior === Behavior.Add || behavior === Behavior.Toggle)) {
                let rangeclone = document.createRange();
                rangeclone.selectNodeContents(container);
                let style = document.createElement(tag);
                style.append(rangeclone.extractContents());
                container.append(style);
                rangeclone.detach();
            }

            if (styledelement !== null && (behavior === Behavior.Remove || behavior === Behavior.Toggle)) {
                styledelement.parentNode.replaceChild(styledelement.firstChild, styledelement);
                //let inner = styledelement.innerHTML;                
                //styledelement.insertAdjacentHTML('afterend', inner);
                //styledelement.remove();
            }
        }
    }

    Core_Set_Range_Selection(startoffset, endoffset) {
        let selectionRange = document.createRange();
        let start = this.GetTreeNode(this.RangeTree_Start);
        if (start.nodeType === Node.TEXT_NODE) {
            selectionRange.setStart(start, startoffset);
        }
        else {
            selectionRange.setStart(start.parentNode, 0);
        }

        let end = this.GetTreeNode(this.RangeTree_End);
        if (end.nodeType === Node.TEXT_NODE) {
            selectionRange.setEnd(end, endoffset);
        }
        else {
            selectionRange.setEnd(end.parentNode, endoffset);
        }
        return selectionRange;
    }

    Block_is_Standard_Structure(container) {
        return StandardStructureTags.includes(container.tagName);
    }
    Block_is_List_Structure(blockLevel_Container) {
        let isListBlock = false;
        if (blockLevel_Container.tagName === ConstOList || blockLevel_Container.tagName === ConstUList) {
            isListBlock = true;
        }
        return isListBlock;
    }

    Block_Traversal_Find_First_Tree_In_NextBlock(block, lastTree) {
        let iter = { block, tree: null };

        if (this.Block_is_Standard_Structure(iter.block)) {
            iter = this.Block_Standard_Traversal_SubRoutine(iter.block);
        }
        else {
            if (this.Block_is_List_Structure(iter.block)) {
                iter = this.Block_List_Traversal_SubRoutine(iter.block, lastTree.parentNode);
            }
        }

        return iter;
    }

    Core_DetermineStyleBehavior(tag) {
        let behavior = Behavior.Add;

        let treecount = 0;
        let stylecount = 0;

        //count the Tail Node - Can be infront to bypass counter
        treecount++;
        if (this.RangeTree_End.querySelector(tag) !== null) {
            stylecount++;
        }

        let iter = { block: this.StartBlock, tree: this.RangeTree_Start };
        let lastiter = this.RangeTree_Start;
        //Only remove if the counts are equal - Break out as soon as a tag is not found in a tree
        while (iter.tree !== this.RangeTree_End && treecount === stylecount) {
            if (iter.tree === null) {//Increment the tempiter
                iter = this.Block_Traversal_Find_First_Tree_In_NextBlock(iter.block, lastiter);
            }
            else {
                // Checking length will ignore trees with BR tags, but will unsync the count logic to determine the behavior
                if (iter.tree.textContent.length !== 0) {
                    treecount++;
                    if (iter.tree.querySelector(tag) !== null) {
                        stylecount++;
                    }
                }
                lastiter = iter.tree;
                iter.tree = iter.tree.nextSibling;
            }
        }


        if (treecount === stylecount) {
            behavior = Behavior.Remove;
        }
        return behavior
    }


    //Lazy Selector Modifies the selection to the exact size of the word if caret is in the middle of a word
    //If Caret is outside of the word, it will do nothing.
    Selection_LazySelector_Word() {
        // Lazy Select Toggle - Create a class boolean to enable user to toggle this feature on and off.
		if(true){
			let selection = document.getSelection();
			let originalrange = selection.getRangeAt(0).cloneRange();

			let offset = originalrange.startOffset;

			selection.modify('move', 'forward', 'word');
			selection.modify('extend', 'backward', 'word');
			let newrange = selection.getRangeAt(0);
			let wordlength = selection.toString().trim().length;
			let wordStart = this.FindTargetStartTree(newrange.startContainer);

			offset -= newrange.startOffset;
			let counter = 0;
			while (this.RangeTree_Start !== wordStart) {
            counter += wordStart.textContent.length;
            wordStart = wordStart.nextSibling;
			}
			offset += counter;


			if (offset <= 0 || offset >= wordlength) {
				selection.setPosition(originalrange.startContainer, originalrange.startOffset);
			}
			else {
				let tree = this.FindTargetStartTree(newrange.startContainer);
				let counter = -newrange.startOffset;
				while (counter < wordlength) {
					if (counter + tree.textContent.length < wordlength) {
						counter += tree.textContent.length;
						tree = tree.nextSibling;
					}
					else {
                    offset = wordlength - counter;
                    counter = wordlength;
					}
				}
				selection.setBaseAndExtent(newrange.startContainer, newrange.startOffset, this.GetTreeNode(tree), offset);
			}
			originalrange.detach();
			newrange.detach();
			
			this.RebuildTargetSelections();
		}
       
    }

    ChangeBlockType(blocktag) {
        if (this.Block_is_Standard_Structure(this.StartBlock) === true) {
            if (this.StartBlock.tagName !== blocktag) {
                let range = document.createRange();
                range.selectNodeContents(this.StartBlock);
                let newBlock = document.createElement(blocktag);
                newBlock.appendChild(range.extractContents());
                this.Page.replaceChild(newBlock, this.StartBlock);
                range.detach();

                let node = this.GetTreeNode(newBlock);
                if (node.nodeType === Node.TEXT_NODE) {                   
                    document.getSelection().setPosition(node, 0);
                }
                else {
                    document.getSelection().setPosition(node.parentNode, 0);
                }
             
            }
        }

    }

    ToggleBlockFormat(classname) {
		let range = document.getSelection().getRangeAt(0).cloneRange();
        if (this.Block_is_Standard_Structure(this.StartBlock) === true) {          
            if (classname === ClassIndent || classname === ClassOutdent) {              
                if (classname === ClassIndent) {
                    this.StartBlock.classList.add(ClassIndent);
                }
                else {
                    this.StartBlock.classList.remove(ClassIndent);
                }
            }
            else {
                BlockClasses.forEach((value) => {
                    if (this.StartBlock.classList.contains(value)) {
                        this.StartBlock.classList.remove(value);
                    }
                });
                this.StartBlock.classList.add(classname);
            }           
        }
		//setBaseAndExtent function is unable to unselect a html selector
		document.getSelection().removeAllRanges();
        document.getSelection().addRange(range);

    }
	
	CopyContainerStyles(anchorTree, newTree){
		if(newTree.textContent.length !== 0){
			newTree.style.color = anchorTree.style.color;
			newTree.style.fontFamily = anchorTree.style.fontFamily;
			newTree.style.backgroundColor = anchorTree.style.backgroundColor;			
			newTree.style.fontSize = anchorTree.style.fontSize;
		}
	}
	
	ApplyNewStyle(targetContainer, style, styleType){
		if(styleType == StyleType.Color)
			targetContainer.style.color = style;
		else if(styleType == StyleType.FontFamily) 
			targetContainer.style.fontFamily = style;		
		else if(styleType == StyleType.BackgroundColor)
			targetContainer.style.backgroundColor = style;
		else if(styleType == StyleType.FontSize)
			targetContainer.style.fontSize = style;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	ToggleTreeStyle(style, styleType){

		let selection = document.getSelection();
        if (selection.type === 'Caret') {
            this.Selection_LazySelector_Word();
        }
		let range = selection.getRangeAt(0);

		if (selection.type === 'Range') {
            if (this.RangeTree_Start === this.RangeTree_End) {

                if (selection.toString().trim().length !== this.RangeTree_Start.textContent.trim().length) {
                    if (this.atContainerStart(this.RangeTree_Start, range) === true) {
                        let end = this.Core_DivideContainer_New_End(this.RangeTree_Start, ConstTree);
						this.CopyContainerStyles(this.RangeTree_Start, end);
                    }
                    else {
                        if (this.atContainerEnd(this.RangeTree_End, range) === false) {
                            let end = this.Core_DivideContainer_New_End(this.RangeTree_Start, ConstTree);
							this.CopyContainerStyles(this.RangeTree_Start, end);
                        }
                        let front = this.Core_DivideContainer_New_Front(this.RangeTree_Start, ConstTree);
						this.CopyContainerStyles(this.RangeTree_Start, front);					
                    }
                }
                let caretPosition = this.RangeTree_Start.textContent.length;
                let offset = 0;
							
				this.ApplyNewStyle(this.RangeTree_Start, style, styleType);
                offset = this.Core_MergeIdenticalTrees(this.RangeTree_Start);
				selection.setPosition(this.GetTreeNode(this.RangeTree_End), caretPosition + offset);					
            }
            else {
                //Figure out if I'm adding or Removing Tags
                //let behavior = this.Core_DetermineStyleBehavior(StyleTag);
                let caretStartPosition = 0;
                let caretEndPosition = range.endOffset;

                if (range.startOffset !== 0) {
                    //Function 1
                    let front = this.Core_DivideContainer_New_Front(this.RangeTree_Start, ConstTree);
                    this.CopyContainerStyles(this.RangeTree_Start, front);
					//this.ApplyNewStyle(this.RangeTree_Start, style, styleType);
                }
                //else { //Handle the RangeTree_Start to calculate the caretStartPosition
					this.ApplyNewStyle(this.RangeTree_Start, style, styleType);
                    caretStartPosition = this.Core_MergeIdenticalTree_Previous(this.RangeTree_Start);
                //}

                //Possible Selection Patterns for Middle Nodes
                //1. Entire Tree iter is Selected
                let iter = { block: this.StartBlock, tree: this.RangeTree_Start.nextSibling };
                let tempiter = this.RangeTree_Start;
                while (iter.tree !== this.RangeTree_End) {
                    if (iter.tree === null) {
                        iter = this.Block_Traversal_Find_First_Tree_In_NextBlock(iter.block, tempiter);
                    }
                    else {
                        this.ApplyNewStyle(iter.tree, style, styleType);
                        this.Core_MergeIdenticalTree_Previous(iter.tree);
                        tempiter = iter.tree;
                        iter.tree = iter.tree.nextSibling;
                    }
                }

                //Possible Selection Patterns for 
                //1. Entire End Tree is Selected - divide not necessary
                //2. Front Half of End Tree is Selected - Do division
                if (this.atContainerEnd(this.RangeTree_End, range) === false) {
                    let end = this.Core_DivideContainer_New_End(this.RangeTree_End, ConstTree);
					this.CopyContainerStyles(this.RangeTree_End, end);
                }
                this.ApplyNewStyle(this.RangeTree_End, style, styleType);
                caretEndPosition += this.Core_MergeIdenticalTrees(this.RangeTree_End);

                //Set the Range
                let selectionRange = this.Core_Set_Range_Selection(caretStartPosition, caretEndPosition);
                selection.removeAllRanges();
                selection.addRange(selectionRange);
            }

        }
		
		
		
	}
	
    //Applies a Style to the selected text
    //If a button is clicked, it changes the focus and selection.
    //Function needs to capture the text node and the offset to put the caret back on the text node.
    ToggleTreeTag(StyleTag) {
		let selection = document.getSelection();
        if (selection.type === 'Caret') {
            this.Selection_LazySelector_Word();
        }
		let range = selection.getRangeAt(0);
        //Solution
        //1. Divide Containers from selection to maintain 1 text node per a tree container
        //2. Preserve target container during divide
        //3. Apply Style to the preserved tree container
        //4. Merge Identical sibling Trees
        if (selection.type === 'Range') {
            if (this.RangeTree_Start === this.RangeTree_End) {
                //Possible Selection Patterns
                //1. Entire Tree is Selected - no need to divide the tree
                //2. Front Half of Tree is Selected
                //3. Middle of Tree selected - break off the front and optionally the end into new trees
                if (selection.toString().trim().length !== this.RangeTree_Start.textContent.trim().length) {
                    //Function 1
                    if (this.atContainerStart(this.RangeTree_Start, range) === true) {
                        let end = this.Core_DivideContainer_New_End(this.RangeTree_Start, ConstTree);
						this.CopyContainerStyles(this.RangeTree_Start, end);
                    }
                    else {

                        if (this.atContainerEnd(this.RangeTree_End, range) === false) {
                            let end = this.Core_DivideContainer_New_End(this.RangeTree_Start, ConstTree);
							this.CopyContainerStyles(this.RangeTree_Start, end);
                        }
                        let start = this.Core_DivideContainer_New_Front(this.RangeTree_Start, ConstTree);
						this.CopyContainerStyles(this.RangeTree_Start, start);
                    }
                }
                let caretPosition = this.RangeTree_Start.textContent.length;
                let offset = 0;
                // All Trees Are full Selection After Divide
                this.Core_ImplementTag_Tree(this.RangeTree_Start, StyleTag, Behavior.Toggle);
                offset = this.Core_MergeIdenticalTrees(this.RangeTree_Start);
				selection.setBaseAndExtent(this.GetTreeNode(this.RangeTree_Start), offset, this.GetTreeNode(this.RangeTree_End), caretPosition + offset);			
				
            }
            else {
                //Figure out if I'm adding or Removing Tags
                let behavior = this.Core_DetermineStyleBehavior(StyleTag);
                let caretStartPosition = 0;
                let caretEndPosition = range.endOffset;

                //List Traversal occurs in a forward direction
                //Only Merge Previous identical trees to preserve the forward structure
                //Possible Selection Patterns for Start Nodes
                //1. Entire Start Tree is Selected
                //2. Back Half of Start Tree is Selected
                if (range.startOffset !== 0) {
                    let front = this.Core_DivideContainer_New_Front(this.RangeTree_Start, ConstTree);
					this.CopyContainerStyles(this.RangeTree_Start, front);
                    //this.Core_ImplementTag_Tree(this.RangeTree_Start, StyleTag, behavior);
					
                }
                //else { //Handle the RangeTree_Start to calculate the caretStartPosition
                    this.Core_ImplementTag_Tree(this.RangeTree_Start, StyleTag, behavior);
                    caretStartPosition = this.Core_MergeIdenticalTree_Previous(this.RangeTree_Start);
                //}
				
                //Possible Selection Patterns for Middle Nodes
                //1. Entire Tree iter is Selected
                let iter = { block: this.StartBlock, tree: this.RangeTree_Start.nextSibling };
                let tempiter = this.RangeTree_Start;
                while (iter.tree !== this.RangeTree_End) {
                    if (iter.tree === null) {
                        iter = this.Block_Traversal_Find_First_Tree_In_NextBlock(iter.block, tempiter);
                    }
                    else {
                        this.Core_ImplementTag_Tree(iter.tree, StyleTag, behavior);
                        this.Core_MergeIdenticalTree_Previous(iter.tree);
                        tempiter = iter.tree;
                        iter.tree = iter.tree.nextSibling;
                    }
                }

                //Possible Selection Patterns for 
                //1. Entire End Tree is Selected - divide not necessary
                //2. Front Half of End Tree is Selected - Do division
                if (this.atContainerEnd(this.RangeTree_End, range) === false) {
                    let end = this.Core_DivideContainer_New_End(this.RangeTree_End, ConstTree);
					this.CopyContainerStyles(this.RangeTree_Start, end);
                }
                this.Core_ImplementTag_Tree(this.RangeTree_End, StyleTag, behavior);
                caretEndPosition += this.Core_MergeIdenticalTrees(this.RangeTree_End);

                //Set the Range
                let selectionRange = this.Core_Set_Range_Selection(caretStartPosition, caretEndPosition);
                selection.removeAllRanges();
                selection.addRange(selectionRange);
            }

        }
    }

    Target_FindBlock(node) {
        while (node.parentNode !== this.Page) {
            node = node.parentNode;
        }
        return node;
    }

    //Takes in a the Range's startContainer and traverses to the Tree Node
    //If the input is not a text node, it is the parent container of a br tag
    FindTargetStartTree(TextNode) {

        if (TextNode.nodeType === Node.TEXT_NODE) {
            while (TextNode.tagName !== ConstTree) {
                TextNode = TextNode.parentNode;
            }
        }
        else if (TextNode.tagName !== ConstTree) {
            if (TextNode.tagName === ConstBR) {
                TextNode = TextNode.parentNode;
            }
            if (TextNode.tagName !== ConstTree) {
                if (TextNode.firstChild.tagName !== ConstTree) {
                    console.log('Find Target Start Tree: Normalizing Block');
                    TextNode = this.NormalizeBlock(TextNode);
                    document.getSelection().getRangeAt(0).setStart(TextNode, 0);
                }
                else {
                    TextNode = TextNode.firstChild;
                }

            }
        }

        return TextNode;
    }
    //Browsers treat the end differently from the start, the selecting a target has an extra edge case
    FindTargetEndTree(TextNode) {
        if (TextNode.nodeType === Node.TEXT_NODE) {
            while (TextNode.tagName !== ConstTree) {
                TextNode = TextNode.parentNode;
            }
        }
        else if (TextNode.tagName !== ConstTree) {

            if (TextNode.tagName === ConstBR) {
                TextNode = TextNode.parentNode;
            }
            if (TextNode.tagName !== ConstTree) {
                if (TextNode.firstChild.tagName !== ConstTree) {
                    console.log('Find Target End Tree: Normalizing Block');
                    this.NormalizeBlock(TextNode);
                    document.getSelection().getRangeAt(0).setStart(TextNode, 0);
                }
                else {
                    TextNode = TextNode.firstChild;
                }
            }
        }
        return TextNode;
    }

    NormalizeBlock(BlockNode) {

        let element = document.createElement(ConstTree);
        element.appendChild(document.createElement(ConstBR));
        BlockNode.removeChild(BlockNode.firstChild);
        BlockNode.appendChild(element);
        BlockNode = element;
        return element;
    }

    RepairTargetTree() { //Prototype Code - Default Browser Behaviors can mishandle the tree structure
        //Normalize the RangeTree, If a tree has more than 2 children, adding a character wasn't added in a new tree
        let range = document.getSelection().getRangeAt(0);
        if (this.RangeTree_Start !== null) {
            if (this.RangeTree_Start.childNodes.length >= 2) {
                if (this.RangeTree_Start.lastChild.tagName === ConstBR) {
                    let tree = this.CreateNewTextTree();
                    this.RangeTree_Start.insertAdjacentElement('afterend', tree);
                    this.RangeTree_Start.removeChild(this.RangeTree_Start.lastChild);
                }
                else {
                    console.log('Repair Target Tree: Normalizing Block');
                    let clone = this.RangeTree_Start.lastChild.cloneNode(true);
                    this.RangeTree_Start.lastChild.remove();
                    let element = document.createElement(ConstTree);
                    element.appendChild(clone);
                    this.RangeTree_Start.insertAdjacentElement('afterend', element);
                    range.setStart(this.GetTreeNode(element), element.textContent.length);
                    range.setEnd(range.startContainer, range.startOffset);
                }
            }
        }

        return range;
    }

    RebuildTargetSelections() {
        this.UpdateTargets();
        this.ToggleInterfaceButtons();
        this.AddTargetHighLights();
    };

    UpdateTargets() {
        let range = this.RepairTargetTree();
        //console.log(`${range.startOffset}, ${range.endOffset}`);

        this.StartBlock = this.Target_FindBlock(range.startContainer);
        this.EndBlock = this.Target_FindBlock(range.endContainer);

        this.RangeTree_Start = this.FindTargetStartTree(range.startContainer);
        if (range.startContainer === range.endContainer) {
            this.RangeTree_End = this.RangeTree_Start;
        }
        else {
            this.RangeTree_End = this.FindTargetEndTree(range.endContainer);
        }
		
		
        this.XTargetStart = this.RangeTree_Start;
        this.XTargetEnd = this.RangeTree_End;
    }

    ToggleInterfaceButtons() {
		if(this.StandardBlockSelector !== null)
			this.StandardBlockSelector.value = this.StartBlock.tagName;
		if(document.getSelection().type === 'Caret'){
			if(this.FontFamilySelector !== null)
				this.FontFamilySelector.value = this.RangeTree_Start.style.fontFamily;
			if(this.ColorSelector !== null)
				this.ColorSelector.value = this.RangeTree_Start.style.color;
			if(this.BackgroundColorSelector !== null)
				this.BackgroundColorSelector.value = this.RangeTree_Start.style.backgroundColor;
			if(this.FontSizeSelector !== null)
				this.FontSizeSelector.value = this.RangeTree_Start.style.fontSize;
		}
		else{
			if(this.FontFamilySelector !== null)
				this.FontFamilySelector.value = "none";
			if(this.ColorSelector !== null)
				this.ColorSelector.value = "none";
			if(this.BackgroundColorSelector !== null)
				this.BackgroundColorSelector.value = "none";
			if(this.FontSizeSelector !== null)
				this.FontSizeSelector.value = "none";
		}

    }

    // CHanges the background Color of selected styles
    AddTargetHighLights() {
        if (this.StartBlock === this.EndBlock) {
            this.PlayHighLightAnimation_1(this.StartBlock);
        }
        else {
            let iter = this.StartBlock;
            do {
                this.PlayHighLightAnimation_1(iter);
                iter = iter.nextSibling;
                //iter.classList.add('c-menu');
            }
            while (iter !== this.EndBlock);
        }

        //Todo: highLight inner attributes
        this.XTargetStart.classList.add('text-bg');
        this.XTargetEnd.classList.add('text-bg');

        this.PlayHighLightAnimation_2(this.RangeTree_Start);
        this.PlayHighLightAnimation_2(this.RangeTree_End);
    }

    PlayHighLightAnimation_1(node) {
        if (node.nodeType !== Node.TEXT_NODE) {
            node.classList.add('text-highlight-1');
            setTimeout(() => {
                node.classList.remove('text-highlight-1');
            }, 1500);
        }
    }

    PlayHighLightAnimation_2(node) {
        if (node.nodeType !== Node.TEXT_NODE) {
            node.classList.add('text-highlight-2');
            setTimeout(() => {
                node.classList.remove('text-highlight-2');
            }, 1500);
        }
    }

    ClearTargetSelections() {
        //Error: Cannon Read classList of TextNodes
        if (this.XTargetStart !== null) {
            this.XTargetStart.classList.remove('text-bg');
        }
        if (this.XTargetEnd !== null) {
            this.XTargetEnd.classList.remove('text-bg');
        }

    };

    Block_Standard_Behavior_ShiftEnterKey() {
        let rangeclone = document.getSelection().getRangeAt(0).cloneRange();

        if (this.atContainerEnd(this.RangeTree_End, rangeclone)) {
            
            if (this.GetTreeNode(this.RangeTree_End).nodeType === Node.TEXT_NODE) {
                if (this.RangeTree_Start.nextSibling === null) {
                    
                    let firstTree = this.CreateNewTextTree();
                    this.RangeTree_Start.insertAdjacentElement('afterend', firstTree);
                    this.RangeTree_Start = firstTree;
                }
                else {
                    this.RangeTree_Start = this.RangeTree_Start.nextSibling;
                }
            }
            
            let newTree = this.CreateNewTextTree();
            this.RangeTree_Start.insertAdjacentElement('afterend', newTree);
            rangeclone.setStart(newTree, 0);
            rangeclone.setEnd(newTree, 0);
        }
        else {
            
            if (this.atContainerStart(this.RangeTree_Start, rangeclone)) {
                
                let newtree = this.CreateNewTextTree();
                this.RangeTree_Start.insertAdjacentElement('beforebegin', newtree);
                rangeclone.setStart(newtree, 0);
                rangeclone.setEnd(newtree, 0);
            }
            else {
                
                this.Core_DivideContainer_New_Front(this.RangeTree_Start, ConstTree);
                this.RangeTree_Start.insertAdjacentElement('beforebegin', this.CreateNewTextTree());
                let text = this.GetTreeNode(this.RangeTree_Start);
                rangeclone.setStart(text, 0);
                rangeclone.setEnd(text, 0);
            }
        }
        return rangeclone;
    }

    Block_Standard_Behavior_EnterKey() {
        let rangeclone = document.getSelection().getRangeAt(0).cloneRange();
        let newparagraph = null;
        if (this.atContainerEnd(this.EndBlock, rangeclone)) {
            newparagraph = this.CreateNewBlock();
            this.StartBlock.insertAdjacentElement('afterend', newparagraph);
            newparagraph = newparagraph.firstChild;
        }
        else if (this.atContainerStart(this.StartBlock, rangeclone)) {
            newparagraph = this.CreateNewBlock();
            this.EndBlock.insertAdjacentElement('beforebegin', newparagraph);
            newparagraph = newparagraph.firstChild;
        }
        else {
            this.Core_DivideContainer_New_Front(this.StartBlock, this.StartBlock.tagName);
            newparagraph = this.GetTreeNode(this.StartBlock);
        }
        rangeclone.setStart(newparagraph, 0);
        rangeclone.setEnd(newparagraph, 0);
        return rangeclone;
    }

    Block_Standard_Behavior_BackspaceKey(event) {
        let selection = document.getSelection();
        let rangeclone = selection.getRangeAt(0).cloneRange();

        if (this.atContainerStart(this.RangeTree_Start, rangeclone) === true || this.RangeTree_Start.textContent.length === 1) {

            if (this.atContainerStart(this.StartBlock, rangeclone) === true) {
                event.preventDefault();
                event.stopPropagation();
                let previousBlock = this.GetPreviousBlock(this.StartBlock);
                if (this.Block_is_Standard_Structure(this.StartBlock)) {
                    if (previousBlock !== null) {
                        rangeclone = this.BackSpace_BlockBehavior(previousBlock);
                        selection.removeAllRanges();
                        selection.addRange(rangeclone);
                    }
                }
            }
            else {
                let previousTree = this.RangeTree_Start.previousSibling;
                if (this.RangeTree_Start.textContent.length === 1) {
                    if (previousTree !== null) {
                        event.preventDefault();
                        event.stopPropagation();
                        let previous = this.GetTreeNode(previousTree);
                        if (previous.nodeType === Node.TEXT_NODE) {
                            this.RangeTree_Start.remove();
                            let length = previous.textContent.length;
                            this.Core_MergeIdenticalTrees(previousTree);
                            rangeclone.setStart(previous, length);
                            rangeclone.setEnd(previous, length);
                        }
                        else {

                            let newTree = this.CreateNewTextTree();
                            this.RangeTree_Start.insertAdjacentElement('beforebegin', newTree);
                            this.RangeTree_Start.remove();
                            rangeclone.setStart(newTree, 0);
                            rangeclone.setEnd(newTree, 0);
                        }
                        selection.removeAllRanges();
                        selection.addRange(rangeclone);
                    }
                    else {
                        if (this.StartBlock.previousSibling === null) {//!IMPORTANT Recreate the First Block in the Document
                            event.preventDefault();
                            event.stopPropagation();
                            let block = this.CreateNewBlock();
                            this.StartBlock.insertAdjacentElement('beforebegin', block);
                            this.Page.replaceChild(block, this.StartBlock);
                            rangeclone.setStart(block.firstChild, 0);
                            rangeclone.setEnd(block.firstChild, 0);
                            selection.removeAllRanges();
                            selection.addRange(rangeclone);
                        }
                    }

                }
                else if (this.GetTreeNode(previousTree).nodeType !== Node.TEXT_NODE) { //Remove BR Tree and Try to Merge
                    event.preventDefault();
                    event.stopPropagation();
                    previousTree.remove();
                    let length = this.Core_MergeIdenticalTree_Previous(this.RangeTree_Start);
                    rangeclone.setStart(this.GetTreeNode(this.RangeTree_Start), length);
                    rangeclone.setEnd(this.GetTreeNode(this.RangeTree_Start), length);
                    selection.removeAllRanges();
                    selection.addRange(rangeclone);
                }
            }
        }
        return rangeclone;
    }

    Block_Standard_Behavior_DeleteKey(event) {
        let selection = document.getSelection();
        let rangeclone = selection.getRangeAt(0).cloneRange();
        if (this.atContainerEnd(this.RangeTree_End, rangeclone)) {
            if (this.atContainerEnd(this.StartBlock, rangeclone)) {
                event.preventDefault();
                event.stopPropagation();
                let nextBlock = this.GetNextBlock(this.StartBlock);
                if (nextBlock !== null) {
                    rangeclone = this.Delete_BlockBehavior(nextBlock);
                    selection.removeAllRanges();
                    selection.addRange(rangeclone);
                }
            }
            else {
                let nextTree = this.RangeTree_End.nextSibling;               //TextContent Length 1 is testing for a single character, Stable?
                if (this.GetTreeNode(nextTree).nodeType !== Node.TEXT_NODE || nextTree.textContent.length === 1) {
                    event.preventDefault();
                    event.stopPropagation();
                    nextTree.remove();
                    let length = this.RangeTree_Start.textContent.length;
                    this.Core_MergeIdenticalTrees(this.RangeTree_Start);
                    rangeclone.setStart(this.GetTreeNode(this.RangeTree_Start), length);
                    rangeclone.setEnd(this.GetTreeNode(this.RangeTree_Start), length);
                    selection.removeAllRanges();
                    selection.addRange(rangeclone);
                }
            }
        }
        return rangeclone;
    }

    // Editor Text Traversal - Finds the Next Block and returns the new block and tree iters
    Block_Standard_Traversal_SubRoutine(block) {
        let tree = null;
        block = block.nextSibling;
        tree = block.firstChild;
        //Search depth for next blocks of different types.
        while (tree.tagName !== ConstTree) {
            tree = tree.firstChild;
        }
        return { block, tree };
    }

    Block_List_Behavior_ShiftEnterKey() {
        let rangeclone = document.createRange();
        let li = document.createElement('li');
        let span = document.createElement(ConstTree);
        let br = document.createElement('br');
        li.appendChild(span);
        span.appendChild(br);
        this.RangeTree_Start.parentNode.insertAdjacentElement('afterend', li);
        rangeclone.setStart(span, 0);
        rangeclone.setEnd(span, 0);
        return rangeclone;
    }

    Block_List_Behavior_EnterKey() {
        let rangeclone = document.getSelection().getRangeAt(0).cloneRange();

        let currentListItem = this.RangeTree_Start.parentNode;
        if (this.RangeTree_Start.textContent.length === 0) {
            // First Enter Creates a list item, second enter deletes and exits the list block into a new paragraph
            if (currentListItem === this.StartBlock.firstChild) {
                let li = this.CreateNewListItem();
                currentListItem.insertAdjacentElement('afterend', li);
                rangeclone.setStart(li.firstChild, 0);
                rangeclone.setEnd(li.firstChild, 0);
            }
            else {
                this.StartBlock.removeChild(currentListItem);
                let block = this.CreateNewBlock();
                this.StartBlock.insertAdjacentElement('afterend', block);
                rangeclone.setStart(block.firstChild, 0);
            }
        }
        else {
            if (this.atContainerStart(currentListItem, rangeclone)) {
                let listitem = this.CreateNewListItem();
                currentListItem.insertAdjacentElement('beforebegin', listitem);
                rangeclone.setStart(listitem.firstChild, 0);
                rangeclone.setEnd(listitem.firstChild, 0);

            }
            else if (this.atContainerEnd(currentListItem, rangeclone)) {
                let listitem = this.CreateNewListItem();
                currentListItem.insertAdjacentElement('afterend', listitem);
                rangeclone.setStart(listitem.firstChild, 0);
                rangeclone.setEnd(listitem.firstChild, 0);
            }
            else {
                this.Core_DivideContainer_New_Front(currentListItem, ConstListItem);
                rangeclone.setStart(this.GetTreeNode(currentListItem), 0);
                rangeclone.setEnd(rangeclone.startContainer, 0);
            }
        }
        return rangeclone;
    }

    //Back Space Only executes if character is at the very start of the list item text.
    Block_List_Behavior_BackspaceKey(event) {
        let selection = document.getSelection();
        let rangeclone = selection.getRangeAt(0).cloneRange();

        let targetList = this.RangeTree_Start.parentNode;
        if (this.atContainerStart(targetList, rangeclone)) { //Handle Backspace at ListItem Level
            event.preventDefault();
            event.stopPropagation();
            if (this.StartBlock.firstChild === targetList) {
                let previousBlock = this.GetPreviousBlock(this.StartBlock);
                if (previousBlock !== null) {
                    rangeclone = this.BackSpace_BlockBehavior(previousBlock);
                }
            }
            else {

                if (targetList.previousSibling.textContent.length === 0) {
                    targetList.previousSibling.remove();
                }
                else if (targetList.textContent.length === 0) {
                    let last = this.GetLastNode(targetList.previousSibling);
                    if (last.nodeType === Node.TEXT_NODE) {
                        rangeclone.setStart(last, last.textContent.length);
                        rangeclone.setEnd(last, last.textContent.length);
                    }
                    else {
                        rangeclone.setStart(last.parentNode, 0);
                        rangeclone.setEnd(last.parentNode, 0);
                    }
                    targetList.remove();
                }
                else {
                    let tempclone = document.createRange();
                    tempclone.selectNodeContents(targetList.previousSibling);
                    targetList.prepend(tempclone.extractContents());
                    tempclone.detach();
                    let offset = this.Core_MergeIdenticalTree_Previous(this.RangeTree_Start);
                    targetList.previousSibling.remove();
                    rangeclone.setStart(this.GetTreeNode(this.RangeTree_Start), offset);
                    rangeclone.setEnd(this.GetTreeNode(this.RangeTree_Start), offset);
                }


            }
            selection.removeAllRanges();
            selection.addRange(rangeclone);
        }
        return rangeclone;
    }

    Block_List_Behavior_DeleteKey(event) {
        let selection = document.getSelection();
        let rangeclone = selection.getRangeAt(0).cloneRange();
        let targetList = this.RangeTree_Start.parentNode;
        if (this.atContainerEnd(targetList, rangeclone)) {
            event.preventDefault();
            event.stopPropagation();
            if (this.StartBlock.lastChild === targetList) {
                let nextBlock = this.GetNextBlock(this.StartBlock);
                if (nextBlock !== null) {
                    rangeclone = this.Delete_BlockBehavior(nextBlock);
                }
            }
            else {
                if (targetList.nextSibling.textContent.length === 0) {
                    targetList.nextSibling.remove();
                }
                else if (targetList.textContent.length === 0) {
                    let first = this.GetFirstNode(targetList.nextSibling);
                    if (first.nodeType === Node.TEXT_NODE) {
                        rangeclone.setStart(first, 0);
                        rangeclone.setEnd(first, 0);
                    }
                    else {
                        rangeclone.setStart(first.parentNode, 0);
                        rangeclone.setEnd(first.parentNode, 0);
                    }
                    targetList.remove();
                }
                else {
                    let tempclone = document.createRange();
                    tempclone.selectNodeContents(targetList.nextSibling);
                    targetList.append(tempclone.extractContents());
                    tempclone.detach();
                    let offset = this.RangeTree_Start.textContent.length;
                    targetList.nextSibling.remove();
                    this.Core_MergeIdenticalTrees(this.RangeTree_Start);
                    rangeclone.setStart(this.GetTreeNode(this.RangeTree_Start), offset);
                    rangeclone.setEnd(this.GetTreeNode(this.RangeTree_Start), offset);
                }
            }
            selection.removeAllRanges();
            selection.addRange(rangeclone);
        }
        return rangeclone;
    }

    /* List Traversal - Has an Extra Step to traverse to the next list item before traversing to the next Block */
    Block_List_Traversal_SubRoutine(block, LINode) {
        let nextlistitem = LINode.nextSibling;
        let tree = null;
        if (nextlistitem === null) {
            block = block.nextSibling;
            tree = block.firstChild;
            while (tree.tagName !== ConstTree) {
                tree = treeiter.firstChild;
            }
        }
        else {
            tree = nextlistitem.firstChild;
        }
        return { block, tree };
    }
}


//This is a class to complete a full clone of a range and its container
class CloneWithRange {
    constructor(OriginalContainer, OriginalRange) {
        //console.log(OriginalContainer);
        this.range = OriginalRange.cloneRange();
        this.fragment = document.createDocumentFragment();
        this.StartNode = OriginalContainer.startContainer;
        this.StartOffset = OriginalContainer.startOffset;
        this.EndNode = OriginalContainer.endContainer;
        this.EndOffset = OriginalContainer.endOffset;

        let SearchForStart = true;
        Array.from(OriginalContainer.childNodes).forEach((child) => {
            let clonedChild = child.cloneNode(true);
            this.fragment.appendChild(clonedChild);
            //console.log(clonedChild.style.color);
            //Traverse the OriginalContainer to find map the cloned start and end to the fragment

            //A Forward Traversal means the Start Container is found first
            //A bool is used to reduce unnecessary iterations
            if (SearchForStart) {
                if (child === OriginalRange.startContainer) {
                    //console.log(`Tree Mystery - From CloneWithRange Contstructor, ${child}, ${OriginalContainer}`);
                    this.range.setStart(clonedChild, OriginalRange.startOffset);
                    SearchForStart = false;
                }
                else if (child.contains(OriginalRange.startContainer)) {
                    let iter = child;
                    let clonedIter = clonedChild;
                    while (iter != OriginalRange.startContainer) {

                        for (let i = 0; i < iter.childNodes.length; i++) {
                            let temp = iter.childNodes[i];

                            if (temp === OriginalRange.startContainer) {
                                iter = temp;
                                this.range.setStart(clonedIter.childNodes[i], OriginalRange.startOffset);
                                SearchForStart = false;
                                break;
                            }

                            if (temp.contains(OriginalRange.startContainer)) {
                                iter = temp;
                                clonedIter = clonedIter.childNodes[i];
                                break;
                            }
                        }
                    }

                }
            }

            if (child === OriginalRange.endContainer) {
                this.range.setEnd(clonedChild, OriginalRange.endOffset);
            }
            else if (child.contains(OriginalRange.endContainer)) {
                let iter = child;
                let clonedIter = clonedChild;
                while (iter != OriginalRange.endContainer) {

                    for (let i = 0; i < iter.childNodes.length; i++) {
                        let temp = iter.childNodes[i];

                        if (temp === OriginalRange.endContainer) {

                            iter = temp;
                            this.range.setEnd(clonedIter.childNodes[i], OriginalRange.endOffset);
                            break;
                        }

                        if (temp.contains(OriginalRange.endContainer)) {
                            iter = temp;
                            clonedIter = clonedIter.childNodes[i];
                            break;
                        }

                    }
                }
            }

        });

        //The Cloned Range's Start and End Containers may not exist in the container its referencing.
        // This code to to ensure that the objects range is initialized to the objects fragment
        // The starts and ends are intialized to the first or last character of the container.
        if (this.StartNode === OriginalRange.startContainer) {
            console.log('No Start Found');
            let startInit = this.fragment.firstChild;
            while (startInit.nodeType !== Node.TEXT_NODE) {
                startInit = startInit.firstChild;
            }
            this.range.setStart(startInit, 0);
        }
        if (this.range.endContainer === OriginalRange.endContainer) {
            console.log('No End Found');
            let endInit = this.fragment.lastChild;
            while (endInit.lastChild !== null) {
                endInit = endInit.lastChild;
            }
            if (endInit.nodeType === Node.TEXT_NODE) {
                this.range.setEnd(endInit, endInit.textContent.length);
            }
            else {
                this.range.setEnd(endInit.parentNode, 0);
            }

        }

        this.StartNode = this.range.startContainer;
        this.StartOffset = this.range.startOffset;
        this.EndNode = this.range.endContainer;
        this.EndOffset = this.range.endOffset;

    }

    Destroy() {
        this.range.detache();
    }

    PrintFragment() {
        console.log(this.fragment.childNodes);
    }


    isElementEmpty(childNode) {
        let isEmpty = false;

		if(childNode.textContent === ""){
			isEmpty = true;
		}
		else {
			while (childNode.lastChild !== null) {
            childNode = childNode.lastChild;
			}
			if (childNode.nodeType !== Node.TEXT_NODE) {
				if (childNode.tagName !== ConstBR) {
                isEmpty = true;
				}
			}
		}
        return isEmpty;
    }

    GetFront_nonInclusive(ElementTag) {

        let element = document.createElement(ElementTag);
        element.appendChild(this.fragment);
        //Select Unwanted Text and Delete
        this.range.selectNodeContents(element);
        this.range.setStart(this.StartNode, this.StartOffset);
        this.range.deleteContents();

        if (this.isElementEmpty(element.lastChild)) {
            element.removeChild(element.lastChild);
        }
        return element;
    }

    GetFront_Inclusive(ElementTag) {
        let element = document.createElement(ElementTag);
        element.appendChild(this.fragment);
		
        this.range.selectNodeContents(element);
        this.range.setStart(this.EndNode, this.EndOffset);
        this.range.deleteContents();

        return element;
    }

    GetEnd_nonInclusive(ElementTag) {
        let element = document.createElement(ElementTag);
        element.appendChild(this.fragment);

        this.range.selectNodeContents(element);
        this.range.setEnd(this.EndNode, this.EndOffset);
        this.range.deleteContents();

        if (this.isElementEmpty(element.firstChild)) {
            element.removeChild(element.firstChild);
        }

        return element;
    }

    GetEnd_Inclusive(ElementTag) {
        let element = document.createElement(ElementTag);
        element.appendChild(this.fragment);
        this.PrintFragment();

        this.range.selectNodeContents(element);
        this.range.setEnd(this.StartNode, this.StartOffset);

        this.range.deleteContents();
        return element;
    }

    GetMiddle_TrimInverseSelections(ElementTag) {
        let element = document.createElement(ElementTag);
        element.appendChild(this.fragment);

        //Delete BackSide
        this.range.selectNodeContents(element);
        this.range.setStart(this.EndNode, this.EndOffset);
        this.range.deleteContents();
        //delete FrontInverse
        this.range.selectNodeContents(element);
        this.range.setEnd(this.StartNode, this.StartOffset);
        this.range.deleteContents();
        return element;
    }
}


