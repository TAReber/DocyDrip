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
//import * as Globals from "./TEO-UI.js";
import {
    ObjectMap, Active, Bit, Const, Void, StandardStructureArray, ListStructures,
    StandardBlockStyles_textalign, StandardBlockStyles_textindent, ExtraOptionStart, ExtraOptionEnd
} from "./TEO-Globals.js";

import * as UI from "./TEO-UI.js";

const StyleType = {
    Color: 1,
    FontFamily: 2,
    BackgroundColor: 3,
    FontSize: 4
}

const Behavior = {
    Add: 1,
    Remove: 2,
    Toggle: 3
}

export class TextEditorObject {
    constructor(editableContainer, data) {
        this.Page = editableContainer;
        this.Page.contentEditable = true;
        this.id = this.Page.id;
        ObjectMap.set(this.id, this);
        this.UIContainer = UI.CreateUIContainer(this.Page);

        //Targeting Variables Surrounding Selections and clicking
        this.StartBlock = null;
        this.EndBlock = null;
        this.RangeTree_Start = null;
        this.RangeTree_End = null;

        if (data === null) {
            data = 511;
        }
        this.Options = data;

        //Essential Editor Behaviors
        this.boundHandlePageSelectionChange = this.HandlePageSelectionChange.bind(this);

        this.boundHandlePageKeyDown = this.HandlePageKeyDown.bind(this);
        this.boundHandlePageFocusOut = this.HandlePageFocusOut.bind(this);
        this.boundHandlePageDragStart = this.HandlePageDragStart.bind(this);
        this.boundHandlePageDragDrop = this.HandlePageDragDrop.bind(this);
        this.boundHandlePagePaste = this.HandlePagePasteText.bind(this);
        this.Initialize();

        this.BasicTags_Bindings = null;
        this.BasicTags_Buttons = null;
        if (this.Options & Bit.BasicTags) {
            this.BasicTags_Buttons = this.Initialize_BasicTag_Bindings();
        }

        this.AdvancedTags_Bindings = null;
        this.AdvancedTags_Buttons = null;
        if (this.Options & Bit.AdvancedTags) {
            this.AdvancedTags_Buttons = this.Initialize_AdvancedTag_Bindings();
        }

        this.Link_Bindings = null;
        this.Link_Buttons = null;
        if (this.Options & Bit.Links) {
            this.Link_Buttons = this.Initialize_Link_Bindings();
        }

        this.boundHandleTextColorOptionChange = null;
        this.ColorSelector = null;
        if (this.Options & Bit.FontColorsOptions) {
            this.ColorSelector = this.Initialize_TextColorSelector_Bindings();

        }

        this.boundHandleBackgroundColorOptionsChange = null;
        this.BackgroundColorSelector = null;
        if (this.Options & Bit.FontBackgroundColorOptions) {
            this.BackgroundColorSelector = this.Initialize_BackgroundColor_Bindings();
        }

        this.boundHandleFontSizeOptionsChange = null;
        this.FontSizeSelector = null;
        if (this.Options & Bit.FontSizeOptions) {
            this.FontSizeSelector = this.Initialize_FontSizeSelector_Bindings();
        }

        this.boundHandleFontFamilyOptionsChange = null;
        this.FontFamilySelector = null;
        if (this.Options & Bit.FontFamilyOptions) {
            this.FontFamilySelector = this.Initialize_FontFamily_Bindings();
        }


        this.boundHandleStandardBlockOptionsChange = null;
        this.StandardBlockSelector = null;
        if (this.Options & Bit.StandardHeaders) {
            this.StandardBlockSelector = this.Initialize_StandardBlockSelector();
        }

        this.StandardBlockTextIndent_Bindings = null;
        this.StandardBlockTextAlign_Bindings = null;
        this.StandardTextIndent_Buttons = null;
        this.StandardTextAlignment_Buttons = null;
        if (this.Options & Bit.StandardBlockStyles) {
            this.StandardTextIndent_Buttons = this.Initialize_StandardTextIndent_Bindings();
            this.StandardTextAlignment_Buttons = this.Initialize_StandardTextAlignment_Bindings();
        }

        this.ListBlock_Bindings = null;
        this.ListBlock_Buttons = null;
        if (this.Options & Bit.ListBlocks) {
            this.ListBlock_Buttons = this.Initialize_ListBlock_Bindings();
        }
        //Not Implemented
        if (this.Options & Bit.ListBlockFormats) {
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
        this.Page.removeEventListener('dragstart', this.boundHandlePageDragStart);
        this.Page.removeEventListener('drop', this.boundHandlePageDragDrop);
        this.Page.removeEventListener('paste', this.boundHandlePagePaste);

        if (this.Options & Bit.BasicTags) {
            this.BasicTags_Buttons.bold.removeEventListener('click', this.BasicTags_Bindings.boundHandleBoldClick);
            this.BasicTags_Buttons.italic.removeEventListener('click', this.BasicTags_Bindings.boundHandleItalicClick);
            this.BasicTags_Buttons.underline.removeEventListener('click', this.BasicTags_Bindings.boundHandleUnderlineClick);
        }
        if (this.Options & Bit.AdvancedTags) {
            this.AdvancedTags_Buttons.strikethrough.removeEventListener('click', this.AdvancedTags_Bindings.boundHandleStrikeThroughClick);
            this.AdvancedTags_Buttons.subscript.removeEventListener('click', this.AdvancedTags_Bindings.boundHandleSubscriptClick);
            this.AdvancedTags_Buttons.superscript.removeEventListener('click', this.AdvancedTags_Bindings.boundHandleSuperscriptClick);
        }
        if (this.Options & Bit.Links) {
            this.Link_Buttons.link.removeEventListener('click', this.Link_Bindings.boundHandleLinkClick);
            this.Link_Buttons.unlink.removeEventListener('click', this.Link_Bindings.boundHandleUnLinkClick);
        }
        if (this.Options & Bit.FontColorsOptions) {
            this.ColorSelector.removeEventListener('change', this.boundHandleTextColorOptionChange);
        }

        if (this.Options & Bit.FontBackgroundColorOptions) {
            this.BackgroundColorSelector.removeEventListener('change', this.boundHandleBackgroundColorOptionsChange);
        }

        if (this.Options & Bit.FontSizeOptions) {
            this.FontSizeSelector.removeEventListener('change', this.boundHandleFontSizeOptionsChange);
        }

        if (this.Options & Bit.FontFamilyOptions) {
            this.FontFamilySelector.removeEventListener('change', this.boundHandleFontFamilyOptionsChange);
        }

        if (this.Options & Bit.StandardHeaders) {
            this.StandardBlockSelector.removeEventListener('change', this.boundHandleStandardBlockOptionsChange);
        }

        if (this.Options & Bit.StandardBlockStyles) {
            this.StandardTextIndent_Buttons.Indent.removeEventListener('click', this.StandardBlockTextIndent_Bindings.boundHandleIndentClick);
            this.StandardTextIndent_Buttons.Outdent.removeEventListener('click', this.StandardBlockTextIndent_Bindings.boundHandleOutdentClick);
            this.StandardTextAlignment_Buttons.JustifyLeft.removeEventListener('click', this.StandardBlockTextAlign_Bindings.boundHandleJustifyLeftClick);
            this.StandardTextAlignment_Buttons.JustifyCenter.removeEventListener('click', this.StandardBlockTextAlign_Bindings.boundHandleJustifyCenterClick);
            this.StandardTextAlignment_Buttons.JustifyRight.removeEventListener('click', this.StandardBlockTextAlign_Bindings.boundHandleJustifyRightClick);
            this.StandardTextAlignment_Buttons.JustifyFull.removeEventListener('click', this.StandardBlockTextAlign_Bindings.boundHandleJustifyFullClick);
        }

        if (this.Options & Bit.ListBlocks) {
            this.ListBlock_Buttons.OL.removeEventListener('click', this.ListBlock_Bindings.boundHandleOrderedListClick),
                this.ListBlock_Buttons.UL.removeEventListener('click', this.ListBlock_Bindings.boundHandleUnorderedListClick)
        }

        if (this.Options & Bit.ListBlockFormats) {
            //No Formats Exist, or might ever exist.
        }

        this.UIContainer.remove();

        ObjectMap.delete(this.id);
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
        let firstTree = this.Page.querySelector(Const.Tree);
        let tail = this.GetTailofTree(firstTree);
        document.getSelection().setPosition(tail, 0);

        document.addEventListener('selectionchange', this.boundHandlePageSelectionChange);

        this.Page.addEventListener('keydown', this.boundHandlePageKeyDown);
        this.Page.addEventListener('focusout', this.boundHandlePageFocusOut);
        this.Page.addEventListener('dragstart', this.boundHandlePageDragStart);
        this.Page.addEventListener('drop', this.boundHandlePageDragDrop);
        this.Page.addEventListener('paste', this.boundHandlePagePaste);
    }

    Initialize_BasicTag_Bindings() {
        this.BasicTags_Bindings = {
            boundHandleBoldClick: this.HandleStyleButtonClick.bind(this, 'B'),
            boundHandleItalicClick: this.HandleStyleButtonClick.bind(this, 'I'),
            boundHandleUnderlineClick: this.HandleStyleButtonClick.bind(this, 'U')
        }
        return UI.CreateBasicTag_Buttons(this.UIContainer, this.BasicTags_Bindings);
    }

    Initialize_Link_Bindings() {
        this.Link_Bindings = {
            boundHandleLinkClick: this.HandleLinkButtonClick.bind(this, Behavior.Add),
            boundHandleUnLinkClick: this.HandleLinkButtonClick.bind(this, Behavior.Remove)
        }
        return UI.CreateLinkButton(this.UIContainer, this.Link_Bindings);
    }

    Initialize_AdvancedTag_Bindings() {
        this.AdvancedTags_Bindings = {
            boundHandleStrikeClick: this.HandleStyleButtonClick.bind(this, 'STRIKE'),
            boundHandleSuperscriptClick: this.HandleStyleButtonClick.bind(this, 'SUP'),
            boundHandleSubscriptClick: this.HandleStyleButtonClick.bind(this, 'SUB')
        }
        return UI.CreateAdvancedTag_Buttons(this.UIContainer, this.AdvancedTags_Bindings);
    }

    Initialize_StandardTextIndent_Bindings() {
        this.StandardBlockTextIndent_Bindings = {
            boundHandleIndentClick: this.HandleStandardBlockIndentClick.bind(this, StandardBlockStyles_textindent.indent),
            boundHandleOutdentClick: this.HandleStandardBlockIndentClick.bind(this, StandardBlockStyles_textindent.outdent),
        }
        return UI.CreateStandardBlockTextIndent_Buttons(this.UIContainer, this.StandardBlockTextIndent_Bindings);
    };

    Initialize_StandardTextAlignment_Bindings() {
        this.StandardBlockTextAlign_Bindings = {
            boundHandleJustifyLeftClick: this.HandleStandardBlockTextAlignClick.bind(this, StandardBlockStyles_textalign.left),
            boundHandleJustifyCenterClick: this.HandleStandardBlockTextAlignClick.bind(this, StandardBlockStyles_textalign.center),
            boundHandleJustifyRightClick: this.HandleStandardBlockTextAlignClick.bind(this, StandardBlockStyles_textalign.right),
            boundHandleJustifyFullClick: this.HandleStandardBlockTextAlignClick.bind(this, StandardBlockStyles_textalign.full)
        }
        return UI.CreateStandardBlockTextAlignment_Buttons(this.UIContainer, this.StandardBlockTextAlign_Bindings);
    };

    Initialize_ListBlock_Bindings() {
        this.ListBlock_Bindings = {
            boundHandleOrderedListClick: this.HandleBlockStyleClick.bind(this, 'OL'),
            boundHandleUnorderedListClick: this.HandleBlockStyleClick.bind(this, 'UL')
        };
        return UI.CreateListBlockButtons(this.UIContainer, this.ListBlock_Bindings);
    };

    Initialize_StandardBlockSelector() {
        this.boundHandleStandardBlockOptionsChange = this.HandleStandardBlockOptionsChange.bind(this);
        return UI.CreateStandardBlockOptions(this.UIContainer, this.boundHandleStandardBlockOptionsChange);
    }

    Initialize_TextColorSelector_Bindings() {
        this.boundHandleTextColorOptionChange = this.HandleTextColorOptionChange.bind(this);
        return UI.CreateFontColorSelector(this.UIContainer, this.boundHandleTextColorOptionChange);
    }

    Initialize_BackgroundColor_Bindings() {
        this.boundHandleBackgroundColorOptionsChange = this.HandleBackgroundColorOptionsChange.bind(this);
        return UI.CreateBackgroundColorSelector(this.UIContainer, this.boundHandleBackgroundColorOptionsChange);
    }

    Initialize_FontFamily_Bindings() {
        this.boundHandleFontFamilyOptionsChange = this.HandleFontFamilyOptionsChange.bind(this);
        return UI.CreateFontFamilySelector(this.UIContainer, this.boundHandleFontFamilyOptionsChange);
    }

    Initialize_FontSizeSelector_Bindings() {
        this.boundHandleFontSizeOptionsChange = this.HandleFontSizeOptionsChange.bind(this);
        return UI.CreateFontSizeSelector(this.UIContainer, this.boundHandleFontSizeOptionsChange);
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

    HandlePageDragStart(event) {
        //console.log('start drag');
        event.preventDefault();
        event.stopPropagation();
    }
    HandlePageDragDrop(event) {
        //console.log(event);
        event.preventDefault();
        event.stopPropagation();
    }
    HandlePagePasteText(event) {
        event.preventDefault();
        let plaintext = event.clipboardData.getData('text/plain');

        let selection = document.getSelection();
        let range = selection.getRangeAt(0);

        let offset = range.startOffset + plaintext.length;
        if (event.target.tagName === Void.Break) {
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
        selection.setPosition(this.GetTailofTree(this.RangeTree_Start), offset);
    }

    HandleStyleButtonClick(tag) {
        this.ToggleTreeTag(tag);
    }
    HandleBlockStyleClick(tag) {
        this.ToggleBlockTag(tag);
    }
    HandleLinkButtonClick(behavior) {
        this.ToggleLink(behavior);
    }
    HandleStandardBlockIndentClick(style) {
        this.ToggleStandardBlock_TextIndent(style);
    }
    HandleStandardBlockTextAlignClick(style) {

        this.ToggleStandardBlock_TextAlignment(style);
    }
    HandleStandardBlockOptionsChange(event) {
        if (event.isTrusted) {
            this.ChangeBlockType(this.StandardBlockSelector.value);
        }
    }
    HandleTextColorOptionChange(event) {
        if (event.isTrusted) {
            if (this.ColorSelector.value !== 'none') {
                if (this.ColorSelector.value === ExtraOptionStart.Value)
                    this.ToggleTreeStyle(this.RangeTree_Start.style.color, StyleType.Color);
                else if (this.ColorSelector.value === ExtraOptionEnd.Value)
                    this.ToggleTreeStyle(this.RangeTree_End.style.color, StyleType.Color);
                else
                    this.ToggleTreeStyle(this.ColorSelector.value, StyleType.Color);
            }
        }
    }
    HandleBackgroundColorOptionsChange(event) {
        if (event.isTrusted) {
            if (this.BackgroundColorSelector.value !== 'none') {
                if (this.BackgroundColorSelector.value === ExtraOptionStart.Value)
                    this.ToggleTreeStyle(this.RangeTree_Start.style.backgroundColor, StyleType.BackgroundColor);
                else if (this.BackgroundColorSelector.value === ExtraOptionEnd.Value)
                    this.ToggleTreeStyle(this.RangeTree_End.style.backgroundColor, StyleType.BackgroundColor);
                else
                    this.ToggleTreeStyle(this.BackgroundColorSelector.value, StyleType.BackgroundColor);
            }
        }
    }
    HandleFontSizeOptionsChange(event) {
        if (event.isTrusted) {
            if (this.FontSizeSelector.value !== 'none') {
                if (this.FontSizeSelector.value === ExtraOptionStart.Value)
                    this.ToggleTreeStyle(this.RangeTree_Start.style.fontSize, StyleType.FontSize);
                else if (this.FontSizeSelector.value === ExtraOptionEnd.Value)
                    this.ToggleTreeStyle(this.RangeTree_End.style.fontSize, StyleType.FontSize);
                else
                    this.ToggleTreeStyle(this.FontSizeSelector.value, StyleType.FontSize);
            }
        }
    }
    HandleFontFamilyOptionsChange(event) {
        if (event.isTrusted) {
            if (this.FontFamilySelector.value !== 'none') {
                if (this.FontFamilySelector.value === ExtraOptionStart.Value)
                    this.ToggleTreeStyle(this.RangeTree_Start.style.fontFamily, StyleType.FontFamily);
                else if (this.FontFamilySelector.value === ExtraOptionEnd.Value)
                    this.ToggleTreeStyle(this.RangeTree_End.style.fontFamily, StyleType.FontFamily);
                else
                    this.ToggleTreeStyle(this.FontFamilySelector.value, StyleType.FontFamily)
            }
        }
    }

    //PrintTargets() {
    //    //this.Selection_LazySelector_Word();
    //    console.log(this.StartBlock);
    //    console.log(this.EndBlock);
    //    console.log(document.getSelection().getRangeAt(0));
    //}

    KeyBoardPageEvents(event) {
        //if (event.keyCode === 192) { //temporary Testing Code ` tilda key
        //    event.preventDefault();
        //    event.stopPropagation();
        //    this.PrintTargets();
        //}
        if (event.code === 'Enter') {
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
    Delete_BKWD_BlockBehavior(previous) { //BackSpace_BlockBehavior
        let range = document.createRange();
        //Turn into Function
        if (previous.block.tagName === this.StartBlock.tagName) {
            range.selectNodeContents(previous.block);
            this.StartBlock.prepend(range.extractContents());
            this.Page.removeChild(previous.block);
            let length = this.Core_MergeIdenticalTree_Previous(this.RangeTree_Start);
            let tempTextNode = this.GetTailofTree(this.RangeTree_Start);
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
            let treeTail = this.GetTailofTree(previous.tree);
            if (treeTail.tagName === Void.Break) {
                range.setStart(treeTail.parentNode, treeTail.parentNode.childNodes.length - 1);
                range.setEnd(treeTail.parentNode, treeTail.parentNode.childNodes.length - 1);
            }
            else {
                range.setStart(treeTail, treeTail.textContent.length);
                range.setEnd(treeTail, treeTail.textContent.length);
            }
            //Deletes
            if (this.StartBlock.textContent.length === 0) {
                this.Page.removeChild(this.StartBlock);
            }
        }

        return range;
    }
    //Merges Next Block if its the same type or sets the caret to the start of the next block
    Delete_FWD_NextBlockBehavior(next) { //Delete_BlockBehavior
        let rangeclone = document.createRange();
        if (next.block.tagName === this.StartBlock.tagName) {
            rangeclone.selectNodeContents(next.block);
            let fragment = rangeclone.extractContents();
            this.StartBlock.append(fragment);
            this.Page.removeChild(next.block);
            let length = this.RangeTree_Start.textContent.length;
            this.Core_MergeIdenticalTrees(this.RangeTree_Start);

            let treeTail = this.GetTailofTree(this.RangeTree_Start);
            if (treeTail.nodeType === Node.TEXT_NODE) {
                rangeclone.setStart(treeTail, length);
                rangeclone.setEnd(treeTail, length);
            }
            else {
                rangeclone.setStart(treeTail.parentNode, 0);
                rangeclone.setEnd(treeTail.parentNode, 0);
            }
        }
        else {
            if (next.block.textContent.length === 0 && next.block.childNodes.length <= 1) {
                this.Page.removeChild(next.block);
            }
            else {
                let treeTail = this.GetTailofTree(next.tree);
                if (treeTail.tagName === Void.Break) {
                    rangeclone.setStart(treeTail.parentNode, nextFirst.parentNode.childNodes.length - 1);
                    rangeclone.setEnd(treeTail.parentNode, nextFirst.parentNode.childNodes.length - 1);
                }
                else {
                    rangeclone.setStart(treeTail, 0);
                    rangeclone.setEnd(treeTail, 0);
                }
            }
        }

        return rangeclone;
    }
    //Deletes the selected Range and returns 
    Selection_Delete() {
        let resultRange = document.getSelection().getRangeAt(0);

        //Range Delete Solution Divides Blocks, deletes every block between the new outer blocks
        if (this.atContainerEnd(this.EndBlock, resultRange) === false) {
            //Extra Check to prevent division of container with 2 or less BR tags, subsequent traversal code will clean up EndBlock
            if (this.EndBlock.textContent.length !== 0 || this.EndBlock.childNodes.length > 2) {
                this.Core_DivideContainer_New_End(this.EndBlock, this.EndBlock.tagName);
            }
        }
        let outerend = this.Block_Traversal_Iterate_To_Next(this.EndBlock, this.RangeTree_End);

        if (this.atContainerStart(this.StartBlock, resultRange) === false) {
            this.Core_DivideContainer_New_Front(this.StartBlock, this.StartBlock.tagName);
        }
        else {
            if (Iterate_Sibling_Previous(this.StartBlock) === null) {
                let block = this.CreateNewBlock();
                this.StartBlock.insertAdjacentElement('beforebegin', block);
            }
        }
        let outerstart = this.Block_Traversal_Iterate_To_Previous(this.StartBlock, this.RangeTree_Start);

        //Delete The Sandwiched Blocks
        let iter = this.StartBlock;
        while (iter !== this.EndBlock) {
            let temp = iter;
            iter = Iterate_Sibling_Next(iter);
            temp.parentNode.removeChild(temp);
        }
        this.EndBlock.remove();
        //Merge and/or Set the Range
        if (outerend.block !== null) {

            if (outerstart.block.tagName === outerend.block.tagName) { //Merge Blocks if same
                resultRange.selectNodeContents(outerend.block);
                outerstart.block.append(resultRange.extractContents());
                this.Page.removeChild(outerend.block);

                let length = this.Core_MergeIdenticalTree_Previous(outerend.tree);
                let tail = this.GetTailofTree(outerend.tree);
                if (tail.nodeType === Node.TEXT_NODE) {
                    resultRange.setStart(tail, length);
                    resultRange.setEnd(tail, length);
                }
                else {
                    resultRange.setStart(tail.parentNode, tail.parentNode.childNodes.length - 1);
                    resultRange.setEnd(tail.parentNode, tail.parentNode.childNodes.length - 1);
                }
            }
            else {
                let startTail = this.GetTailofTree(outerstart.tree);
                if (startTail.nodeType === Node.TEXT_NODE) {
                    resultRange.setStart(startTail, startTail.textContent.length);
                }
                else {
                    resultRange.setStart(startTail.parentNode, startTail.parentNode.childNodes.length - 1);
                }

                let endTail = this.GetTailofTree(outerend.tree);
                if (endTail === Node.TEXT_NODE) {
                    resultRange.setEnd(endTail, 0);
                }
                else {
                    resultRange.setEnd(endTail.parentNode, outerend.tree.parentNode.childNodes.length - 1);
                }
            }
        }
        else {
            let tail = this.GetTailofTree(outerstart.tree);
            if (tail.nodeType === Node.TEXT_NODE) {
                resultRange.setStart(tail, tail.textContent.length);
                resultRange.setEnd(tail, tail.textContent.length);
            }
            else {
                resultRange.setStart(tail.parentNode, tail.parentNode.childNodes.length - 1);
                resultRange.setEnd(tail.parentNode, tail.parentNode.childNodes.length - 1);
            }
        }
        return resultRange;
    }

    CreateNewBlock() {
        const element = document.createElement(Const.Block);
        element.appendChild(this.CreateNewTextTree());
        return element;
    }

    CreateNewTextTree() {
        const texttree = document.createElement(Const.Tree);
        const br = document.createElement(Void.Break);
        texttree.appendChild(br);
        return texttree;
    }
    CreateNewListItem() {
        const element = document.createElement(ListStructures.ListItem);
        element.appendChild(this.CreateNewTextTree());
        return element;
    }

    isEmptyTag(node) {
        let isEmpty = false;
        if (node.textContent === "") {
            isEmpty = true;
        }
        else {
            node = this.GetTailofTree(node);
            if (node.nodeType !== Node.TEXT_NODE) {
                if (node.tagName !== Void.Break) {
                    isEmpty = true;
                }
            }
        }
        return isEmpty;
    }

    Core_MergeIdenticalTrees(treeNode) {
        let length = 0;
        let next = Iterate_Sibling_Next(treeNode);
        if (next !== null) {
            if (next.textContent.length !== 0) {
                if (this.Core_hasIdentical_Tags(treeNode, next) === true &&
                    this.Core_hasIdenticalStyle(treeNode, next) === true) {
                    this.GetTailofTree(treeNode).textContent += next.textContent;
                    next.remove();
                }
            }
        }
        length = this.Core_MergeIdenticalTree_Previous(treeNode);
        return length;
    }


    Core_MergeIdenticalTree_Previous(treeNode) {
        let length = 0;
        let previous = Iterate_Sibling_Previous(treeNode);
        if (previous !== null) {
            if (previous.textContent.length !== 0) {
                if (this.Core_hasIdentical_Tags(treeNode, previous) === true &&
                    this.Core_hasIdenticalStyle(treeNode, previous) === true) {

                    //This stops some kind of edge that was causing an issue setting the range
                    if (previous === this.RangeTree_Start) {
                        this.RangeTree_Start = treeNode;
                    }
                    let textNode = this.GetTailofTree(treeNode);
                    length = previous.textContent.length;

                    textNode.textContent = previous.textContent + textNode.textContent;
                    previous.remove();
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
        if (treenode.style.color != siblingtree.style.color)
            samestyles = false;
        if (treenode.style.fontFamily != siblingtree.style.fontFamily)
            samestyles = false;
        if (treenode.style.backgroundColor != siblingtree.style.backgroundColor)
            samestyles = false;
        if (treenode.style.fontSize != siblingtree.style.fontSize)
            samestyles = false;

        return samestyles;
    }

    GetTailofTree(treeNode) {
        while (treeNode.firstChild !== null) {
            treeNode = treeNode.firstChild;
        }
        return treeNode;
    }

    atContainerStart(container, range) {
        let atStart = false;
        let startNode = this.GetFirstNode(container);

        if (range.startOffset === 0) {
            if (startNode === range.startContainer) {
                atStart = true;
            }
            if (startNode.tagName === Void.Break) {
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
        if (endNode.tagName === Void.Break) {
            if (endNode === range.endContainer.lastChild) {
                atEnd = true;
            }
        }
        return atEnd;
    }

    GetFirstNode(containerToSearch) {
        let result = null
        while (result === null) {

            if (containerToSearch.tagName === Void.Break) {
                result = containerToSearch;
            }
            else {
                if (containerToSearch.nodeType === Node.TEXT_NODE) {
                    result = containerToSearch;
                }
                else {
                    containerToSearch = Iterate_FirstChild(containerToSearch);
                }
            }

        }
        return result;
    }

    GetLastNode(containerToSearch) {
        let result = null;
        while (result === null) {
            if (containerToSearch.tagName === Void.Break) {
                result = containerToSearch;
            }
            else {
                if (containerToSearch.nodeType === Node.TEXT_NODE) {
                    result = containerToSearch;
                }
                else {
                    containerToSearch = Iterate_LastChild(containerToSearch);
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
        let lastchild = Iterate_LastChild(container);
        if (this.isEmptyTag(lastchild)) {
            container.removeChild(lastchild);
        }
        //copy Styles - won't worry if its been kicked out of the dom tree
        this.CopyContainerStyles(container, backhalf);

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
        this.CopyContainerStyles(container, fronthalf);
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
                styledelement.parentNode.replaceChild(Iterate_FirstChild(styledelement), styledelement);
            }
        }
    }

    Core_Set_Range_Selection(startoffset, endoffset) {
        let selectionRange = document.createRange();
        let start = this.GetTailofTree(this.RangeTree_Start);
        if (start.nodeType === Node.TEXT_NODE) {
            selectionRange.setStart(start, startoffset);
        }
        else {
            selectionRange.setStart(start.parentNode, 0);
        }

        let end = this.GetTailofTree(this.RangeTree_End);
        if (end.nodeType === Node.TEXT_NODE) {
            selectionRange.setEnd(end, endoffset);
        }
        else {
            selectionRange.setEnd(end.parentNode, endoffset);
        }
        return selectionRange;
    }

    Block_is_Standard_Structure(container) {
        return StandardStructureArray.includes(container.tagName);
    }
    Block_is_List_Structure(blockLevel_Container) {
        let isListBlock = false;
        if (blockLevel_Container.tagName === ListStructures.OList || blockLevel_Container.tagName === ListStructures.UList) {
            isListBlock = true;
        }
        return isListBlock;
    }

    Block_Traversal_Iterate_To_Next(block, lastTree) {
        let iter = { block, tree: null };

        if (this.Block_is_Standard_Structure(iter.block)) {
            iter = this.Block_Standard_FWD_Traversal_SubRoutine(iter.block);
        }
        else {
            if (this.Block_is_List_Structure(iter.block)) {
                iter = this.Block_List_FWD_Traversal_SubRoutine(iter.block, lastTree.parentNode);
            }
        }
        return iter;
    }

    Block_Traversal_Iterate_To_Previous(block, lastTree) {
        let iter = { block, tree: null };
        if (this.Block_is_Standard_Structure(iter.block)) {
            iter = this.Block_Standard_BKWD_Traversal_SubRoutine(iter.block);
        }
        else {
            if (this.Block_is_List_Structure(iter.block)) {
                iter = this.Block_List_BKWD_Traversal_SubRoutine(iter.block, lastTree.parentNode);
            }
        }
        return iter;
    }

    Block_Traverse_GetFirstTree(block) {
        let tree = null;
        if (this.Block_is_Standard_Structure(block)) {
            tree = this.Block_Standard_GetFirstTree(block)
        }
        else {
            if (this.Block_is_List_Structure(block)) {
                tree = this.Block_List_GetFirstTree(block);
            }
        }
        return tree;
    }

    Block_Traverse_GetLastTree(block) {
        let tree = null;
        if (this.Block_is_Standard_Structure(block)) {
            tree = this.Block_Standard_GetLastTree(block);
        }
        else {
            if (this.Block_is_List_Structure(block)) {
                tree = this.Block_List_GetLastTree(block);
            }
        }
        return tree;
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
                iter = this.Block_Traversal_Iterate_To_Next(iter.block, lastiter);
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
                iter.tree = Iterate_Sibling_Next(iter.tree);
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
        if (true) {
            let selection = document.getSelection();
            let originalrange = selection.getRangeAt(0).cloneRange();

            let offset = originalrange.startOffset;

            selection.modify('move', 'forward', 'word');
            selection.modify('extend', 'backward', 'word');
            let newrange = selection.getRangeAt(0);
            let wordlength = selection.toString().trim().length;
            let wordStart = this.FindTargetTree(this.StartBlock, newrange.startContainer); //this.FindTargetStartTree(newrange.startContainer);

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
                let tree = this.FindTargetTree(this.StartBlock, newrange.startContainer); //this.FindTargetStartTree(newrange.startContainer);
                let counter = -newrange.startOffset;
                while (counter < wordlength) {
                    if (counter + tree.textContent.length < wordlength) {
                        counter += tree.textContent.length;
                        tree = this.Iterate_Tree_Next(tree);
                    }
                    else {
                        offset = wordlength - counter;
                        counter = wordlength;
                    }
                }
                selection.setBaseAndExtent(newrange.startContainer, newrange.startOffset, this.GetTailofTree(tree), offset);
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

                let node = this.GetTailofTree(newBlock);
                if (node.nodeType === Node.TEXT_NODE) {
                    document.getSelection().setPosition(node, 0);
                }
                else {
                    document.getSelection().setPosition(node.parentNode, 0);
                }

            }
        }

    }

    ToggleStandardBlock_TextIndent(style) {
        if (this.Block_is_Standard_Structure(this.StartBlock) === true) {
            if (style === StandardBlockStyles_textindent.indent) {
                this.StartBlock.style.textIndent = '25px';
            }
            else {
                this.StartBlock.style.textIndent = "";
            }
        }
    }

    ToggleStandardBlock_TextAlignment(style) {
        let range = document.getSelection().getRangeAt(0).cloneRange();
        if (this.Block_is_Standard_Structure(this.StartBlock) === true) {
            if (style === StandardBlockStyles_textalign.left) {
                this.StartBlock.style.textAlign = '';
            }
            else {
                this.StartBlock.style.textAlign = style;
            }

        }
        //setBaseAndExtent function is unable to unselect a html selector
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(range);

    }

    CopyContainerStyles(anchorTree, newTree) {
        if (newTree.textContent.length !== 0) {
            newTree.style.color = anchorTree.style.color;
            newTree.style.fontFamily = anchorTree.style.fontFamily;
            newTree.style.backgroundColor = anchorTree.style.backgroundColor;
            newTree.style.fontSize = anchorTree.style.fontSize;
        }
    }

    ApplyNewStyle(targetContainer, style, styleType) {
        if (styleType == StyleType.Color)
            targetContainer.style.color = style;
        else if (styleType == StyleType.FontFamily)
            targetContainer.style.fontFamily = style;
        else if (styleType == StyleType.BackgroundColor)
            targetContainer.style.backgroundColor = style;
        else if (styleType == StyleType.FontSize)
            targetContainer.style.fontSize = style;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ToggleTreeStyle(style, styleType) {

        let selection = document.getSelection();
        if (selection.type === 'Caret') {
            this.Selection_LazySelector_Word();
        }
        let range = selection.getRangeAt(0);

        if (selection.type === 'Range') {
            if (this.RangeTree_Start === this.RangeTree_End) {

                if (selection.toString().trim().length !== this.RangeTree_Start.textContent.trim().length) {
                    if (this.atContainerStart(this.RangeTree_Start, range) === true) {
                        this.Core_DivideContainer_New_End(this.RangeTree_Start, Const.Tree);

                    }
                    else {
                        if (this.atContainerEnd(this.RangeTree_End, range) === false) {
                            this.Core_DivideContainer_New_End(this.RangeTree_Start, Const.Tree);

                        }
                        this.Core_DivideContainer_New_Front(this.RangeTree_Start, Const.Tree);

                    }
                }
                let caretPosition = this.RangeTree_Start.textContent.length;
                let offset = 0;

                this.ApplyNewStyle(this.RangeTree_Start, style, styleType);
                offset = this.Core_MergeIdenticalTrees(this.RangeTree_Start);
                selection.setPosition(this.GetTailofTree(this.RangeTree_End), caretPosition + offset);
            }
            else {
                //Figure out if I'm adding or Removing Tags
                //let behavior = this.Core_DetermineStyleBehavior(StyleTag);
                let caretStartPosition = 0;
                let caretEndPosition = range.endOffset;

                if (range.startOffset !== 0) {
                    //Function 1
                    this.Core_DivideContainer_New_Front(this.RangeTree_Start, Const.Tree);

                }
                //else { //Handle the RangeTree_Start to calculate the caretStartPosition
                this.ApplyNewStyle(this.RangeTree_Start, style, styleType);
                caretStartPosition = this.Core_MergeIdenticalTree_Previous(this.RangeTree_Start);
                //}

                //Possible Selection Patterns for Middle Nodes
                //1. Entire Tree iter is Selected
                let iter = { block: this.StartBlock, tree: this.Iterate_Tree_Next(this.RangeTree_Start) };
                let tempiter = this.RangeTree_Start;
                while (iter.tree !== this.RangeTree_End) {
                    if (iter.tree === null) {
                        iter = this.Block_Traversal_Iterate_To_Next(iter.block, tempiter);
                    }
                    else {
                        this.ApplyNewStyle(iter.tree, style, styleType);
                        this.Core_MergeIdenticalTree_Previous(iter.tree);
                        tempiter = iter.tree;
                        iter.tree = this.Iterate_Tree_Next(iter.tree);
                    }
                }

                //Possible Selection Patterns for 
                //1. Entire End Tree is Selected - divide not necessary
                //2. Front Half of End Tree is Selected - Do division
                if (this.atContainerEnd(this.RangeTree_End, range) === false) {
                    this.Core_DivideContainer_New_End(this.RangeTree_End, Const.Tree);
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

    Iterate_Tree_Next(tree) {
        let next = Iterate_Sibling_Next(tree);
        if (next !== null) {
            if (next.tagName === Const.Link) {
                next = Iterate_FirstChild(next);
            }
        }
        else {
            if (tree.parentNode.tagName === Const.Link) {
                next = this.Iterate_Tree_Next(tree.parentNode);
            }
        }
        return next;
    }


    ToggleLink(behavior) {

        let selection = document.getSelection();
        if (behavior === Behavior.Add) {

            if (selection.type === 'Caret') {
                this.Selection_LazySelector_Word();
            }
            let range = selection.getRangeAt(0);

            if (selection.type === 'Range' && this.StartBlock === this.EndBlock) {
                let link = 'https://';
                if (this.RangeTree_Start.parentNode.tagName === Const.Link) {
                    link = this.RangeTree_Start.parentNode.href;
                }
                else if (this.RangeTree_End.parentNode.tagName === Const.Link) {
                    link = this.RangeTree_End.parentNode.href;
                }

                link = prompt('Enter a URL:', link);
                if (link !== null) {

                    if (this.RangeTree_Start.parentNode.tagName === Const.Link) {
                        this.RangeTree_Start.parentNode.href = link;
                    }
                    else if (this.RangeTree_End.parentNode === Const.Link) {
                        this.RangeTree_End.parentNode.href = link;
                    }
                    else {


                        if (this.atContainerStart(this.RangeTree_Start, range) === false) {
                            this.Core_DivideContainer_New_Front(this.RangeTree_Start, Const.Tree);
                        }
                        if (this.atContainerEnd(this.RangeTree_End, range) === false) {
                            this.Core_DivideContainer_New_End(this.RangeTree_End, Const.Tree);
                        }

                        let deepclone = new CloneWithRange(this.RangeTree_Start.parentNode, range);
                        let alink = deepclone.GetMiddle_TrimInverseSelections(Const.Link);
                        this.RangeTree_Start.insertAdjacentElement('beforebegin', alink);
                        alink.href = link;
                        let iter = this.RangeTree_Start;
                        while (iter !== this.RangeTree_End && iter !== null) {
                            let temp = iter;
                            iter = this.Iterate_Tree_Next(iter);
                            temp.remove();
                        }
                        if (iter === this.RangeTree_End) {
                            iter.remove();
                        }
                        let lastchild = this.GetTailofTree(Iterate_LastChild(alink));
                        selection.setBaseAndExtent(this.GetTailofTree(Iterate_FirstChild(alink)), 0, lastchild, lastchild.textContent.length);

                    }
                }
            }
        }
        else {

            if (this.RangeTree_Start.parentNode.tagName === Const.Link && this.RangeTree_Start.parentNode === this.RangeTree_End.parentNode) {
                let length = Iterate_LastChild(this.RangeTree_End.parentNode).textContent.length;
                let offset = 0;
                let clone = null;
                Array.from(this.RangeTree_Start.parentNode.childNodes).forEach((node) => {
                    clone = node.cloneNode(true);
                    if (isIgnorable(clone) === false) {
                        this.RangeTree_Start.parentNode.insertAdjacentElement('beforebegin', clone);
                        offset = this.Core_MergeIdenticalTrees(clone);
                    }

                });
                this.RangeTree_Start.parentNode.remove();
                offset = this.Core_MergeIdenticalTrees(clone);
                let text = this.GetTailofTree(clone);
                selection.setPosition(text, length + offset, text, length + offset);
            }
            else {

                let iter = { block: this.StartBlock, tree: this.RangeTree_Start };
                let tempiter = this.RangeTree_Start;
                let clone = this.GetTailofTree(this.RangeTree_Start);
                while (iter.tree !== this.RangeTree_End) {
                    if (iter.tree === null) {
                        iter = this.Block_Traversal_Iterate_To_Next(iter.block, tempiter);
                    }
                    else {

                        tempiter = iter.tree;
                        iter.tree = this.Iterate_Tree_Next(iter.tree);
                        let temp = tempiter;
                        if (temp.parentNode.tagName === Const.Link) {
                            Array.from(temp.parentNode.childNodes).forEach((node) => {
                                clone = node.cloneNode(true);
                                temp.parentNode.insertAdjacentElement('beforebegin', clone);
                                tempiter = clone;
                                this.Core_MergeIdenticalTree_Previous(clone);
                            });
                            temp.parentNode.remove();
                            this.Core_MergeIdenticalTree_Previous(iter.tree);
                        }
                    }
                }
                let offset = 0;
                if (this.RangeTree_End.parentNode.tagName === Const.Link) {

                    let clone = null;
                    Array.from(this.RangeTree_End.parentNode.childNodes).forEach((node) => {
                        clone = node.cloneNode(true);
                        this.RangeTree_End.parentNode.insertAdjacentElement('beforebegin', clone);
                        offset = this.Core_MergeIdenticalTrees(clone);
                    });
                    this.RangeTree_End.parentNode.remove();
                    offset = this.Core_MergeIdenticalTrees(clone);
                    let text = this.GetTailofTree(clone);
                    selection.setPosition(text, length + offset, text, length + offset);
                }
                else {
                    offset = this.Core_MergeIdenticalTree_Previous(this.RangeTree_End);
                    let text = this.GetTailofTree(this.RangeTree_End);
                    selection.setPosition(text, length + offset, text, length + offset);
                }
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
                        this.Core_DivideContainer_New_End(this.RangeTree_Start, Const.Tree);
                    }
                    else {

                        if (this.atContainerEnd(this.RangeTree_End, range) === false) {
                            this.Core_DivideContainer_New_End(this.RangeTree_Start, Const.Tree);
                        }
                        this.Core_DivideContainer_New_Front(this.RangeTree_Start, Const.Tree);
                    }
                }
                let caretPosition = this.RangeTree_Start.textContent.length;
                let offset = 0;
                // All Trees Are full Selection After Divide
                this.Core_ImplementTag_Tree(this.RangeTree_Start, StyleTag, Behavior.Toggle);
                offset = this.Core_MergeIdenticalTrees(this.RangeTree_Start);
                selection.setBaseAndExtent(this.GetTailofTree(this.RangeTree_Start), offset, this.GetTailofTree(this.RangeTree_End), caretPosition + offset);

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
                    this.Core_DivideContainer_New_Front(this.RangeTree_Start, Const.Tree);
                }
                //else { //Handle the RangeTree_Start to calculate the caretStartPosition
                this.Core_ImplementTag_Tree(this.RangeTree_Start, StyleTag, behavior);
                caretStartPosition = this.Core_MergeIdenticalTree_Previous(this.RangeTree_Start);
                //}

                //Possible Selection Patterns for Middle Nodes
                //1. Entire Tree iter is Selected
                let iter = { block: this.StartBlock, tree: this.Iterate_Tree_Next(this.RangeTree_Start) };
                let tempiter = this.RangeTree_Start;
                while (iter.tree !== this.RangeTree_End) {
                    if (iter.tree === null) {
                        iter = this.Block_Traversal_Iterate_To_Next(iter.block, tempiter);
                    }
                    else {
                        this.Core_ImplementTag_Tree(iter.tree, StyleTag, behavior);
                        this.Core_MergeIdenticalTree_Previous(iter.tree);
                        tempiter = iter.tree;
                        iter.tree = this.Iterate_Tree_Next(iter.tree);
                    }
                }

                //Possible Selection Patterns for
                //1. Entire End Tree is Selected - divide not necessary
                //2. Front Half of End Tree is Selected - Do division
                if (this.atContainerEnd(this.RangeTree_End, range) === false) {
                    this.Core_DivideContainer_New_End(this.RangeTree_End, Const.Tree);
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
    FindTargetTree(Block, TextNode) {
		let type = document.getSelection().type;
        if (this.Block_is_Standard_Structure(Block)) {
            if (TextNode === Block) {
				if(type === 'Caret'){
				    TextNode = this.NormalizeBlock(TextNode);
					document.getSelection().getRangeAt(0).setStart(TextNode, 0);
				}

            }
            else {
                while (TextNode.parentNode !== Block && TextNode.tagName !== Const.Tree) {
                    TextNode = TextNode.parentNode;
                }
            }
        }
        else if (this.Block_is_List_Structure(Block)) {
            if (TextNode.parentNode === Block) {
                if(type === 'Caret'){
					TextNode = this.NormalizeBlock(TextNode);
					document.getSelection().getRangeAt(0).setStart(TextNode, 0);
				}
            }
            else {
                while (TextNode.parentNode.tagName !== ListStructures.ListItem && TextNode.tagName !== Const.Tree) {
                    TextNode = TextNode.parentNode;
                }
            }
        }

        if (TextNode.nodeType === Node.TEXT_NODE) {
            if (TextNode.previousSibling !== null) {
                let element = document.createElement(Const.Tree);
                let text = document.createTextNode(TextNode.textContent);
                element.appendChild(text);
                TextNode.parentNode.replaceChild(element, TextNode);
                let length = element.textContent.length;
                this.Core_MergeIdenticalTrees(element);
                document.getSelection().getRangeAt(0).setStart(text, length);
                TextNode = element;
            }
        }

        return TextNode;
    }

    NormalizeBlock(BlockNode) {

        let element = document.createElement(Const.Tree);
        element.appendChild(document.createElement(Void.Break));
        BlockNode.removeChild(Iterate_FirstChild(BlockNode));
        BlockNode.appendChild(element);
        BlockNode = element;
        return element;
    }

    RepairTargetTree() { //Prototype Code - Default Browser Behaviors can mishandle the tree structure
        //Normalize the RangeTree, If a tree has more than 2 children, adding a character wasn't added in a new tree
        let range = document.getSelection().getRangeAt(0);

        if (this.RangeTree_Start !== null) {
            if (this.RangeTree_Start.childNodes.length >= 2) {
                if (this.RangeTree_Start.lastChild.tagName === Void.Break) {
                    let tree = this.CreateNewTextTree();
                    this.RangeTree_Start.insertAdjacentElement('afterend', tree);
                    this.RangeTree_Start.removeChild(this.RangeTree_Start.lastChild);
                }
                else {
                    console.log('Repair Target Tree: RangeTree');
                    let clone = this.RangeTree_Start.lastChild.cloneNode(true);
                    this.RangeTree_Start.lastChild.remove();
                    let element = document.createElement(Const.Tree);
                    element.appendChild(clone);
                    this.RangeTree_Start.insertAdjacentElement('afterend', element);
                    let length = element.textContent.length;
                    this.Core_MergeIdenticalTrees(element);
                    range.setStart(this.GetTailofTree(element), length);
                    range.setEnd(range.startContainer, range.startOffset);
                }
            }

        }

        return range;
    }

    NormalizeTreelessTextNode() {
        let range = document.getSelection().getRangeAt(0);

        return range;
    }

    RebuildTargetSelections() {
        this.UpdateTargets();
        this.ToggleInterfaceButtons();
        this.AddTargetHighLights();
    };

    UpdateTargets() {
        let range = this.RepairTargetTree();

        this.StartBlock = this.Target_FindBlock(range.startContainer);
        this.EndBlock = this.Target_FindBlock(range.endContainer);
        this.RangeTree_Start = this.FindTargetTree(this.StartBlock, range.startContainer);
        //this.RangeTree_Start = this.FindTargetStartTree(range.startContainer);
        if (range.startContainer === range.endContainer) {
            this.RangeTree_End = this.RangeTree_Start;
        }
        else {
            this.RangeTree_End = this.FindTargetTree(this.EndBlock, range.endContainer);
            //this.RangeTree_End = this.FindTargetEndTree(range.endContainer);
        }
    }

    ToggleInterfaceButtons() {
        if (this.StandardBlockSelector !== null)
            this.StandardBlockSelector.value = this.StartBlock.tagName;
        if (document.getSelection().type === 'Caret') {
            if (this.FontFamilySelector !== null)
                this.FontFamilySelector.value = this.RangeTree_Start.style.fontFamily;
            if (this.ColorSelector !== null)
                this.ColorSelector.value = this.RangeTree_Start.style.color;
            if (this.BackgroundColorSelector !== null)
                this.BackgroundColorSelector.value = this.RangeTree_Start.style.backgroundColor;
            if (this.FontSizeSelector !== null)
                this.FontSizeSelector.value = this.RangeTree_Start.style.fontSize;
        }
        else {
            if (this.FontFamilySelector !== null)
                this.FontFamilySelector.value = "none";
            if (this.ColorSelector !== null)
                this.ColorSelector.value = "none";
            if (this.BackgroundColorSelector !== null)
                this.BackgroundColorSelector.value = "none";
            if (this.FontSizeSelector !== null)
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
                iter = Iterate_Sibling_Next(iter);
                //iter.classList.add('c-menu');
            }
            while (iter !== this.EndBlock);
        }

        //Todo: highLight inner attributes
        this.RangeTree_Start.classList.add('text-bg');
        this.RangeTree_End.classList.add('text-bg');

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

        if (this.RangeTree_Start !== null) {
            this.RangeTree_Start.classList.remove('text-bg');
        }
        if (this.RangeTree_End !== null) {
            this.RangeTree_End.classList.remove('text-bg');
        }

    };

    Block_Standard_Behavior_ShiftEnterKey() {
        let rangeclone = document.getSelection().getRangeAt(0).cloneRange();

        if (this.atContainerEnd(this.RangeTree_End, rangeclone)) {

            if (this.GetTailofTree(this.RangeTree_End).nodeType === Node.TEXT_NODE) {
                if (Iterate_Sibling_Next(this.RangeTree_Start) === null) {

                    let firstTree = this.CreateNewTextTree();
                    this.RangeTree_Start.insertAdjacentElement('afterend', firstTree);
                    this.RangeTree_Start = firstTree;
                }
                else {
                    this.RangeTree_Start = Iterate_Sibling_Next(this.RangeTree_Start);
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

                this.Core_DivideContainer_New_Front(this.RangeTree_Start, Const.Tree);
                this.RangeTree_Start.insertAdjacentElement('beforebegin', this.CreateNewTextTree());
                let text = this.GetTailofTree(this.RangeTree_Start);
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
            newparagraph = Iterate_FirstChild(newparagraph);
        }
        else if (this.atContainerStart(this.StartBlock, rangeclone)) {
            newparagraph = this.CreateNewBlock();
            this.EndBlock.insertAdjacentElement('beforebegin', newparagraph);
            newparagraph = Iterate_FirstChild(newparagraph);
        }
        else {
            this.Core_DivideContainer_New_Front(this.StartBlock, this.StartBlock.tagName);
            newparagraph = this.GetTailofTree(this.StartBlock);
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

                let previous = this.Block_Traversal_Iterate_To_Previous(this.StartBlock, this.RangeTree_Start);
                if (previous.block !== null) {
                    rangeclone = this.Delete_BKWD_BlockBehavior(previous);
                    selection.removeAllRanges();
                    selection.addRange(rangeclone);
                }

            }
            else {
                let previousTree = Iterate_Sibling_Previous(this.RangeTree_Start);
                if (this.RangeTree_Start.textContent.length === 1) {
                    if (previousTree !== null) {
                        event.preventDefault();
                        event.stopPropagation();
                        let tail = this.GetTailofTree(previousTree);
                        if (previousTree.nodeType === Node.TEXT_NODE) {
                            this.RangeTree_Start.remove();
                            let length = tail.textContent.length;
                            this.Core_MergeIdenticalTrees(previousTree);
                            rangeclone.setStart(tail, length);
                            rangeclone.setEnd(tail, length);
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
                        let previousBlock = Iterate_Sibling_Previous(this.StartBlock);
                        if (previousBlock === null) {//!IMPORTANT Recreate the First Block in the Document
                            event.preventDefault();
                            event.stopPropagation();
                            let block = this.CreateNewBlock();
                            this.StartBlock.insertAdjacentElement('beforebegin', block);
                            this.Page.replaceChild(block, this.StartBlock);
                            rangeclone.setStart(Iterate_FirstChild(block), 0);
                            rangeclone.setEnd(rangeclone.startContainer, 0);
                            selection.removeAllRanges();
                            selection.addRange(rangeclone);
                        }
                    }

                }
                else if (this.GetTailofTree(previousTree).nodeType !== Node.TEXT_NODE) { //Remove BR Tree and Try to Merge
                    event.preventDefault();
                    event.stopPropagation();
                    previousTree.remove();
                    let length = this.Core_MergeIdenticalTree_Previous(this.RangeTree_Start);
                    rangeclone.setStart(this.GetTailofTree(this.RangeTree_Start), length);
                    rangeclone.setEnd(this.GetTailofTree(this.RangeTree_Start), length);
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

                let next = this.Block_Traversal_Iterate_To_Next(this.StartBlock, this.RangeTree_Start);
                if (next.block !== null) {
                    rangeclone = this.Delete_FWD_NextBlockBehavior(next);
                    selection.removeAllRanges();
                    selection.addRange(rangeclone);
                }
            }
            else {
                let nextTree = Iterate_Sibling_Next(this.RangeTree_Start);               //TextContent Length 1 is testing for a single character, Stable?
                if (this.GetTailofTree(nextTree).nodeType !== Node.TEXT_NODE || nextTree.textContent.length === 1) {
                    event.preventDefault();
                    event.stopPropagation();
                    nextTree.remove();
                    let length = this.RangeTree_Start.textContent.length;
                    this.Core_MergeIdenticalTrees(this.RangeTree_Start);
                    rangeclone.setStart(this.GetTailofTree(this.RangeTree_Start), length);
                    rangeclone.setEnd(this.GetTailofTree(this.RangeTree_Start), length);
                    selection.removeAllRanges();
                    selection.addRange(rangeclone);
                }
            }
        }
        return rangeclone;
    }

    // Editor Text Traversal - Finds the Next Block and returns the new block and tree iters
    Block_Standard_FWD_Traversal_SubRoutine(block) {
        let tree = null;
        block = Iterate_Sibling_Next(block);
        if (block !== null) {
            tree = this.Block_Traverse_GetFirstTree(block);
        }
        return { block, tree };
    }

    Block_Standard_BKWD_Traversal_SubRoutine(block) {
        let tree = null;
        block = Iterate_Sibling_Previous(block);
        if (block !== null) {
            tree = this.Block_Traverse_GetLastTree(block);
        }
        return { block, tree };
    }

    Block_Standard_GetFirstTree(block) {
        let tree = Iterate_FirstChild(block);
        return tree;
    }
    Block_Standard_GetLastTree(block) {
        let tree = Iterate_LastChild(block);
        return tree;
    }

    Block_List_Behavior_ShiftEnterKey() {
        let rangeclone = document.createRange();
        let li = document.createElement('li');
        let span = document.createElement(Const.Tree);
        let br = document.createElement(Void.Break);
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
            if (currentListItem === Iterate_FirstChild(this.StartBlock)) {
                let li = this.CreateNewListItem();
                currentListItem.insertAdjacentElement('afterend', li);
                rangeclone.setStart(Iterate_FirstChild(li), 0);
                rangeclone.setEnd(rangeclone.startContainer, 0);
            }
            else {
                this.StartBlock.removeChild(currentListItem);
                let block = this.CreateNewBlock();
                this.StartBlock.insertAdjacentElement('afterend', block);
                rangeclone.setStart(Iterate_FirstChild(block), 0);
            }
        }
        else {
            if (this.atContainerStart(currentListItem, rangeclone)) {
                let listitem = this.CreateNewListItem();
                currentListItem.insertAdjacentElement('beforebegin', listitem);
                rangeclone.setStart(Iterate_FirstChild(listitem), 0);
                rangeclone.setEnd(rangeclone.startContainer, 0);

            }
            else if (this.atContainerEnd(currentListItem, rangeclone)) {
                let listitem = this.CreateNewListItem();
                currentListItem.insertAdjacentElement('afterend', listitem);
                rangeclone.setStart(Iterate_FirstChild(listitem), 0);
                rangeclone.setEnd(rangeclone.startContainer, 0);
            }
            else {
                this.Core_DivideContainer_New_Front(currentListItem, ListStructures.ListItem);
                rangeclone.setStart(this.GetTailofTree(currentListItem), 0);
                rangeclone.setEnd(rangeclone.startContainer, 0);
            }
        }
        return rangeclone;
    }

    //Back Space Only executes if character is at the very start of the list item text.
    Block_List_Behavior_BackspaceKey(event) {
        let selection = document.getSelection();
        let rangeclone = selection.getRangeAt(0).cloneRange();

        let currentList = this.RangeTree_Start.parentNode;
        if (this.atContainerStart(currentList, rangeclone)) { //Handle Backspace at ListItem Level
            event.preventDefault();
            event.stopPropagation();

            if (Iterate_FirstChild(this.StartBlock) === currentList) {
                let previous = this.Block_Traversal_Iterate_To_Previous(this.StartBlock, this.RangeTree_Start);
                if (previous.block !== null) {
                    rangeclone = this.Delete_BKWD_BlockBehavior(previous);
                }
            }
            else {
                let previousList = Iterate_Sibling_Previous(currentList);
                if (previousList.textContent.length === 0) {
                    previousList.remove();
                }
                else if (currentList.textContent.length === 0) {

                    let last = this.GetTailofTree(Iterate_LastChild(previousList));
                    if (last.nodeType === Node.TEXT_NODE) {
                        rangeclone.setStart(last, last.textContent.length);
                        rangeclone.setEnd(last, last.textContent.length);
                    }
                    else {
                        rangeclone.setStart(last.parentNode, 0);
                        rangeclone.setEnd(last.parentNode, 0);
                    }
                    currentList.remove();
                }
                else {
                    let tempclone = document.createRange();
                    tempclone.selectNodeContents(previousList);
                    currentList.prepend(tempclone.extractContents());
                    tempclone.detach();
                    let offset = this.Core_MergeIdenticalTree_Previous(this.RangeTree_Start);
                    previousList.remove();
                    rangeclone.setStart(this.GetTailofTree(this.RangeTree_Start), offset);
                    rangeclone.setEnd(this.GetTailofTree(this.RangeTree_Start), offset);
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
            if (Iterate_LastChild(this.StartBlock) === targetList) {
                let next = this.Block_Traversal_Iterate_To_Next(this.StartBlock, this.RangeTree_Start);
                if (next.block !== null) {
                    rangeclone = this.Delete_FWD_NextBlockBehavior(next);
                }
            }
            else {
                let nextSibling = Iterate_Sibling_Next(targetList);
                if (nextSibling.textContent.length === 0) {
                    nextSibling.remove();
                }
                else if (targetList.textContent.length === 0) {
                    let first = this.GetTailofTree(nextSibling);
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
                    tempclone.selectNodeContents(nextSibling);
                    targetList.append(tempclone.extractContents());
                    tempclone.detach();
                    let offset = this.RangeTree_Start.textContent.length;
                    nextSibling.remove();
                    this.Core_MergeIdenticalTrees(this.RangeTree_Start);
                    rangeclone.setStart(this.GetTailofTree(this.RangeTree_Start), offset);
                    rangeclone.setEnd(rangeclone.startContainer, offset);
                }
            }
            selection.removeAllRanges();
            selection.addRange(rangeclone);
        }
        return rangeclone;
    }

    /* List Traversal - Has an Extra Step to traverse to the next list item before traversing to the next Block */
    Block_List_FWD_Traversal_SubRoutine(block, LINode) {

        let nextlistitem = Iterate_Sibling_Next(LINode);
        let tree = null;
        if (nextlistitem === null) {
            block = Iterate_Sibling_Next(block);
            if (block !== null) {
                tree = this.Block_Traverse_GetFirstTree(block);
            }
        }
        else {
            tree = Iterate_FirstChild(nextlistitem);
        }
        return { block, tree };
    }

    Block_List_BKWD_Traversal_SubRoutine(block, LINode) {
        let prevlistitem = Iterate_Sibling_Previous(LINode);
        let tree = null;
        if (prevlistitem === null) {
            block = Iterate_Sibling_Previous(block);
            if (block !== null) {
                tree = this.Block_Traverse_GetLastTree(block);
            }
        }
        else {
            tree = Iterate_LastChild(prevlistitem);
        }
        return { block, tree };
    }

    Block_List_GetFirstTree(block) {
        let tree = Iterate_FirstChild(block);
        tree = Iterate_FirstChild(tree);
        return tree;
    }
    Block_List_GetLastTree(block) {
        let tree = Iterate_LastChild(block);
        tree = Iterate_LastChild(tree);
        return tree;
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
            let endInit = Iterate_LastChild(this.fragment);
            while (endInit.lastChild !== null) {
                endInit = Iterate_LastChild(endInit);
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

    isElementEmpty(childNode) {
        let isEmpty = false;
        if (childNode.textContent === "") {
            isEmpty = true;
        }
        else {
            while (Iterate_LastChild(childNode) !== null) {
                childNode = Iterate_LastChild(childNode);
            }
            if (childNode.nodeType !== Node.TEXT_NODE) {
                if (childNode.tagName !== Void.Break) {
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
        let lastchild = element.lastChild;// Iterate_LastChild(element); //
        if (this.isElementEmpty(lastchild)) {
            element.removeChild(lastchild);
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

function isWhiteSpace(node) {
    return !/[^\t\n\r ]/.test(node.textContent);
}
function isIgnorable(node) {
    return (node.nodeType === Node.COMMENT_NODE || (node.nodeType === Node.TEXT_NODE && isWhiteSpace(node)));
}
function Iterate_Sibling_Next(container) {
    while (container = container.nextSibling) {
        if (!isIgnorable(container)) {
            return container;
        }
    }
    return null;
}
function Iterate_Sibling_Previous(container) {

    while (container = container.previousSibling) {
        if (!isIgnorable(container)) {
            return container;
        }
    }
    return null;
}
function Iterate_FirstChild(parentNode) {
    let child = parentNode.firstChild;
    while (child) {
        if (!isIgnorable(child)) {
            return child;
        }
        child = child.nextSibling;
    }
    return null;
}
function Iterate_LastChild(parentNode) {
    let child = parentNode.lastChild;
    while (child) {
        if (!isIgnorable(child)) {
            return child;
        }
        child = child.previousSibling;
    }
    return null;
}