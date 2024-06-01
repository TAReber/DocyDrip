

export const ObjectMap = new Map();
export const Active = 'Active';

//CSS CLASS Globals


export const Const = {
	Block: 'P',
	Format: 'P', //Not Used, Still Deciding
	Tree: 'SPAN',
	Link: 'A'

};

//Void Elements are Tags that can not have Text
export const Void = {
	Break: 'BR'
};

//Standard Block Tags
export const StandardStructures = {
	H1: 'H1',
	H2: 'H2',
	H3: 'H3',
	H4: 'H4',
	H5: 'H5',
	H6: 'H6',
};
export const StandardStructureArray = [Const.Block, StandardStructures.H1, StandardStructures.H2, StandardStructures.H3, StandardStructures.H4, StandardStructures.H5, StandardStructures.H6];

//List Block Elements
export const ListStructures = {
	UList: 'UL',
	OList: 'OL',
	ListItem: 'LI'
}


//Void Element
//export const ConstBR = 'BR';
export const ConstFontFamilies = {
	DefaultFamily: "Arial", //Initialized Seperatly with ""
	Options: [
		"Arial", "Verdana", "Times New Roman", "Georgia", "Trebuchet MS",
		"Tahoma", "Courier New", "Lucida Console", "Impact", "Comic Sans MS",
		"Palatino Linotype", "Book Antiqua", "Lucida Sans Unicode", "Garamond", "MS Serif",
		"MS Sans Serif", "Lucida Grande", "Geneva", "Helvetica", "Courier", "Monaco", "Optima",
		"Hoefler Text", "Baskerville", "Big Caslon", "American Typewriter", "Andale Mono", "Copperplate",
		"Papyrus", "Brush Script MT", "Snell Roundhand", "Zapf Chancery", "Zapfino"
	],
	
};


export const ConstColors = {
	DefaultFont: "Black", //Trees with out a style will default to "" Because It is defined by the site.
	DefaultBackground: "White",
	Options: [
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
	],
};

export const ConstFontSizes = {
	DefaultSize:'12px', //Option Initialized Seperatly
	Options: [
		"12px",
		"14px",
		"18px",
		"22px",
		"26px",
		"30px",
	],
};

/*
	Following Are Enumeration Parameters for readability
*/
//BitWise Constants //No Extras = 0
export const Bit = {
	DBStorage: 1, // (1)  Database Storage //If off, I can create white space nodes for formatting when copying html
	BasicTags: (1 << 1), // (2) Bold, Italic, Underline
	AdvancedTags: (1 << 2), // (4) Strikethrough, Subscript, SuperScirpt
	Links: (1 << 3), // (8)  Links
	FontColorsOptions: (1 << 4), // (16)
	FontBackgroundColorOptions: (1 << 5), // (32)
	FontSizeOptions: (1 << 6), // (64)
	FontFamilyOptions: (1 << 7),  // (128)
	StandardHeaders: (1 << 8), //  (256)  H1 - H6
	StandardBlockStyles: (1 << 9), // (512)   Standard Block Alignment and justify
	ListBlocks: (1 << 10), //  (1024)   Ordered and Unordered Lists
	ListBlockFormats: (1 << 11), // (2048) Not Used

	CustomClasses: (1 << 31), // (2,147,483,648)  Extra Options
}

export const StandardBlockStyles_textindent = {
	indent: 'indent',
	outdent: 'outdent'
};

//Options css options for block styles, will phase out to use just styles.
export const StandardBlockStyles_textalign = {	
	left: 'left',
	center: 'center',
	right: 'right',
	full: 'full'
};

export const ExtraOptionStart = {
	Value: "TEO-Sync-Start",
	Desc: "Normalize Start"
}

export const ExtraOptionEnd = {
	Value:"TEO-Sync-End",
	Desc: "Normalize End"
}

