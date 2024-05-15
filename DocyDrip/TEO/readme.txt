DocyDrip - Text Editor Obejct
By: Tyler Reber
Version 0.5 - Alpha

CORS POLICY Error AND SOLUTION - FOR BEGINNERS
Refactor is Separating UI Files and Global Constants into a new file. This means that I will be importing and exporting variables between these 2 files. When I change a script to a type of module, it will will cause the CORS policy error.

I think the CORS Policy Error is to prevent the JavaScript code from calling and accessing files on your personal computer. I suspect that its a security feature.

SOLUTION
Solution involves launching a server to test Development on. 

My chosen development environment is notepad++, specifcally to cache these kinds of issues without the having to deal with the nuances that come with bulky IDE like visual studio.
https://www.apachefriends.org/
Video how to set it up.
https://www.youtube.com/watch?v=k9em7Ey00xQ&t

I went to the Installation Folder and Pasted in the solution
C:\xampp\htdocs\TEO
	header('Location: '.$uri.'/TEO/');  // Replace dashbored Path '/dashboard/' with '/TEO/'

Run the Server and type in Local host into the browser.


TEO - Rich Text Object TEO is a single class that creates objects that Creates the buttons, the events and manages how the structure 
is built inside the DOM Tree 
Disclaimer - Alpha release still has a few areas I haven't decided the best way to address, I'm still 
considering way to make it more user friendly and easier for people to customize. I might refactor some of the names.

This Editor was split into 3 seperate Files, TEO Class, UI File and the globals file.
The TEO Object works the same regardless of the User Interface. Everything related to the UI is packed into a seperate file to give the developer easier access to Customizing the UI.
the Globals File stores commonly used strings to also allow the developer to use custom tags unique to his site.


The Editor Works With Custom Classes, Variable names are stored in const global declarations at the top of the file.
Customizing the Editor to work with your site's custom classes and tags should be as easy as altering global variables at the top of the JS file.

How It Works -
HTML is an abstraction of a data structure similar to a doubly linked list. What gives the different HTML tags their unique charactistics is the browser,
or runtime environment.

Underneath the HTML tags and CSS Classes are just nodes that hold references to eachother. TEO is a solution that uses tagNames to identify the strucure
a group of nodes exist in the document. If we know what shape the data will exist in, we can create custom behaviors and alorithim for that structure.

References
this.Page is the DIV element with the Content Editable Area
Block - is an immediate Child of this.Page, (paragraphs, lists)
Tree - is a SPAN/container that holds a text 


Targeting System
The solution uses a Targeting System to identify the Blocks, Trees that the caret is currently on.
Event: selectionchange is used to rebuild the targets everytime the caret changes position.

Rebuild Targets and stores a reference to the Starting Block, ending Block, Start Tree and End Tree


Rules - 
	Only 1 Text Node will ever Exist inside a Tree, all nodes inside the Tree should never have siblings.(Trees Can be Divided into as many trees as there are characters)
	When Dividing Container, the Block and Tree Targets in the targeting system are preserved and never destroyed. (Exception is for delete operations.
	
Structures - 
Standard Structure Example - <start of BLOCK> <TREE> <TREE> <TREE> <end of BLOCK> - Blocks that use this Structure - P, H1 to H6
List Structure - <UL/OL> <LI> <TREE><TREE> </LI> <UL/OL> - 

Adding new BLocks
Adding a Block Involves knowing the shape of the data structure used to make it.

Some Functions will need to be to identify the kind of structure it has to determine what methods it should run, this functions can easily be
included without needing to handle the other structure if its still not in alpha release.

Block_is_[yourname]_Structure
Block_[yourname]_Behavior_ShiftEnterKey()
Block_[yourname]_Behavior_BackspaceKey()
Block_[yourname]_Behavior_DeleteKey()
Block_[yourname]_Traversal_SubRoutine()